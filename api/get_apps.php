<?php
require_once "All.php";
require_once "login_verification.php";

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
        $search = " AND (title LIKE '%$search%' OR packageName LIKE '%$search%')";
    else
        $search = "";
    $req = "SELECT *,(SELECT COUNT(*) FROM app_list WHERE app.id = app_list.app_id) AS listCount FROM app where user_id= '$user_id' $search ORDER BY id $order LIMIT $position,$count ";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);
}
else{
    $user_id = getUser()->id;
    $req = "SELECT * FROM app where user_id= '$user_id' ORDER BY id $order";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);
}



?>