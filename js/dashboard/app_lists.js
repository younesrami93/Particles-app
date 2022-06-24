class app_lists {
    static leftPanel = null;
    static rightPanel = null;
    static currentPosition = 0;
    static requestCount = 10;
    static allLoaded = false;
    static isLoading = false;
    static search = null;
    static order = "DESC";
    static appList = null;
    static app;
    static callback;


    static showLoadMore() { $(".loadMoreLists2").show(); }
    static hideLoadMore() { $(".loadMoreLists2").hide(); }

    static showLoading() { $(".loadingMoreLists2").show(); }
    static hideLoading() { $(".loadingMoreLists2").hide(); }

    static save() {
        loading.show();
        var listsIds = "";
        for (let i = 0; i < app_lists.appList.length; i++) {
            const item = app_lists.appList[i];
            if (i > 0)
                listsIds = listsIds + ",";
            listsIds = listsIds + item.id;
        }
        $.ajax({
            url: "api/save_app_lists.php?appId=" + app_lists.app.id + "&lists=" + listsIds,
            success: function(result) {
                loading.hide();
                try {
                    console.log(result);
                    var res = JSON.parse(result);
                    if (res.code == 1) {
                        console.log("all lists added");
                        app_lists.hide();
                        if (app_lists.callback != null && app_lists.callback != undefined) {
                            app_lists.callback(app_lists.appList.length);
                            app_lists.callback = null;
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

        app_lists.leftPanel = $(".leftContainer");
        app_lists.rightPanel = $(".rightContainer");

        $("#app_list .cancel").click(function() {
            app_lists.hide();
        })
        $("#app_list .save").click(function() {
            app_lists.save();
        })

        $("#app_list .close_applist").click(function() {
            app_lists.hide();
        })
        $("#app_list .loadMoreLists2").click(function() {
            app_lists.loadList();
        })

        $(".searchApp_list input").keyup(function(e) {
            if (e.keyCode == 13) {
                app_lists.searchFor($(this).val())
            }
        })

        $(".searchApp_list .close").click(function(e) {
            app_lists.searchFor("")
        })

        app_lists.hideLoadMore()
        app_lists.hideLoading()
    }
    static reset() {
        app_lists.currentPosition = 0;
        app_lists.allLoaded = false;
        app_lists.search = null;
        $(".searchApp_list input").val("");
        $(".searchApp_list .close").css("opacity", "0")
        app_lists.hideLoadMore()

    }
    static addItem(item, isLeft) {
        var html = "<tr>" +
            "<td class=\"id\"></td>" +
            "<td><img class=\"listicon_medium icon\"></td>" +
            "<td class=\"listtitle\"></td>" +
            "<td class=\"label\"></td>" +
            "<td class=\"count\"></td>" +
            "<td class=\"actions\"><button class=\"main_button\">" + (isLeft ? "Remove" : "Add") + "</button></td>" +
            "</tr>";
        html = $(html);

        var image = item.image;
        if (image == undefined || image == "")
            image = "images/default_list.png"
        html.find(".icon").attr("src", image);
        html.find(".id").text(item.id);
        html.find(".label").text(item.label);
        html.find(".listtitle").text(item.title);
        html.find(".count").text(item.wallpapersCount);
        html.find(".main_button").click(function() {
            html.remove();
            if (isLeft) {
                const index = app_lists.getIndexofItemInpp_lists(item);
                app_lists.appList.splice(index, 1);
            } else {
                app_lists.appList.push(item);
            }
            app_lists.addItem(item, !isLeft)
        })
        if (isLeft) {
            app_lists.leftPanel.find(".listsContainer").append(html);
        } else {
            app_lists.rightPanel.find(".listsContainer").append(html);
        }
    }
    static getIndexofItemInpp_lists(item) {
        for (let j = 0; j < app_lists.appList.length; j++) {
            const item2 = app_lists.appList[j];
            if (item2.id == item.id) {
                return j;
            }
        }
        return -1;
    }
    static loadList() {
        var search = "";
        if (app_lists.search != undefined) {
            search = "&search=" + app_lists.search;
        } else
            search = "";
        app_lists.showLoading();
        $.ajax({
            url: "api/get_lists.php?position=" + app_lists.currentPosition + "&count=" + app_lists.requestCount + "&order=" + app_lists.order + search,
            success: function(result) {
                //app_lists.dataLoaded();
                app_lists.hideLoading();
                try {
                    var lists = JSON.parse(result);
                    if (lists.code == 1) {
                        if (lists.result.length < app_lists.requestCount) {
                            //app_lists.alllistsLoaded();
                            app_lists.hideLoadMore();
                        } else {
                            app_lists.currentPosition += lists.result.length;
                            app_lists.showLoadMore();
                            //listChooser.showLoadMore();
                        }
                        app_lists.displaylists(lists.result, false)
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
        app_lists.leftPanel.find(".listsContainer").empty();
        app_lists.rightPanel.find(".listsContainer").empty();
    }
    static hide() {
        app_lists.clear();
        $("#app_list").hide();
    }
    static loadListForApp(app, callback) {
        app_lists.callback = callback;
        app_lists.appList = null;
        $("#app_list").find(".appTitle").text(app.title)
        if (app.image != null && app.image.length > 0)
            $("#app_list").find(".appIcon").attr("src", app.image);
        else
            $("#app_list").find(".appIcon").attr("src", "images/android-app-icon.png");
        app_lists.reset();
        app_lists.clear();
        $("#app_list").show();
        app_lists.app = app;
        $(".loadingAppLists").show();
        $.ajax({
            url: "api/get_lists.php?appId=" + app.id,
            success: function(result) {
                //app_lists.dataLoaded();
                try {
                    $(".loadingAppLists").hide();
                    var lists = JSON.parse(result);
                    if (lists.code == 1) {
                        if (lists.result.length < app_lists.requestCount) {
                            //app_lists.alllistsLoaded();
                        } else {
                            app_lists.currentPosition += lists.result.length;
                            //listChooser.showLoadMore();
                        }
                        app_lists.appList = lists.result;
                        app_lists.displaylists(lists.result, true)

                        app_lists.loadList();
                    } else {
                        error.showErrorJson(lists);
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });
    }
    static displaylists(lists, isLeft) {

        for (let index = 0; index < lists.length; index++) {
            const item = lists[index];
            if (!isLeft) {
                var exist = false;
                for (let j = 0; j < app_lists.appList.length; j++) {
                    const item2 = app_lists.appList[j];
                    if (item2.id == item.id) {
                        exist = true;
                        break;
                    }
                }
                if (!exist)
                    app_lists.addItem(item, isLeft)

            } else {
                app_lists.addItem(item, isLeft)
            }
        }
    }


    static searchFor(search) {
        if (search == "" && app_lists.search == null)
            return;


        app_lists.rightPanel.find(".listsContainer").empty();
        app_lists.reset()


        if (search == undefined || search == "") {
            app_lists.search = null;
            app_lists.loadList();
            $(".searchApp_list input").val("")
            $(".searchApp_list .close").css("opacity", "0")
            return;
        }
        $(".searchApp_list .close").css("opacity", "1")

        app_lists.search = search;
        app_lists.loadList();
        console.log("searching for " + search);
    }
}