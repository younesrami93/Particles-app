class liveWallpaperChooser {
    static wallpaperSelectedCallback = null;
    static wallpaperToEdit = null;
    static order = "DESC";
    static search = null;
    static allLoaded = false;
    static currentPosition = 0;
    static requestCount = 20;

    static loadWallpaper(wlpId, callback) {
        loading.show();
        $.ajax({
            url: "api/get_wallpaper.php?id=" + wlpId,
            success: function(result) {
                loading.hide();
                var wlp = JSON.parse(result);
                if (wlp.code == 1) {
                    var wlp = ULiveWallpaper.parse(wlp.result);
                    if (callback != null) {
                        callback(wlp)
                    }
                } else {
                    error.showErrorJson(wlp);
                    window.location.href = 'wlp.html';
                }

            }
        });
    }
    static showWallpaper(wlp) {
        MainController.wallpaper = wlp;
        layersController.showUWallpaperLayers(MainController.wallpaper)
    }
    static saveCurrentWallpaper() {
        if (MainController.wallpaper.id == null) {
            liveWallpaperChooser.saveCurrentWallpaperAs();
        } else {
            liveWallpaperChooser.saveWallpaper(null, null, "edit", MainController.wallpaper.id, JSON.stringify(MainController.wallpaper.toJson()), MainController.wallpaper.getImagesIds(), function(response) {
                if (response.code == 1) {
                    console.log("wallpaper saved successfully");
                    console.log(response);
                } else
                    error.showErrorJson(response);
            })
        }

    }
    static saveCurrentWallpaperAs() {

        liveWallpaperChooser.show(function(wlp) {

            liveWallpaperChooser.saveWallpaper(null, null, "edit", wlp.id, JSON.stringify(MainController.wallpaper.toJson()), MainController.wallpaper.getImagesIds(), function(response) {
                if (response.code == 1) {
                    /*console.log("wallpaper saved successfully");
                    console.log(response);
                    var wallpaper = ULiveWallpaper.parse(response.result);
                    liveWallpaperChooser.showWallpaper(wallpaper)*/
                    window.location.href = "?wlpId=" + wlp.id;
                } else
                    error.showErrorJson(response);
            })


        })
    }


    static changeOrderAndLoad() {
        liveWallpaperChooser.clear();
        if (liveWallpaperChooser.order == "ASC") {
            liveWallpaperChooser.order = "DESC";
        } else
            liveWallpaperChooser.order = "ASC";
        console.log("change order triger wallpaper loading");
        liveWallpaperChooser.show();
        localStorage["wallpaperOrder"] = liveWallpaperChooser.order;
        liveWallpaperChooser.updateOrderText();
    }

    static updateOrderText() {
        $(".wlp_timesort").text(liveWallpaperChooser.order == "ASC" ? "oldest first" : "newest first")
    }

    static show(callback, canClose) {
        if (callback != undefined) {
            liveWallpaperChooser.wallpaperSelectedCallback = callback;
        }
        var search = "";
        if (liveWallpaperChooser.search != undefined)
            search = "&search=" + liveWallpaperChooser.search;
        else
            search = "";

        liveWallpaperChooser.loading();
        if (canClose != undefined && !canClose) {
            $(".closeliveWallpaperChooser").hide();
        } else {
            $(".closeliveWallpaperChooser").show();
        }


        $.ajax({
            url: "api/get_wallpapers.php?position=" + liveWallpaperChooser.currentPosition + "&count=" + liveWallpaperChooser.requestCount + "&order=" + liveWallpaperChooser.order + search,
            success: function(result) {
                liveWallpaperChooser.dataLoaded();
                try {
                    var wlps = JSON.parse(result);
                    if (wlps.code == 1) {
                        if (wlps.result.length == 0 && liveWallpaperChooser.currentPosition == 0)
                            liveWallpaperChooser.showNoData()
                        if (wlps.result.length < liveWallpaperChooser.requestCount) {
                            liveWallpaperChooser.allWallpaperLoaded();
                        } else {
                            liveWallpaperChooser.currentPosition += wlps.result.length;
                            liveWallpaperChooser.showLoadMore();
                        }
                        liveWallpaperChooser.displayLiveWallpapers(wlps.result)
                    } else {
                        error.showErrorJson(wlps);
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });

        $("#livewallpapers_container").show();
    }

    static init() {
        console.log("init");
        var o = localStorage["wallpaperOrder"];
        if (o != undefined)
            liveWallpaperChooser.order = o;
        liveWallpaperChooser.updateOrderText();
    }
    static clear() {
        $(".wallpaper_wraper").empty();
        liveWallpaperChooser.currentPosition = 0;
        liveWallpaperChooser.allLoaded = false;
    }
    static reset() {
        $(".wallpaper_wraper").empty();
        liveWallpaperChooser.search = null;
        liveWallpaperChooser.currentPosition = 0;
        liveWallpaperChooser.allLoaded = false;
        $(".wlpsSearch input").val("")
        $(".wlpsSearch .close").css("opacity", "0")
    }


    static searchFor(search) {
        if (search == "" && liveWallpaperChooser.search == null)
            return;
        if (search == undefined || search == "") {
            liveWallpaperChooser.search = null;
            liveWallpaperChooser.clear();
            liveWallpaperChooser.show();
            $(".wlpsSearch input").val("")
            $(".wlpsSearch .close").css("opacity", "0")
            return;
        }
        $(".wlpsSearch .close").css("opacity", "1")
        liveWallpaperChooser.clear();
        liveWallpaperChooser.search = search;
        liveWallpaperChooser.show();
        console.log("searching for " + search);
    }

    static allWallpaperLoaded() {
        liveWallpaperChooser.hideLoading();
        liveWallpaperChooser.hideLoadMore();
        liveWallpaperChooser.allLoaded = true;
        console.log("all wlps loaded ");
    }
    static loading() {
        liveWallpaperChooser.isLoading = true;
        liveWallpaperChooser.hideLoadMore();
        liveWallpaperChooser.showLoading();
        liveWallpaperChooser.hideNoData();
    }
    static showNoData() {
        $(".liveWallpapers_noData").show();
    }
    static hideNoData() {
        $(".liveWallpapers_noData").hide();
    }
    static dataLoaded() {
        liveWallpaperChooser.isLoading = false;
        liveWallpaperChooser.showLoadMore();
        liveWallpaperChooser.hideLoading();
    }

    static showLoadMore() {
        $(".wlpLoadMore").show();
    }
    static hideLoadMore() {
        $(".wlpLoadMore").hide();
    }
    static showLoading() {
        $(".wlpLoadingMore").show();
    }
    static hideLoading() {
        $(".wlpLoadingMore").hide();
    }

    static showCreateWallpaperDialog(wlp) {
        $("#newWAllpaper_container").show();
        $(".wallpaper_image_holder").attr("src", "images/image_holder.png");
        $("#wlps_thmb_inpt").val();

        if (wlp != undefined) {
            liveWallpaperChooser.wallpaperToEdit = wlp;
            $("#wlps_title_inpt").val(wlp.title);
            if (wlp.image.length > 0)
                $(".wallpaper_image_holder").attr("src", wlp.image);
        } else {
            liveWallpaperChooser.wallpaperToEdit = null;
            $("#wlps_title_inpt").val("");
        }
    }
    static displayLiveWallpapers(wlps) {
        for (let index = 0; index < wlps.length; index++) {
            const item = wlps[index];
            liveWallpaperChooser.addWallpaper(item)
        }
    }
    static getWallpaperOptions() {
        var tree = [{
            title: "Edit",
            id: 0
        }, {
            title: "Delete",
            id: 1
        }]
        return tree;
    }
    static addWallpaper(wlp) {
        var thisWlp = wlp;
        var thumbnail = wlp.image;
        if (thumbnail == "")
            thumbnail = "images/missing.jpg"
        var title = wlp.title;
        var wlpHtml = liveWallpaperChooser.createWallpaperLayout();
        wlpHtml.find(".wlp_item_img").attr("src", thumbnail);
        wlpHtml.find(".wallpaper_title").text(title);
        wlpHtml.find(".editWlpIcon").click(function(ee) {
            //liveWallpaperChooser.showOptionsForWallpaper(thisWlp, wlpHtml)
            menuMaker.show(liveWallpaperChooser.getWallpaperOptions(), function(e) {
                if (e.id == 0) {
                    liveWallpaperChooser.showEditWallpaper(thisWlp, wlpHtml);
                } else if (e.id == 1) {
                    dialog.show(function(e) {
                        if (e == 2) { // deleting wallpaper
                            liveWallpaperChooser.deleteWallpaper(thisWlp, wlpHtml)
                        } else // cancel
                        {}
                    }, "Delete Wallpaper : " + thisWlp.title, "Live wallpaper will be deleted, Images and particle will not", [
                        ["Cancel", "blankBtn"],
                        ["Delete", "redBtn"]
                    ])
                }
            }, [ee.clientX, ee.clientY])
            ee.stopPropagation();
        });

        wlpHtml.find(".img_item_img").click(function() {
            liveWallpaperChooser.wlpSelected(wlp);
        })
        wlpHtml.click(function() {
            liveWallpaperChooser.wlpSelected(thisWlp);
        })
        $(".wallpaper_wraper").append(wlpHtml)
    }
    static showOptionsForWallpaper(wlp, htmlElement) {
        dialog.show(function(e) {
            if (e == 1) { //  edit wallpaper
                liveWallpaperChooser.showEditWallpaper(wlp, htmlElement);
            } else { //   deleting wallpaper
                dialog.show(function(e) {
                    if (e == 2) { // deleting wallpaper
                        liveWallpaperChooser.deleteWallpaper(wlp, htmlElement)
                    } else // cancel
                    {}
                }, "Delete Wallpaper : " + wlp.title, "Live wallpaper will be deleted, Images and particle will not", [
                    ["Cancel", "blankBtn"],
                    ["Delete", "redBtn"]
                ])
            }
        }, "Wallpaper options", "you can remove/edit this wallpaper.", [
            ["Edit", "greenBtn"],
            ["Delete", "redBtn"]
        ])
    }
    static showEditWallpaper(wlp, htmlElement) {
        liveWallpaperChooser.showCreateWallpaperDialog(wlp);
    }
    static deleteWallpaper(wlp, htmlElement) {
        loading.show("Deleting :" + wlp.title)
        $.ajax({
            url: "api/delete_wallpaper.php?id=" + wlp.id,
            success: function(result) {
                loading.hide()
                htmlElement.remove();
            }
        });
    }
    static wlpSelected(wlp) {
        if (liveWallpaperChooser.wallpaperSelectedCallback != null) {
            liveWallpaperChooser.wallpaperSelectedCallback(wlp);
            liveWallpaperChooser.wallpaperSelectedCallback = null;
            liveWallpaperChooser.hide()
        } else {
            dialog.show(function(e) {
                if (e == 2) {
                    window.location.href = "?wlpId=" + wlp.id;
                } else {}
            }, "Open Wallpaper", "Opening wallpaper :" + wlp.title, [
                ["Cancel", "blankBtn"],
                ["Open", "greenBtn"]
            ])
        }
    }

    static hide() {
        $("#livewallpapers_container").hide();
        liveWallpaperChooser.reset();

    }
    static hideCreatenewWallpaperDialog() {
        $("#newWAllpaper_container").hide();
    }

    static createWallpaperLayout() {
        var htmlObj = "<div class=\"wallpaperItem\">" +
            "<img class=\"wlp_item_img\">" +
            "<div class=\"wallpaper_title_holder\">" +
            "<img src=\"images/edit.png\" class=\"pointer small_icon editWlpIcon inlineDisplay\">" +
            "<p class=\"wallpaper_title\"></p>" +
            "</div>" +
            "</div>";
        return $(htmlObj);
    }

    static refresh() {
        liveWallpaperChooser.clear();
        this.show();
    }


    static saveWallpaper(file, title, type, wlpid, json, imagesids, callback) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('type', type);
        fd.append('images', imagesids);

        if (title != null)
            fd.append('title', title);

        if (wlpid != null) {
            fd.append('id', wlpid);
        }
        if (json != null) {
            fd.append('json', json);
        }
        loading.show("Saving...");
        $.ajax({
            url: 'api/save_wallpaper.php',
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
}

$().ready(function() {


    $(".createWallpaper").click(function() {
        liveWallpaperChooser.showCreateWallpaperDialog();
    })

    $(".wallpaper_image_holder").click(function() {
        $("#wlps_thmb_inpt").click()
    })

    $(".closeNewWallpaper").click(liveWallpaperChooser.hideCreatenewWallpaperDialog);
    $(".closeliveWallpaperChooser").click(liveWallpaperChooser.hide);
    $("#wlps_thmb_inpt").change(function() {
        var file = $(this).get(0).files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function() {
                $(".wallpaper_image_holder").attr("src", reader.result)
            }
            reader.readAsDataURL(file);
        }
    })
    $("#submitNewWallpaper").click(function() {
        liveWallpaperChooser.hideCreatenewWallpaperDialog()
        var file = $('#wlps_thmb_inpt')[0].files[0];
        var title = $("#wlps_title_inpt").val();
        var type = 'save';
        var wlpid = null;
        var json = "";
        var imagesIds = "";
        if (liveWallpaperChooser.wallpaperToEdit != null) {
            wlpid = liveWallpaperChooser.wallpaperToEdit.id;
            type = 'edit';
            json = null;
        }


        liveWallpaperChooser.saveWallpaper(file, title, type, wlpid, json, imagesIds, function(response) {
            if (response.code == 1) {
                if (liveWallpaperChooser.wallpaperToEdit == null) { // new wallpaper created
                    liveWallpaperChooser.addWallpaper(response.result)
                } else { // update edited wallpaper
                    //liveWallpaperChooser.show(liveWallpaperChooser.wallpaperSelectedCallback);
                }
            } else
                error.showErrorJson(response);
        })
    })


    $(".wlpsSearch input").keyup(function(e) {
        if (e.keyCode == 13) {
            liveWallpaperChooser.searchFor($(this).val())
        }
    })

    $(".wlpsSearch .close").click(function(e) {
        liveWallpaperChooser.searchFor("")
    })

    $(".wlp_timesort").click(function() {
        liveWallpaperChooser.changeOrderAndLoad();
    })


    $(".refreshWallpapers").click(function() {
        liveWallpaperChooser.refresh();
    })
    $(".wlpLoadMore").click(function() {
        liveWallpaperChooser.show();
    })
    liveWallpaperChooser.init();

})