<?php
    require_once "All.php";
    require_once "login_verification.php";

    $user_id = getUser()->id;
    $req = "SELECT id,title,description FROM ps_preset where user_id= '$user_id'";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);

?>