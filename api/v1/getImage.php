<?php
    require_once "../dbconnexion.php";

    if(!isset($_GET["app"]) || !isset($_GET["api"]) || !isset($_GET["image"]))
    {
        echo"here";
        notAuthorized();
    }
    else{
        $package =  $_GET["app"];
        $key =  $_GET["api"];
        $image =  $_GET["image"];

        $req = "SELECT id FROM app where packageName = '$package' and api_key = '$key'";
        $res  = execReqN($req);
        if(sizeof($res) > 0) // app exist
        {
            $req = "SELECT path from image where id = '$image'";
            $res  = execReqN($req);
            if(sizeof($res)>0) // list exist
            {
                $path = $res[0];
                header('Location: ../../'.$path->path);
            }
            else{
                notAuthorized();
            }

           /* $count = sizeof($res);
            for ($i=0; $i < $count; $i++) { 
                $lid = $res[$i]->id;
                $req = "SELECT * from live_wallpapers where id in (SELECT wallpaper_id from list_wallpaper where list_id = '$lid')";
                $res2 = execReqN($req);
                $res[$i]->wallpapers = $res2;
            }*/
        }
        else{
            notAuthorized();
        }
    }
    


    function notAuthorized()
    {
        echo "{\"code\":\"-1\",\"Message\":\"Not authorized\"}";

    }




    function execReq($req)
    {
         $pdo = DBConnection::getInstance()->getConnection();
         $result = $pdo->query($req)->fetchAll(PDO::FETCH_OBJ); 
         return json_encode($result);
    }
    function execReqN($req)
    {
         $pdo = DBConnection::getInstance()->getConnection();
         $result = $pdo->query($req)->fetchAll(PDO::FETCH_OBJ); 
         return $result;
    }



?>