<?php
require_once "All.php";
require_once "login_verification.php";

$order = "DESC";
$search = null;
if(isset($_GET["order"]))
    $order = $_GET["order"];

if(isset($_GET["search"]))
    $search = $_GET["search"];

if(isset($_GET["listId"]))
{
    $listId = $_GET["listId"];

    $user_id = getUser()->id;
    $req = "SELECT * FROM live_wallpapers where user_id= '$user_id' AND id in(select wallpaper_id from list_wallpaper where list_id ='$listId') ORDER BY id $order";
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
        $search = " AND title LIKE '%$search%' ";
    else
        $search = "";
    $req = "SELECT * FROM live_wallpapers where user_id= '$user_id' $search ORDER BY id $order LIMIT $position,$count ";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);
}
else{
    $user_id = getUser()->id;
    $req = "SELECT * FROM live_wallpapers where user_id= '$user_id' ORDER BY id $order";
    $res = All::execReqN($req);
    $res = json_encode($res);
    showResult($res);
}



?>