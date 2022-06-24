<?php
require_once "All.php";
require_once "login_verification.php";

   if(!isset($_GET["appId"]) || !isset($_GET["lists"]))
   {
      showError(-1,"parameters required");
      return;
   }


   $id = $_GET['appId'];
   $lists = $_GET['lists'];

   $res = All::deleteWhere("app_list"," WHERE app_id = '$id'");
 
   /* if($res)
   {
      showMessage("deleted successfully");
   }
   else{
      showError(-2,"error while deleting from database");
   }*/

   if($lists == "")
   {
      showMessage("All added");
      return;
   }

   $lists = explode(',',$lists);

   $values = "";
   $count = sizeof($lists);
   
   for ($i=0; $i < $count; $i++) { 
      $listId = $lists[$i];
      if($i>0)
         $values = $values.",";
      $values = $values." (NULL, '$id', '$listId') ";
   }
   $res = All::addMultiple("app_list",$values);

   if($res == 1)
      showMessage("All added");
   else
      showError(-2,"error while inserting to database");
?>