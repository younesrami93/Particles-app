<?php
    require_once "All.php";
    $currenUser = checkLogin();
    
    if($currenUser == null)
    {
        showError(-100,"login required");
        exit();
    }
    else{
    
    }
?>

