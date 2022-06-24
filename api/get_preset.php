<?php
require_once "All.php";
require_once "login_verification.php";

if(isset($_GET["id"]) || isset($_POST["id"]))
{
    $user_id = getUser()->id;
    $id = isset($_GET["id"]) ? $_GET["id"] : $_POST["id"];    
    $req = "SELECT * FROM ps_preset WHERE id = '$id' and user_id= '$user_id'";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);
}
else{
   showError(-3,"not enough parameters");
}


?>