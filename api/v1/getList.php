<?php
    require_once "../dbconnexion.php";

    if(!isset($_POST["app"]) || !isset($_POST["api"])|| !isset($_POST["page"]))
    {
        notAuthorized();
    }
    else{
        $package =  $_POST["app"];
        $key =  $_POST["api"];
        $listId =  $_POST["page"];

        $req = "SELECT id FROM app where packageName = '$package' and api_key = '$key'";
        $res  = execReqN($req);
        if(sizeof($res) > 0)
        {
            $id = $res[0]->id;
            $req = "SELECT * from list where id in (select list_id FROM app_list where list_id ='$listId' and app_id = '$id')";
            $res  = execReqN($req);
            if(sizeof($res)>0)
            {
                $list = $res[0];
                $req = "SELECT id,title,image from live_wallpapers where id in (SELECT wallpaper_id from list_wallpaper where list_id = '$listId')";
                $res  = execReqN($req);
                $list->wallpapers = $res;
                echo (json_encode($list));
            }
            else{
                notAuthorized();
            }

           /* $count = sizeof($res);
            for ($i=0; $i < $count; $i++) { 
                $lid = $res[$i]->id;
                $req = "SELECT * from live_wallpapers where id in (SELECT wallpaper_id from list_wallpaper where list_id = '$lid')";
                $res2 = execReqN($req);
                $res[$i]->wallpapers = $res2;
            }*/
        }
        else{
            notAuthorized();
        }
    }
    


    function notAuthorized()
    {
        echo "{\"code\":\"-1\",\"Message\":\"Not authorized\"}";

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