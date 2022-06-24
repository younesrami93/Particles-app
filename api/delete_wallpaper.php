<?php
require_once "All.php";
require_once "login_verification.php";

if(!isset($_GET['id']))
{
   showError(-3,"not enough Parameters!");
   return 0;
}
$id = $_GET['id'];
$res = All::deleteWhere("list_wallpaper"," WHERE wallpaper_id = '$id'");
$res = All::delete("live_wallpapers",$id);

if($res)
{
   showMessage("deleted successfully");
}
else{
   showError(-2,"error while deleting from database");
}