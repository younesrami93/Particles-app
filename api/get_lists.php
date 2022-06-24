<?php
require_once "All.php";
require_once "login_verification.php";

$order = "DESC";
$search = null;
if(isset($_GET["order"]))
    $order = $_GET["order"];

if(isset($_GET["search"]))
    $search = $_GET["search"];

if(isset($_GET["appId"]))
{
    $appId = $_GET["appId"];

    $user_id = getUser()->id;
    $req = "SELECT list.*,(SELECT COUNT(*) FROM list_wallpaper WHERE list.id = list_wallpaper.list_id) AS wallpapersCount FROM list inner join app_list on app_list.list_id = list.id where user_id= '$user_id' AND app_list.app_id ='$appId' ORDER BY app_list.id";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);


}
else if(isset($_GET["count"]) && isset($_GET["position"]))
{
    $count = $_GET["count"];
    $position = $_GET["position"];
    $user_id = getUser()->id;
    if($search != null)
        $search = " AND (title LIKE '%$search%' OR label LIKE '%$search%')";
    else
        $search = "";
    $req = "SELECT *,(SELECT COUNT(*) FROM list_wallpaper WHERE list.id = list_wallpaper.list_id) AS wallpapersCount FROM list where user_id= '$user_id' $search ORDER BY id $order LIMIT $position,$count ";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);
}
else{
    $user_id = getUser()->id;
    $req = "SELECT *,(SELECT COUNT(*) FROM list_wallpaper WHERE list.id = list_wallpaper.list_id) AS wallpapersCount FROM list where user_id= '$user_id' ORDER BY id $order";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);
}



?>