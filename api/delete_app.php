<?php
require_once "All.php";
require_once "login_verification.php";

if(!isset($_GET['id']))
{
   showError(-3,"not enough Parameters!");
   return 0;
}
$id = $_GET['id'];
$res = All::deleteWhere("app_list"," WHERE app_id = '$id'");
$res = All::delete("app",$id);

if($res)
{
   showMessage("deleted successfully");
}
else{
   showError(-2,"error while deleting from database");
}