<?php
require_once "All.php";
require_once "login_verification.php";

function handleSave()
{
   $user = getUser();


   if(!isset($_POST['title']) || !isset($_POST['json']))
   {
      showError(-3,"parameters required");
      return 0;
   }

   $newId = All::getNewId("ps_preset");
   $title = $_POST['title'];
   $json = $_POST['json'];
   $desc = "";



   if(isset($_POST['description']))
      $desc = $_POST['description'];
   $values = "NULL,'$title','','$json','$desc','$user->id'";
   $res = All::add("ps_preset",$values);


   if($res == 1)
   {
      header('Location: '.'get_preset.php?id='.$newId);
   }
   else{
      showError(-2,"error while inserting to database");
   }
}

handleSave();

?>