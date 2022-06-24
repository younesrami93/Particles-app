<?php
require_once "api/All.php";

if ( !isset($_POST['username'], $_POST['password']) ) {
    showError(-101,"Please fill both the username and password fields!");
    exit();
}
$user = $_POST['username'];
$password = $_POST['password'];

$req = "SELECT * FROM user WHERE name = '$user'";
$res = All::execReqN($req);
if(sizeof($res)>0)
{
    if($res[0]->password === $password)
    {
        startLoginSession($res[0]);
        showMessage("Login successful");
       
    }
    else{
        showError(-102,"Login faild, Username or password are not correct!");
    }
}
else{
    showError(-102,"Username $user does not exist");
}


?>