<?php
    require_once "../dbconnexion.php";



    if(!isset($_POST["app"]) || !isset($_POST["api"]) || !isset($_POST["wallpaper"]))
    {
        notAuthorized();
    }
    else{
        $package =  $_POST["app"];
        $key =  $_POST["api"];
        $wallpaperId =  $_POST["wallpaper"];       
        

        $req = "SELECT id FROM app where packageName = '$package' and api_key = '$key'";
        $res  = execReqN($req);
        if(sizeof($res) > 0) // app exist
        {
            $appId = $res[0]->id;

            /*if(isset($_POST["page"]) && $_POST["page"] != null && $_POST["page"] != "")
            {
                $listId =  $_POST["page"];
                $req = "SELECT * from list where id in (select list_id FROM app_list where list_id ='$listId' and app_id = '$appId')";
                $res  = execReqN($req);
    
                if(sizeof($res)>0) // list exist
                {
                    $list = $res[0];
                    $req = "SELECT id,title,image,json,images from live_wallpapers where id in (SELECT wallpaper_id from list_wallpaper where list_id = '$listId' and wallpaper_id = '$wallpaperId')";
                    $res  = execReqN($req);
                    echo (json_encode($res[0]));
                }
                else{
                    notAuthorized();
                }
            }
            else*/{
                $req = "SELECT id,title,image,json,images from live_wallpapers where id = '$wallpaperId'";
                $res  = execReqN($req);
                if(sizeof($res)>0) 
                {
                    echo (json_encode($res[0]));
                }
                else
                {
                    notAuthorized();
                }
            }
        }
        else{
            notAuthorized();
        }
    }
    


    function notAuthorized()
    {
        echo "{\"code\":\"-1\",\"Message\":\"Not authorized\"}";
        exit();
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