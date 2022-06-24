<?php
    require_once "All.php";
    require_once "login_verification.php";

    if(!isset($_GET['id']))
    {
        showError(-3,"not enough Parameters!".$_GET['id']);
        return 0;
    }
    $id = $_GET['id'];
    
    $req = "SELECT * FROM image WHERE id = '$id'";
    $res = All::execReqN($req);
    if(sizeof($res)>0)
    {
        $thumbnail = $res[0]->thumbnail;
        $path = $res[0]->path;
        $t_d = deleteFile("../".$thumbnail);
        $p_d = deleteFile("../".$path);
        $res = All::delete("image",$id);
        
        if($res)
        {
            showMessage("deleted successfully ".$t_d."  ".$p_d);
        }
        else{
            showError(-2,"error while deleting from database");
        }
    }
    else{
        showError(-2,"item does not exist");
    }

   
    
  
?>