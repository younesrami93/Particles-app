<?php
require_once "All.php";
require_once "login_verification.php";

function createApiKey($id)
{
   $random = rand(100000000,999999999);
   return sha1("app".$id."".$random);
}

function make_thumb($src, $dest, $desired_width) {
   $info = pathinfo($src);
   $source_image = "";
   switch(strtolower($info['extension']))
   {
      case "jpg":
         $source_image = imagecreatefromjpeg($src);
      break;
      case "png":
         $source_image = imagecreatefrompng($src);
      break;
      case "jpeg":
         $source_image = imagecreatefromjpeg($src);
      break;
   }
   $width = imagesx($source_image);
   $height = imagesy($source_image);
   $desired_height = floor($height * ($desired_width / $width));
   $virtual_image = imagecreatetruecolor($desired_width, $desired_height);
   imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
   imagejpeg($virtual_image, $dest);
}

function handleEdit()
{
   if(!isset($_POST['id']))
   {
      showError(-3,"parameters required, id");
      return 0;
   }
   $id = $_POST["id"];
   $arr = [];

   if(isset($_POST['title']))
   {
      $arr["title"] = $_POST['title'];
   
   }
   
   if(isset($_POST['packageName']))
   {
      $arr["packageName"] = $_POST['packageName'];
   
   }
   
   $image = null;
   if(isset($_FILES["file"]))
   {
      $image = handleUpload($id);
      if($image != null)
         $arr["image"] = $image;
   }
   $res = All::update("app",$arr,$id);
   echo $res;
   if($res == 1)
   {
      header('Location: '.'get_app.php?id='.$id);
   }
   else{
      showError(-2,"error while inserting to database");
   }
}
function handleUpload($id)
{
   $hashName = sha1("app_".$id);
   $filename = $_FILES['file']['name'];
   $imageFileType = pathinfo($filename,PATHINFO_EXTENSION);
   $hashName = $hashName.".".$imageFileType;
   $location = "../app_thumbnails/".$hashName;
   $valid_extensions = array("jpg","jpeg","png");
   if( !in_array(strtolower($imageFileType),$valid_extensions) ) {
      //showError(-4,"image extention not supported!");
      return "";
   }
   else if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
      $path = "app_thumbnails/".$hashName;
      return $path;
   }
   return "";
}
function handleSave()
{
   if(!isset($_POST['title']) || !isset($_POST['packageName']))
   {
      showError(-3,"parameters required");
      return 0;
   }

   $title = $_POST['title'];
   $packageName = $_POST['packageName'];

  
   $user = getUser();
   $values = "NULL,'$title','$packageName','','','$user->id'";
   $newId = All::add2("app",$values);

   if($newId != -1)
   {
      $image = null;
      if(isset($_FILES["file"]))
         $image = handleUpload($newId);
      $api_key = createApiKey($newId);
      header('Location: '.'get_app.php?id='.$newId);
   }
   else{
      showError(-2,"error while inserting to database");
   }

   if($res == 1)
   {
     // header('Location: '.'get_app.php?id='.$newId);
   }
   else{
     // showError(-2,"error while inserting to database");
   }
}




if(!isset($_POST['type']))
{
   showError(-3,"parameters required, type");
   return 0;
}
$type = $_POST['type'];
if($type == "edit")
   handleEdit();
else if($type == "save")
   handleSave();

?>