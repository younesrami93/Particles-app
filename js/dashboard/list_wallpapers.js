class list_wallpapers {
    static leftPanel = null;
    static rightPanel = null;
    static currentPosition = 0;
    static requestCount = 10;
    static allLoaded = false;
    static isLoading = false;
    static search = null;
    static order = "DESC";
    static listWallpapers = null;
    static list;
    static callback;


    static showLoadMore() { $(".loadMoreWallpapers").show(); }
    static hideLoadMore() { $(".loadMoreWallpapers").hide(); }

    static showLoading() { $(".loadingMoreWallpapers").show(); }
    static hideLoading() { $(".loadingMoreWallpapers").hide(); }

    static save() {
        loading.show();
        var ids = "";
        for (let i = 0; i < list_wallpapers.listWallpapers.length; i++) {
            const item = list_wallpapers.listWallpapers[i];
            if (i > 0)
                ids = ids + ",";
            ids = ids + item.id;
        }
        $.ajax({
            url: "api/save_list_wallpapers.php?listId=" + list_wallpapers.list.id + "&wallpapers=" + ids,
            success: function(result) {
                loading.hide();
                try {
                    console.log(result);
                    var res = JSON.parse(result);
                    if (res.code == 1) {
                        console.log("all lists added");
                        list_wallpapers.hide();
                        if (list_wallpapers.callback != null && list_wallpapers.callback != undefined) {
                            list_wallpapers.callback(list_wallpapers.listWallpapers.length);
                        }
                    } else {
                        error.showErrorJson(lists);
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });
    }
    static init() {

        list_wallpapers.leftPanel = $(".leftContainer");
        list_wallpapers.rightPanel = $(".rightContainer");

        $("#list_wallpapers .cancel").click(function() {
            list_wallpapers.hide();
        })
        $("#list_wallpapers .save").click(function() {
            list_wallpapers.save();
        })

        $("#list_wallpapers .close_list_wallpapres").click(function() {
            list_wallpapers.hide();
        })
        $("#list_wallpapers .loadMoreWallpapers").click(function() {
            list_wallpapers.loadWallpapers();
        })

        $(".searchList_wallpapers input").keyup(function(e) {
            if (e.keyCode == 13) {
                list_wallpapers.searchFor($(this).val())
            }
        })

        $(".searchList_wallpapers .close").click(function(e) {
            list_wallpapers.searchFor("")
        })

        list_wallpapers.hideLoadMore()
        list_wallpapers.hideLoading()
    }
    static reset() {
        list_wallpapers.currentPosition = 0;
        list_wallpapers.allLoaded = false;
        list_wallpapers.search = null;
        $(".searchList_wallpapers input").val("");
        $(".searchList_wallpapers .close").css("opacity", "0")
        list_wallpapers.hideLoadMore()

    }
    static addItem(item, isLeft) {
        var html = "<div class=\"wallpaperItem\">" +
            "<div class=\"wlp_hover_panel\"><div><button class=\"main_button \">Add</button></div></div>" +
            "<img class=\"wlp_item_img\">" +
            "<div class=\"wallpaper_title_holder\">" +
            "<p class=\"wallpaper_title wallpaper_title2\"></p>" +
            "</div>" +
            "</div>";
        html = $(html);

        console.log("displaying wallpaper" + item.title);


        var thumbnail = item.image;
        if (thumbnail == "")
            thumbnail = "images/missing3.jpg"
        html.find(".wlp_item_img").attr("src", thumbnail);
        html.find(".wallpaper_title").text(item.title);

        html.click(function() {
            html.remove();
            if (isLeft) {
                const index = list_wallpapers.getIndexofItemInpp_lists(item);
                list_wallpapers.listWallpapers.splice(index, 1);
            } else {
                list_wallpapers.listWallpapers.push(item);
            }
            list_wallpapers.addItem(item, !isLeft)
        })
        if (isLeft) {
            html.find(".main_button").text("Remove")
            list_wallpapers.leftPanel.find(".wallpapersContainer").append(html);
        } else {
            html.find(".main_button").text("Add")
            list_wallpapers.rightPanel.find(".wallpapersContainer").append(html);
        }
    }
    static getIndexofItemInpp_lists(item) {
        for (let j = 0; j < list_wallpapers.listWallpapers.length; j++) {
            const item2 = list_wallpapers.listWallpapers[j];
            if (item2.id == item.id) {
                return j;
            }
        }
        return -1;
    }
    static loadWallpapers() {
        var search = "";
        if (list_wallpapers.search != undefined) {
            search = "&search=" + list_wallpapers.search;
        } else
            search = "";
        list_wallpapers.showLoading();
        console.log("getting wallpapers "+"api/get_wallpapers.php?position=" + list_wallpapers.currentPosition + "&count=" + list_wallpapers.requestCount + "&" + search)
        $.ajax({
            url: "api/get_wallpapers.php?position=" + list_wallpapers.currentPosition + "&count=" + list_wallpapers.requestCount + "&" + search,
            success: function(result) {
                list_wallpapers.hideLoading();
                try {
                    var lists = JSON.parse(result);
                    if (lists.code == 1) {
                        if (lists.result.length < list_wallpapers.requestCount) {
                            list_wallpapers.hideLoadMore();
                        } else {
                            list_wallpapers.currentPosition += lists.result.length;
                            list_wallpapers.showLoadMore();
                        }
                        list_wallpapers.displayWallpapers(lists.result, false)
                    } else {
                        error.showErrorJson(lists);
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });
    }
    static clear() {
        list_wallpapers.leftPanel.find(".wallpapersContainer").empty();
        list_wallpapers.rightPanel.find(".wallpapersContainer").empty();
    }
    static hide() {
        list_wallpapers.clear();
        $("#list_wallpapers").hide();
    }
    static loadWallpapersForList(list, callback) {
        list_wallpapers.listWallpapers = null;
        list_wallpapers.callback = callback;
        $("#list_wallpapers").find(".listTitle").text(list.title)
        if (list.image != null && list.image.length > 0)
            $("#list_wallpapers").find(".listIcon").attr("src", list.image);
        else
            $("#list_wallpapers").find(".listIcon").attr("src", "images/default_list.png");
        list_wallpapers.reset();
        list_wallpapers.clear();
        $("#list_wallpapers").show();
        list_wallpapers.list = list;
        $(".loadingListWallpapers").show();
        $.ajax({
            url: "api/get_wallpapers.php?listId=" + list.id,
            success: function(result) {
                try {
                    console.log("wallpapers for list " + list.title + " is loaded " + result);
                    $(".loadingListWallpapers").hide();
                    var wallpapers = JSON.parse(result);
                    if (wallpapers.code == 1) {
                        if (wallpapers.result.length < list_wallpapers.requestCount) {
                            //app_lists.alllistsLoaded();
                        } else {
                            //list_wallpapers.currentPosition += wallpapers.result.length;
                            //listChooser.showLoadMore();
                        }
                        list_wallpapers.listWallpapers = wallpapers.result;
                        list_wallpapers.displayWallpapers(wallpapers.result, true)

                        list_wallpapers.loadWallpapers();
                    } else {
                        error.showErrorJson(wallpapers);
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });
    }
    static displayWallpapers(wallpapers, isLeft) {
        for (let index = 0; index < wallpapers.length; index++) {
            const item = wallpapers[index];
            if (!isLeft) {
                var exist = false;
                for (let j = 0; j < list_wallpapers.listWallpapers.length; j++) {
                    const item2 = list_wallpapers.listWallpapers[j];
                    if (item2.id == item.id) {
                        exist = true;
                        break;
                    }
                }
                if (!exist)
                    list_wallpapers.addItem(item, isLeft)

            } else {
                list_wallpapers.addItem(item, isLeft)
            }
        }
    }


    static searchFor(search) {
        if (search == "" && list_wallpapers.search == null)
            return;
        list_wallpapers.rightPanel.find(".wallpapersContainer").empty();
        list_wallpapers.reset()

        if (search == undefined || search == "") {
            list_wallpapers.search = null;
            list_wallpapers.loadWallpapers();
            $(".searchList_wallpapers input").val("")
            $(".searchList_wallpapers .close").css("opacity", "0")
            return;
        }
        $(".searchList_wallpapers .close").css("opacity", "1")

        list_wallpapers.search = search;
        list_wallpapers.loadWallpapers();
        console.log("searching for " + search);
    }
}