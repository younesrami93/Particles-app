<?php
    require_once "All.php";
    require_once "login_verification.php";

    if(!isset($_GET['id']))
    {
        showError(-3,"not enough Parameters!".$_GET['id']);
        return 0;
    }
    $id = $_GET['id'];
    $req = "SELECT * FROM ps_preset WHERE id = '$id'";
    $res = All::execReqN($req);
    if(sizeof($res)>0)
    {
        $res = All::delete("ps_preset",$id);
        if($res)
        {
            showMessage("deleted successfully ");
        }
        else{
            showError(-2,"error while deleting from database");
        }
    }
    else{
        showError(-2,"item does not exist");
    }

   
    
  
?>