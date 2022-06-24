<?php
require_once "All.php";
require_once "login_verification.php";

if(isset($_GET["id"]))
{
    $user_id = getUser()->id;
    $id = $_GET["id"];    
    $req = "SELECT * FROM live_wallpapers WHERE id = '$id' and user_id= '$user_id'";
    $res = All::execReqN($req);
    if(sizeof($res)>0)
    {
        $res = json_encode($res[0]);
        showResult($res);
    }
    else{
        showError(-1,"not wallpaper found");
    }
    
}
else{
   showError(-3,"not enough parameters");
}


?>