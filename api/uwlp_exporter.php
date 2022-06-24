<?php
    require_once "All.php";
    //require_once "login_verification.php";
    require_once "export.php";
    
    for($i = 0 ; $i< 1000; $i++)
    {
        export($i,false);    
    }
?>
    
