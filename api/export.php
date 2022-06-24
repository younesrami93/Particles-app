<?php
require_once "All.php";

if(isset($_GET["id"]))
{
    $id = $_GET["id"];    
    export($id,true);
}
else{
  // showError(-3,"not enough parameters");
}

function export($id,$returnFile)
{
    $req = "SELECT id,title,image,json,images FROM live_wallpapers WHERE id = '$id'";
    $res = All::execReqN($req);
    if(sizeof($res)== 0)
        return;
    //var_dump($res[0]);
    $zip = zipWallpaper($res[0]);
    if($returnFile)
        header('Location: '.$zip);
}


?>