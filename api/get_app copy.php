<?php
require_once "All.php";
require_once "login_verification.php";

if(isset($_GET["id"]))
{
    $user_id = getUser()->id;
    $id = $_GET["id"];    
    $req = "SELECT * FROM app WHERE id = '$id' and user_id= '$user_id'";
    $res = All::execReqN($req);
    $res = json_encode($res[0]);
    showResult($res);
}
else{
   showError(-3,"not enough parameters");
}


?>