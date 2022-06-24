<?php
require_once "All.php";
require_once "login_verification.php";
$user = getUserDetails();
$js = json_encode($user[0]);
showResult($js)
?>