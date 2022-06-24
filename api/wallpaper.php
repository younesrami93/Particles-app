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




$filename = $_FILES['file']['name'];
$location = "../uploads/".$filename;
$uploadOk = 1;
$imageFileType = pathinfo($location,PATHINFO_EXTENSION);
$valid_extensions = array("jpg","jpeg","png");

if( !in_array(strtolower($imageFileType),$valid_extensions) ) {
   $uploadOk = 0;
}

if($uploadOk == 0){
   echo 0;
}else{
   if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
      $path = "uploads/".$filename;
      $thumbnailPath = "thumbnails/".$filename;


      make_thumb("../".$path,"../".$thumbnailPath, 200);


      $user = getUser();

      $values = "NULL,'$path','$filename','$thumbnailPath','$user->id'";
      $newId = All::getNewId("image");
      $res = All::add("image",$values);
      if($res == 1)
      {
         $result = All::execReq("select * from image where id = $newId");
         echo $result;
      }
      else{
         echo "error while inserting img to database";
      }
   }else{
      echo 0;
   }
}