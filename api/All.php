<?php 
usleep( 1 * 10000 );
$packages_password = "pass";//"5a5a114c7c0b4a3394e87fb7901d1bbf0bc627d3";
require_once "dbconnexion.php";
$currenUser;
function getUser()
{
    return $GLOBALS["currenUser"];
}
function zipWallpaper($wallpaper)
{
    $zip = new ZipArchive;
    session_start();
    $zipPath = "../packages/".$wallpaper->id.".uwlp";

    $images= $wallpaper->images;
    if(strlen($images) == 0 || strlen($wallpaper->json) == 0)
    {
        echo "Wallpaper has no content yet";
        exit();
    }

    deleteFile($zipPath);

    if ($zip->open($zipPath, ZipArchive::CREATE) === TRUE)
    {
        $json = json_encode($wallpaper);
        $zip->setPassword( $GLOBALS["packages_password"]);
        addTextToZip($zip,$json,"animation.data");

        $req = "SELECT * FROM image WHERE id in (".$images.")";
        $res = All::execReqN($req);
        $count =  sizeof($res);
        for ($i=0; $i < $count; $i++) { 
            $path =  "../".$res[$i]->path;
            $name =  substr($res[$i]->path,strpos($res[$i]->path,"/")+1);
            $path_info = pathinfo($path);
            $name = $res[$i]->id;//.".".$path_info['extension'];
            addFileToZip($zip,$path,$name);
        }
        if($wallpaper->image != "")
            addFileToZip($zip,"../".$wallpaper->image,"thumbnail.jpg");
        $zip->close();
        return $zipPath;
    }
    return null;
}
function addFileToZip($zip,$file,$fileName)
{
    $zip->addFile($file,$fileName);
    $zip->setEncryptionName($fileName,ZipArchive::EM_AES_256); 
}

function addTextToZip($zip,$text,$fileName)
{
    $zip->addFromString($fileName, $text);
    $zip->setEncryptionName($fileName,ZipArchive::EM_AES_256); 
}
function showResult($res)
{
    echo "{\"code\":1,\"result\":$res}";
}
function showMessage($msg)
{
    echo "{\"code\":1,\"message\":\"$msg\"}";
}
function showError($code,$message)
{
    echo "{\"code\":$code,\"message\":\"$message\"}";
}

function deleteFile($file)
{
    if (!unlink($file)) {  
        return false;
    }  
    else {  
        return true;
    }  
}
class All
{    
    public static function add($table,$values)
    {
         $req = "insert into ".$table." values(".$values.")";
         $pdo = DBConnection::getInstance()->getConnection();
         $execReq = $pdo->prepare($req); 
         $res =  $execReq->execute();
         return $res;
        // return $pdo->lastInsertId();
    }
    public static function add2($table,$values)
    {
         $req = "insert into ".$table." values(".$values.")";
         $pdo = DBConnection::getInstance()->getConnection();
         $execReq = $pdo->prepare($req); 
         $res =  $execReq->execute();
         if($res)
            return $pdo->lastInsertId();
        else
            return-1;
    }
    public static function addMultiple($table,$values)
    {
         $req = "insert into ".$table." values ".$values;
         $pdo = DBConnection::getInstance()->getConnection();
         $execReq = $pdo->prepare($req); 
         $res =  $execReq->execute();
         return $res;
    }
    public static function execReq($req)
    {
         $pdo = DBConnection::getInstance()->getConnection();
         $result = $pdo->query($req)->fetchAll(PDO::FETCH_OBJ); 
         return json_encode($result);
    }
    public static function execReqN($req)
    {
         $pdo = DBConnection::getInstance()->getConnection();
         $result = $pdo->query($req)->fetchAll(PDO::FETCH_OBJ); 
         return $result;
    }

    public static function update($table,$args,$id)
    {
        $req ="update $table set ";
        foreach($args as $arg => $arg_value) 
        {
            $req.="$arg='$arg_value',";
        }
        $index= strlen($req)-1;
        $req = substr($req,0,$index);
        $req .=" where id=?";
        $pdo = DBConnection::getInstance()->getConnection();
        $execReq = $pdo->prepare($req); 
        $res = $execReq->execute([$id]);
        return $res;
    }
    public static function delete($table,$id)
    {
        $req ="delete from $table where id=? ";
        $pdo = DBConnection::getInstance()->getConnection();
        $execReq = $pdo->prepare($req); 
        $res = $execReq->execute([$id]);
        return $res;
    }
    public static function deleteWhere($table,$whereCondition)
    {
        $req ="delete from $table ".$whereCondition;
        $pdo = DBConnection::getInstance()->getConnection();
        $execReq = $pdo->prepare($req); 
        $res = $execReq->execute();
        return $res;
    }
    public static function getNewId($table)
    {
        $req = "SELECT `auto_increment` FROM INFORMATION_SCHEMA.TABLES WHERE table_name = '$table'";
        $pdo = DBConnection::getInstance()->getConnection();
        $result = $pdo->query($req)->fetchAll(PDO::FETCH_OBJ); 
        return $result[0]->auto_increment;
    }
}


function startLoginSession($user)
{
    session_start();
    session_regenerate_id();
    $_SESSION['loggedin'] = TRUE;
    $_SESSION['key'] = $user->hash;
}


function logout()
{
    session_start();
    session_unset();
}

function getUserDetails()
{
    $userId = getUser()->id;
    $req = "SELECT id,name,icon,(select count(id) from live_wallpapers where user_id = '$userId') as wallpapersCount,(select count(id) from app where user_id = '$userId') as appsCount  FROM user WHERE id = '$userId'";
    $res = All::execReqN($req);
    return $res;
}
function checkLogin()
{
  session_start();
  if(isset($_SESSION["key"]))
  {
    $hash = $_SESSION["key"];

    $req = "SELECT * FROM user WHERE hash = '$hash'";
    $res = All::execReqN($req);
    if(sizeof($res)>0)
      return $res[0];
    return null;
  } 
}

?>