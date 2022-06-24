<?php
require_once "All.php";
require_once "login_verification.php";

if(!isset($_GET['id']))
{
   showError(-3,"not enough Parameters!");
   return 0;
}
$id = $_GET['id'];
$res = All::delete("list",$id);
if($res)
{
   showMessage("deleted successfully");
}
else{
   showError(-2,"error while deleting from database");
}