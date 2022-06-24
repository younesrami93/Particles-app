<?php
require_once "All.php";
require_once "login_verification.php";



function make_thumb($src, $dest, $desired_width) {

   $info = pathinfo($src);
   $source_image;
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

   /* find the "desired height" of this thumbnail, relative to the desired width  */
   $desired_height = floor($height * ($desired_width / $width));

   /* create a new, "virtual" image */
   $virtual_image = imagecreatetruecolor($desired_width, $desired_height);

   /* copy source image at a resized size */
   imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);

   /* create the physical thumbnail image to its destination */
   imagejpeg($virtual_image, $dest);
}



$newId = All::getNewId("image");
$hashName = sha1("image".$newId);
$filename = $_FILES['file']['name'];
$imageFileType = pathinfo($filename,PATHINFO_EXTENSION);
$hashName = $hashName.".".$imageFileType;



$location = "../uploads/".$hashName;
$uploadOk = 1;
$type = $_POST["type"];
$valid_extensions = array("jpg","jpeg","png");

if( !in_array(strtolower($imageFileType),$valid_extensions) ) {
   $uploadOk = 0;
}

if($uploadOk == 0){
   showError(-4,"type not supported");

}else{
   if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
     
     
      $path = "uploads/".$hashName;
      $thumbnailPath = "thumbnails/".$hashName;


      make_thumb("../".$path,"../".$thumbnailPath, 200);

      $user = getUser();

      $values = "NULL,'$path','$filename','$thumbnailPath','$type','$user->id'";
 
      $res = All::add("image",$values);
      if($res == 1)
      {
         $result = All::execReq("select * from image where id = $newId");
         showResult($result);
      }
      else{
         showError(-2,"error while inserting img to database");
      }
   }else{
         showError(-2,"Upload faild ");
   }
}