<?php
require_once "All.php";
require_once "login_verification.php";


if(!isset($_GET["type"]))
{
    showError(-3,"not enough parameters");
    exit();
}
$type = $_GET["type"];    


$order = "DESC";
$search = null;
if(isset($_GET["order"]))
    $order = $_GET["order"];

if(isset($_GET["search"]))
    $search = $_GET["search"];


if(isset($_GET["count"]) && isset($_GET["position"]))
{
    $count = $_GET["count"];
    $position = $_GET["position"];
    $user_id = getUser()->id;
    if($search != null)
        $search = " AND name LIKE '%$search%' ";
    else
        $search = "";

    $req = "SELECT * FROM image WHERE type = '$type' and user_id in ('$user_id',0) $search ORDER BY id $order LIMIT $position,$count";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);
}
else
{
    $user_id = getUser()->id;
    $req = "SELECT * FROM image WHERE type = '$type' and user_id in ('$user_id',0)  ORDER BY id $order";
    $res = All::execReq($req);
    showResult($res);
}

?>