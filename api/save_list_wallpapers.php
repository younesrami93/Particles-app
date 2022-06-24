<?php
require_once "All.php";
require_once "login_verification.php";

   if(!isset($_GET["listId"]) || !isset($_GET["wallpapers"]))
   {
      showError(-1,"parameters required");
      return;
   }


   $id = $_GET['listId'];
   $wallpapers = $_GET['wallpapers'];

   $res = All::deleteWhere("list_wallpaper"," WHERE list_id = '$id'");
 
   /* if($res)
   {
      showMessage("deleted successfully");
   }
   else{
      showError(-2,"error while deleting from database");
   }*/

   if($wallpapers == "")
   {
      showMessage("list updated");
      return;
   }

   $wallpapers = explode(',',$wallpapers);

   $values = "";
   $count = sizeof($wallpapers);
   
   for ($i=0; $i < $count; $i++) { 
      $wallpaperId = $wallpapers[$i];
      if($i>0)
         $values = $values.",";
      $values = $values." (NULL, '$id', '$wallpaperId') ";
   }
   $res = All::addMultiple("list_wallpaper",$values);

   if($res == 1)
      showMessage("All added");
   else
      showError(-2,"error while inserting to database");
?>