<?php
require_once "All.php";
require_once "login_verification.php";



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
   
   if(isset($_POST['images']))
   {
      $arr["images"] = $_POST['images'];
   
   }
   
   if(isset($_POST['json']))
   {
      $arr["json"] = $_POST['json'];
   }
   
   $image = null;
   if(isset($_FILES["file"]))
   {
      $image = handleUpload($id);
      if($image != null)
         $arr["image"] = $image;
   }
   $res = All::update("live_wallpapers",$arr,$id);
   echo $res;
   if($res == 1)
   {
      require_once "export.php";
      export($id,true);
      header('Location: '.'get_wallpaper.php?id='.$id);
   }
   else{
      showError(-2,"error while inserting to database");
   }
}
function handleUpload($id)
{
   $hashName = sha1("live_wallpapers".$id);
   $filename = $_FILES['file']['name'];
   $imageFileType = pathinfo($filename,PATHINFO_EXTENSION);
   $hashName = $hashName.".".$imageFileType;
   $location = "../live_wlp_thumbnails/".$hashName;
   $valid_extensions = array("jpg","jpeg","png");
   if( !in_array(strtolower($imageFileType),$valid_extensions) ) {
      //showError(-4,"image extention not supported!");
      return "";
   }
   else if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
      $path = "live_wlp_thumbnails/".$hashName;
      $thumbnailPath = "thumbnails/".$hashName;
      make_thumb("../".$path,"../".$thumbnailPath, 200);
      return $path;
   }
   return "";
}
function handleSave()
{
   if(!isset($_POST['title']))
   {
      showError(-3,"parameters required, title");
      return 0;
   }

   $title = $_POST['title'];
   $images = $_POST['images'];
   $json = "";
   if(isset($_POST['json']))
      $json = $_POST['json'];
      

   $newId = All::getNewId("live_wallpapers");
   $image = null;
   if(isset($_FILES["file"]))
      $image = handleUpload($newId);
   $user = getUser();
   $values = "NULL,'$title','$json','$image','$images','$user->id'";
   $res = All::add("live_wallpapers",$values);
   if($res == 1)
   {
      require_once "export.php";
      export($newId,true);
      header('Location: '.'get_wallpaper.php?id='.$newId);
   }
   else{
      showError(-2,"error while inserting to database");
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