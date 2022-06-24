class liveWallpaperChooser {
    static wallpaperToEdit = null;
    static wallpaperToEditHtml = null;
    static currentPosition = 0;
    static requestCount = 10;
    static allLoaded = false;
    static isLoading = false;
    static search = null;
    static order = "DESC";
    static clear() {
        $(".wallpaper_wraper").empty();
        liveWallpaperChooser.currentPosition = 0;
        liveWallpaperChooser.allLoaded = false;
    }
    static changeOrderAndLoad() {
        liveWallpaperChooser.clear();
        if (liveWallpaperChooser.order == "ASC") {
            liveWallpaperChooser.order = "DESC";
        } else
            liveWallpaperChooser.order = "ASC";
        console.log(liveWallpaperChooser.order);
        console.log("change order triger wallpaper loading");
        liveWallpaperChooser.show();
        localStorage["wallpaperOrder"] = liveWallpaperChooser.order;
        liveWallpaperChooser.updateOrderText();
    }
    static refresh() {
        liveWallpaperChooser.clear();
        this.show();
    }
    static updateOrderText() {
        $(".timesort p").text(liveWallpaperChooser.order == "ASC" ? "oldest first" : "newest first")
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
    static searchFor(search) {
        if (search == "" && liveWallpaperChooser.search == null)
            return;
        if (search == undefined || search == "") {
            liveWallpaperChooser.search = null;
            liveWallpaperChooser.clear();
            liveWallpaperChooser.show();
            $(".search input").val("")
            $(".search .close").css("opacity", "0")
            return;
        }
        $(".search .close").css("opacity", "1")
        liveWallpaperChooser.clear();
        liveWallpaperChooser.search = search;
        liveWallpaperChooser.show();
        console.log("searching for " + search);
    }
    static showLoadMore() {
        $(".loadMore").show();
    }
    static hideLoadMore() {
        $(".loadMore").hide();
    }
    static showLoading() {
        $(".loadingMore").show();
    }
    static hideLoading() {
        $(".loadingMore").hide();
    }
    static dataLoaded() {
        liveWallpaperChooser.isLoading = false;
        liveWallpaperChooser.showLoadMore();
        liveWallpaperChooser.hideLoading();
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
    }
    static show() {
        if (liveWallpaperChooser.isLoading)
            return;
        var search = "";
        if (liveWallpaperChooser.search != undefined) {
            search = "&search=" + liveWallpaperChooser.search;
        } else
            search = "";
        liveWallpaperChooser.loading();
        console.log("loading wallpapers " + search);
        //loading.show()
        $.ajax({
            url: "api/get_wallpapers.php?position=" + liveWallpaperChooser.currentPosition + "&count=" + liveWallpaperChooser.requestCount + "&order=" + liveWallpaperChooser.order + search,
            success: function(result) {
                //loading.hide();
                liveWallpaperChooser.dataLoaded();
                try {
                    console.log("wallpapers loaded " + result);
                    var wlps = JSON.parse(result);
                    if (wlps.code == 1) {
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
    static showCreateWallpaperDialog(wlp, wlpHtml) {
        $("#newWAllpaper_container").show();
        $(".wallpaper_image_holder").attr("src", "images/image_holder.png");
        $("#wlps_thmb_inpt").val();
        if (wlp != undefined) {
            liveWallpaperChooser.wallpaperToEdit = wlp;
            liveWallpaperChooser.wallpaperToEditHtml = wlpHtml;
            $("#wlps_title_inpt").val(wlp.title);
            if (wlp.image.length > 0)
                $(".wallpaper_image_holder").attr("src", wlp.image);
        } else {
            liveWallpaperChooser.wallpaperToEdit = null;
            liveWallpaperChooser.wallpaperToEditHtml = null;
            $("#wlps_title_inpt").val("");
        }
    }
    static displayLiveWallpapers(wlps) {

        for (let index = 0; index < wlps.length; index++) {
            const item = wlps[index];
            liveWallpaperChooser.addWallpaper(item)
        }

        if (wlps.length == liveWallpaperChooser.requestCount && Math.abs($(".content_data")[0].scrollHeight - $(".content_data")[0].clientHeight) <= 1) {
            console.log("scroll bar not visible yet, so load more");
            liveWallpaperChooser.show();
        }
    }
    static addWallpaper(wlp, prepend) {
        var thisWlp = wlp;
        var thumbnail = wlp.image;
        if (thumbnail == "")
            thumbnail = "images/missing2.jpg"
        var title = wlp.title;
        var wlpHtml = liveWallpaperChooser.createWallpaperLayout();
        wlpHtml.find(".wlp_item_img").attr("src", thumbnail);
        wlpHtml.find(".wallpaper_title").text(title);
        wlpHtml.find(".editWlpIcon").click(function(e) {


            menuMaker.show(liveWallpaperChooser.getOptions(), function(e) {
                if (e.id == 0) {
                    liveWallpaperChooser.showEditWallpaper(wlp, wlpHtml);
                } else if (e.id == 1) {
                    dialog.show(function(e) {
                        if (e == 2) { // deleting wallpaper
                            liveWallpaperChooser.deleteWallpaper(wlp, wlpHtml)
                        } else // cancel
                        {}
                    }, "Delete Wallpaper : " + wlp.title, "Live wallpaper will be deleted, Images and particle will not", [
                        ["Cancel", "blankBtn"],
                        ["Delete", "redBtn"]
                    ])
                } else if (e.id == 2) {
                    var win = window.open("wlp.html?wlpId=" + wlp.id, '_blank');
                    win.focus();
                }

            }, [e.clientX, e.clientY])
            e.stopPropagation();
        });
        wlpHtml.click(function() {
            liveWallpaperChooser.wlpSelected(thisWlp);
        })
        if (prepend == undefined)
            $(".wallpaper_wraper").append(wlpHtml)
        else
            $(".wallpaper_wraper").prepend(wlpHtml)

    }
    static updateWallpaper(wlp, wlphtml) {
        var thisWlp = wlp;
        var thumbnail = wlp.image;
        if (thumbnail == "")
            thumbnail = "images/missing2.jpg"
        var title = wlp.title;
        wlphtml.find(".wlp_item_img").attr("src", thumbnail);
        wlphtml.find(".wallpaper_title").text(title);


        wlphtml.find(".editWlpIcon").off("click")
        wlphtml.off("click")

        wlphtml.find(".editWlpIcon").click(function(e) {
            liveWallpaperChooser.showOptionsForWallpaper(thisWlp, wlpHtml)
            e.stopPropagation();
        });

        wlphtml.click(function() {
            liveWallpaperChooser.wlpSelected(thisWlp);
        })
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
    static getOptions() {
        var tree = [{
            title: "Edit",
            id: 0
        }, {
            title: "Delete",
            id: 1
        }, {
            title: "Open Editor",
            id: 2
        }]
        return tree;
    }
    static showEditWallpaper(wlp, htmlElement) {
        liveWallpaperChooser.showCreateWallpaperDialog(wlp, htmlElement);
    }
    static deleteWallpaper(wlp, htmlElement) {
        loading.show("Deleting :" + wlp.title)
        $.ajax({
            url: "api/delete_wallpaper.php?id=" + wlp.id,
            success: function(result) {
                loading.hide()
                console.log(result);
                var res = JSON.parse(result);
                if (res.code == 1) {
                    dashboard.wallpaperRemoved();
                    htmlElement.remove();
                } else {
                    error.showErrorJson(res);
                }
            }
        });
    }
    static wlpSelected(wlp) {

        dialog.show(function(e) {
            if (e == 2) {
                window.location = "wlp.html?wlpId=" + wlp.id;
            } else {}
        }, "Open Wallpaper", "Opening wallpaper :" + wlp.title, [
            ["Cancel", "blankBtn"],
            ["Open", "greenBtn"]
        ])
    }

    static hide() {
        $("#livewallpapers_container").hide();
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
    static saveWallpaper(file, title, type, wlpid, json, imagesids, callback) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('type', type);
        if (imagesids != null && imagesids != undefined && imagesids != "")
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
    static init() {
        var o = localStorage["wallpaperOrder"];
        if (o != undefined)
            liveWallpaperChooser.order = o;
        liveWallpaperChooser.updateOrderText();
        liveWallpaperChooser.show();
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
        var file = $('#wlps_thmb_inpt')[0].files[0];
        var title = $("#wlps_title_inpt").val();
        if (title == "") {
            alert("title is empty")
            return;
        }
        liveWallpaperChooser.hideCreatenewWallpaperDialog()

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
                    liveWallpaperChooser.addWallpaper(response.result, true)
                    dashboard.wallpaperCreated();
                } else { // update edited wallpaper
                    liveWallpaperChooser.updateWallpaper(response.result, liveWallpaperChooser.wallpaperToEditHtml)
                }
            } else
                error.showErrorJson(response);
        })
    })

    $(".timesort").click(function() {
        liveWallpaperChooser.changeOrderAndLoad();
    })
    $(".content_data").scroll(function() {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1) {
            if (!liveWallpaperChooser.allLoaded) {
                console.log("scroll triger wallpaper loading");
                //liveWallpaperChooser.show();
            }
        }
    });
    $(".loadMore").click(function() {
        liveWallpaperChooser.show();
    })

    $(".search input").keyup(function(e) {
        if (e.keyCode == 13) {
            liveWallpaperChooser.searchFor($(this).val())
        }
    })

    $(".search .close").click(function(e) {
        liveWallpaperChooser.searchFor("")
    })

    $(".refreshWallpapers").click(function() {
        liveWallpaperChooser.refresh();
    })
    $(".newWallpaper").click(function() {
        liveWallpaperChooser.callback = function(e) {
            console.log(e);
        }
        liveWallpaperChooser.showCreateWallpaperDialog();
    })

    liveWallpaperChooser.init();



})