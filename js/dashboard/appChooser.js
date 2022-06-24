class appChooser {
    static appToEdit = null;
    static appToEditHtml = null;
    static currentPosition = 0;
    static requestCount = 10;
    static allLoaded = false;
    static isLoading = false;
    static search = null;
    static order = "DESC";
    static clear() {
        $(".appsContainer").empty();
        appChooser.currentPosition = 0;
        appChooser.allLoaded = false;
    }
    static changeOrderAndLoad() {
        appChooser.clear();
        if (appChooser.order == "ASC") {
            appChooser.order = "DESC";
        } else
            appChooser.order = "ASC";
        console.log(appChooser.order);
        console.log("change order triger app loading");
        appChooser.show();
        localStorage["AppsOrder"] = appChooser.order;
        appChooser.updateOrderText();
    }
    static refresh() {
        appChooser.clear();
        this.show();
    }
    static updateOrderText() {
        $(".timesort p").text(appChooser.order == "ASC" ? "oldest first" : "newest first")
    }

    static searchFor(search) {
        if (search == "" && appChooser.search == null)
            return;
        if (search == undefined || search == "") {
            appChooser.search = null;
            appChooser.clear();
            appChooser.show();
            $(".searchApp input").val("")
            $(".searchApp .close").css("opacity", "0")
            return;
        }
        $(".searchApp .close").css("opacity", "1")
        appChooser.clear();
        appChooser.search = search;
        appChooser.show();
        console.log("searching for " + search);
    }
    static showLoadMore() {
        $(".loadMoreApps").show();
    }
    static hideLoadMore() {
        $(".loadMoreApps").hide();
    }
    static showLoading() {
        $(".loadingMoreApps").show();
    }
    static hideLoading() {
        $(".loadingMoreApps").hide();
    }
    static dataLoaded() {
        appChooser.isLoading = false;
        appChooser.showLoadMore();
        appChooser.hideLoading();
    }
    static allAppsLoaded() {
        appChooser.hideLoading();
        appChooser.hideLoadMore();
        appChooser.allLoaded = true;
        console.log("all apps loaded ");
    }
    static loading() {
        appChooser.isLoading = true;
        appChooser.hideLoadMore();
        appChooser.showLoading();
    }
    static show() {
        if (appChooser.isLoading)
            return;
        var search = "";
        if (appChooser.search != undefined) {
            search = "&search=" + appChooser.search;
        } else
            search = "";
        appChooser.loading();
        console.log("loading apps " + search);
        $.ajax({
            url: "api/get_apps.php?position=" + appChooser.currentPosition + "&count=" + appChooser.requestCount + "&order=" + appChooser.order + search,
            success: function(result) {
                appChooser.dataLoaded();
                try {
                    console.log("apps loaded " + result);
                    var apps = JSON.parse(result);
                    if (apps.code == 1) {
                        if (apps.result.length < appChooser.requestCount) {
                            appChooser.allAppsLoaded();
                        } else {
                            appChooser.currentPosition += apps.result.length;
                            appChooser.showLoadMore();
                        }
                        appChooser.displayApps(apps.result)
                    } else {
                        error.showErrorJson(apps);
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });
    }
    static getOptions() {
        var tree = [{
            title: "Manage pages",
            id: 2
        }, {
            title: "Edit",
            id: 0
        }, {
            title: "Delete",
            id: 1

        }, {
            title: "Open playstore",
            id: 3
        }, {
            title: "Reset Api key",
            id: 4
        }]
        return tree;
    }
    static showCreateAppDialog(app, appHtml) {
        appChooser.showCreatenewAppDialog()
        $(".app_image_holder").attr("src", "images/android-app-icon.png");
        $("#app_thmb_inpt").val("");
        if (app != undefined) {
            appChooser.appToEdit = app;
            appChooser.appToEditHtml = appHtml;
            $("#app_title_inpt").val(app.title);
            $("#app_package_inpt").val(app.packageName);
            if (app.image.length > 0)
                $(".app_image_holder").attr("src", app.image);
        } else {
            appChooser.appToEdit = null;
            appChooser.appToEditHtml = null;
            $("#app_title_inpt").val("");
            $("#app_package_inpt").val("");
        }
    }
    static displayApps(apps) {

        for (let index = 0; index < apps.length; index++) {
            const item = apps[index];
            appChooser.addApp(item)
        }

        if (apps.length == appChooser.requestCount && Math.abs($(".content_data")[0].scrollHeight - $(".content_data")[0].clientHeight) <= 1) {
            console.log("scroll bar not visible yet, so load more");
            appChooser.show();
        }
    }
    static addApp(app, prepend) {
        var thisApp = app;
        var thumbnail = app.image;
        if (thumbnail == "")
            thumbnail = "images/android-app-icon.png"
        var appHtml = appChooser.createAppLayout();
        appHtml.find(".icon").attr("src", thumbnail);
        appHtml.find(".id").text(app.id);
        appHtml.find(".apptitle").text(app.title);
        appHtml.find(".api_key").text(app.api_key);
        appHtml.find(".listCount").text(app.listCount);

        appHtml.find(".api_key").click(function(e) {
            e.stopPropagation();
        })

        /*    appHtml.click(function() {
                app_lists.loadListForApp(app, function(count) {
                    appHtml.find(".listCount").text(count);
                });
            })*/


        appHtml.find(".more").click(function(e) {
            menuMaker.show(appChooser.getOptions(), function(e) {
                if (e.id == 0) {
                    appChooser.showEditApp(app, appHtml);
                } else if (e.id == 1) {
                    appChooser.deleteProcess(app, appHtml);
                } else if (e.id == 2) {
                    app_lists.loadListForApp(app);
                } else if (e.id == 3) {
                    var win = window.open(appHtml.find(".link").parent().attr("href"), '_blank');
                    win.focus();
                } else if (e.id == 4) {
                    appChooser.resetApiKey(app, appHtml);
                }

            }, [e.clientX, e.clientY])
            e.stopPropagation();
        })

        /*    appHtml.find(".delete").click(function() {
                appChooser.deleteProcess(app, appHtml);
            })
            appHtml.find(".link").parent().attr("href", "https://play.google.com/store/apps/details?id=" + app.packageName);

            appHtml.find(".edit").click(function() {
                appChooser.showEditApp(app, appHtml);
            })*/
        appHtml.find(".packageName").text(app.packageName);
        if (prepend == undefined)
            $(".appsContainer").append(appHtml)
        else
            $(".appsContainer").prepend(appHtml)

    }

    static deleteProcess(app, appHtml) {
        dialog.show(function(e) {
            if (e == 2) { // deleting App
                appChooser.deleteApp(app, appHtml);
            } else // cancel
            {}
        }, "Delete app : " + app.title, "The app with this package name wont be able to connect with server", [
            ["Cancel", "blankBtn"],
            ["Delete", "redBtn"]
        ])
    }

    static updateApp(app, appHtml) {

        appHtml.unbind();
        appHtml.find(".more").unbind();
        appHtml.find(".delete").unbind();
        appHtml.find(".edit").unbind();

        /*appHtml.click(function() {
               app_lists.loadListForApp(app, function(count) {
                   appHtml.find(".listCount").text(count);
               });
           })*/
        var thisApp = app;
        var thumbnail = app.image;
        if (thumbnail == "")
            thumbnail = "images/android-app-icon.png"
        appHtml.find(".icon").attr("src", thumbnail);
        appHtml.find(".id").text(app.id);
        appHtml.find(".api_key").text(app.api_key);
        appHtml.find(".apptitle").text(app.title);
        /*   appHtml.find(".link").parent().attr("href", "https://play.google.com/store/apps/details?id=" + app.packageName);
           appHtml.find(".delete").click(function() {
               dialog.show(function(e) {
                   if (e == 2) { // deleting App
                       appChooser.deleteApp(app, appHtml);
                   } else // cancel
                   {}
               }, "Delete app : " + app.title, "The app with this package name wont be able to connect with server", [
                   ["Cancel", "blankBtn"],
                   ["Delete", "redBtn"]
               ])
           })
           appHtml.find(".edit").click(function() {
               appChooser.showEditApp(app, appHtml);
           })*/
        appHtml.find(".packageName").text(app.packageName);

        appHtml.find(".more").click(function(e) {
            menuMaker.show(appChooser.getOptions(), function(e) {
                if (e.id == 0) {
                    appChooser.showEditApp(app, appHtml);
                } else if (e.id == 1) {
                    appChooser.deleteProcess(app, appHtml);
                } else if (e.id == 2) {
                    app_lists.loadListForApp(app);
                } else if (e.id == 3) {
                    var win = window.open(appHtml.find(".link").parent().attr("href"), '_blank');
                    win.focus();
                } else if (e.id == 4) {
                    appChooser.resetApiKey(app, appHtml);
                }

            }, [e.clientX, e.clientY])
            e.stopPropagation();
        })
    }
    static resetApiKey(app, html) {

        dialog.show(function(e) {
            if (e == 2) { // 
                loading.show()
                $.ajax({
                    url: "api/reset_api_key.php?id=" + app.id,
                    success: function(result) {
                        loading.hide()
                        console.log(result);
                        var res = JSON.parse(result);
                        if (res.code == 1) {
                            app.api_key = res.result.api_key;
                            html.find(".api_key").text(app.api_key)

                            dialog.show(function(e) {}, "New api key for :" + app.title, app.api_key, [
                                ["OK", "greenBtn"]
                            ])
                        } else {
                            error.showErrorJson(res);
                        }
                    }
                });
            } else // cancel
            {

            }
        }, "Reset api for  : " + app.title, "this will create new api key, old one will be deleted, make sure to update your app with the new api key", [
            ["Cancel", "blankBtn"],
            ["Reset", "greenBtn"]
        ])
    }
    static showEditApp(app, htmlElement) {
        appChooser.showCreateAppDialog(app, htmlElement);
    }
    static deleteApp(app, htmlElement) {
        loading.show("Deleting :" + app.title)
        $.ajax({
            url: "api/delete_app.php?id=" + app.id,
            success: function(result) {
                loading.hide()
                console.log(result);
                var res = JSON.parse(result);
                if (res.code == 1) {
                    htmlElement.remove();
                    dashboard.appRemoved();
                } else {
                    error.showErrorJson(res);
                }
            }
        });
    }
    static appSelected(app) {

    }

    static hideCreatenewAppDialog() {
        $("#new_container").hide();
    }
    static showCreatenewAppDialog() {
        $("#new_container").show();
    }

    static createAppLayout() {
        var htmlObj = " <tr>" +
            "<td class=\"id\">1</td>" +
            "<td><img src=\"images/image_holder.png\" class=\"appicon_medium icon\"></td>" +
            "<td class=\"apptitle\"></td>" +
            "<td class=\"packageName\"></td>" +
            "<td class=\"listCount\"></td>" +
            "<td class=\"api_key\"></td>" +
            "<td class=\"actions\">" +

            /* "<img class=\"small_action_button edit\" src=\"images/edit.png\">" +
             "<img class=\"small_action_button delete\" src=\"images/delete2.png\">" +
             "<a target=\"_blank\" href=\"\"><img class=\"small_action_button link\" src=\"images/playstore.png\"></a>" +*/


            "<img class=\"small_action_button more paddingLeft20\" src=\"images/more.png\">" +
            "</td>" +
            "</tr>";
        return $(htmlObj);
    }
    static saveApp(file, title, type, appId, packageName, callback) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('type', type);
        fd.append('packageName', packageName);

        if (title != null)
            fd.append('title', title);

        if (appId != null) {
            fd.append('id', appId);
        }
        loading.show();
        $.ajax({
            url: 'api/save_app.php',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response) {
                loading.hide();
                response = JSON.parse(response);
                if (callback != null) {
                    callback(response);
                }
            },
        });
    }
    static init() {


        $(".app_image_holder").click(function() {
            $("#app_thmb_inpt").click()
        })

        $(".closeNewApp").click(appChooser.hideCreatenewAppDialog);
        $(".closeappChooser").click(appChooser.hide);
        $("#app_thmb_inpt").change(function() {
            var file = $(this).get(0).files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function() {
                    $(".app_image_holder").attr("src", reader.result)
                }
                reader.readAsDataURL(file);
            }
        })
        $("#submitNewApp").click(function() {
            var file = $('#app_thmb_inpt')[0].files[0];
            var title = $("#app_title_inpt").val();
            var packageName = $("#app_package_inpt").val();
            if (title == "") {
                alert("title is empty")
                return;
            }
            if (packageName == "") {
                alert("package name is empty")
                return;
            }
            appChooser.hideCreatenewAppDialog()

            var type = 'save';
            var appId = null;
            if (appChooser.appToEdit != null) {
                appId = appChooser.appToEdit.id;
                type = 'edit';
            }


            appChooser.saveApp(file, title, type, appId, packageName, function(response) {
                if (response.code == 1) {
                    if (appChooser.appToEdit == null) { // new app created
                        appChooser.addApp(response.result, true)
                        dashboard.appCreated();
                    } else { // update edited app
                        appChooser.updateApp(response.result, appChooser.appToEditHtml)
                    }
                } else
                    error.showErrorJson(response);
            })
        })

        $(".timesort").click(function() {
            appChooser.changeOrderAndLoad();
        })
        $(".content_data").scroll(function() {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1) {
                if (!appChooser.allLoaded) {
                    console.log("scroll triger app loading");
                    //appChooser.show();
                }
            }
        });
        $(".loadMoreApps").click(function() {
            appChooser.show();
        })

        $(".searchApp input").keyup(function(e) {
            if (e.keyCode == 13) {
                appChooser.searchFor($(this).val())
            }
        })

        $(".searchApp .close").click(function(e) {
            appChooser.searchFor("")
        })

        $(".refresh").click(function() {
            appChooser.refresh();
        })
        $(".newApp").click(function() {
            appChooser.showCreateAppDialog();
        })


        var o = localStorage["AppsOrder"];
        if (o != undefined)
            appChooser.order = o;
        appChooser.updateOrderText();
        appChooser.show();
    }
}