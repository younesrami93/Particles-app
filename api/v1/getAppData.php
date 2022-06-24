<?php
    require_once "../dbconnexion.php";

    if(!isset($_POST["app"]) || !isset($_POST["api"]))
    {
        echo "{\"code\":\"-1\",\"Message\":\"Not authorized\"}";
    }
    else{
        $package =  $_POST["app"];
        $key =  $_POST["api"];

        $req = "SELECT id FROM app where packageName = '$package' and api_key = '$key'";
        $res  = execReqN($req);
        if(sizeof($res) > 0)
        {
            $id = $res[0]->id;
           // $req = "SELECT * FROM list where id in(select list_id from app_list where app_id = '$id')";
            $req = "SELECT list.id,list.title,list.image,list.type FROM list inner join app_list on list.id = app_list.list_id where app_list.app_id = '$id' order by app_list.id";
            $res  = execReqN($req);

            $count = sizeof($res);
            for ($i=0; $i < $count; $i++) { 
                $lid = $res[$i]->id;
                $req = "SELECT * from live_wallpapers where id in (SELECT wallpaper_id from list_wallpaper where list_id = '$lid')";
                $res2 = execReqN($req);
                $res[$i]->wallpapers = $res2;
            }
            echo json_encode($res);
        }
        else{
            echo "{\"code\":\"-1\",\"Message\":\"Not authorized\"}";
        }
    }







    function execReq($req)
    {
         $pdo = DBConnection::getInstance()->getConnection();
         $result = $pdo->query($req)->fetchAll(PDO::FETCH_OBJ); 
         return json_encode($result);
    }
    function execReqN($req)
    {
         $pdo = DBConnection::getInstance()->getConnection();
         $result = $pdo->query($req)->fetchAll(PDO::FETCH_OBJ); 
         return $result;
    }



?>