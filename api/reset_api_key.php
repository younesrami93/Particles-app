<?php
require_once "All.php";
require_once "login_verification.php";

function createApiKey($id)
{
   $random = rand(100000000,999999999);
   return sha1("app".$id."".$random);
}


if(!isset($_GET['id']))
{
   showError(-3,"parameters required");
   return 0;
}
$id = $_GET['id'];

resetKey($id,true);

function resetKey($id,$redirect)
{
   $arr = [];
   $key = createApiKey($id);
   $arr["api_key"] = $key;
   $res = All::update("app",$arr,$id);
   echo $res;
   if($redirect)
      header('Location: '.'get_app.php?id='.$id);
}
?>