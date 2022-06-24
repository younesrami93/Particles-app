class imageChooser {
    static type;
    static imageSelectedCallback = null;
    static currentPosition = 0;
    static requestCount = 20;
    static search = null;
    static order = "DESC";

    static allLoaded = false;
    static isLoading = false;


    static allDataLoaded() {
        imageChooser.hideLoading();
        imageChooser.hideLoadMore();
        imageChooser.allLoaded = true;
        console.log("all images loaded ");
    }
    static loading() {
        imageChooser.isLoading = true;
        imageChooser.hideLoadMore();
        imageChooser.showLoading();
        imageChooser.hideNoData();
    }
    static showNoData() {
        $(".images_noData").show();
    }
    static hideNoData() {
        $(".images_noData").hide();
    }
    static dataLoaded() {
        imageChooser.isLoading = false;
        imageChooser.showLoadMore();
        imageChooser.hideLoading();
    }

    static showLoadMore() {
        $(".img_loadMore").show();
    }
    static hideLoadMore() {
        $(".img_loadMore").hide();
    }
    static showLoading() {
        $(".imgLoadingMore").show();
    }
    static hideLoading() {
        $(".imgLoadingMore").hide();
    }

    static clear() {
        $(".images_wraper").empty()
        imageChooser.currentPosition = 0;
        imageChooser.allLoaded = false;
    }
    static reset() {
        $(".images_wraper").empty();
        imageChooser.search = null;
        imageChooser.currentPosition = 0;
        imageChooser.allLoaded = false;
        $(".imgSearch input").val("")
        $(".imgSearch .close").css("opacity", "0")
    }

    static show(callback, type) {
        imageChooser.type = type;
        var search = "";
        if (imageChooser.search != undefined) {
            search = "&search=" + imageChooser.search;
        } else
            search = "";

        if (callback != undefined) {
            this.imageSelectedCallback = callback;
        }
        imageChooser.loading();
        $.ajax({
            url: "api/get_images.php?type=" + type + "&position=" + imageChooser.currentPosition + "&count=" + imageChooser.requestCount + "&order=" + imageChooser.order + search,
            success: function(result) {
                imageChooser.dataLoaded();
                var imgs = JSON.parse(result);
                if (imgs.code == 1) {
                    if (imgs.result.length == 0 && imageChooser.currentPosition == 0)
                        imageChooser.showNoData()
                    if (imgs.result.length < imageChooser.requestCount) {
                        imageChooser.allDataLoaded();
                    } else {
                        imageChooser.currentPosition += imgs.result.length;
                        imageChooser.showLoadMore();
                    }
                    imageChooser.displayImages(imgs.result)
                } else
                    error.showErrorJson(imgs)
            }
        });

        $("#imageChooser_container").show();
    }

    static displayImages(imgs) {
        for (let index = 0; index < imgs.length; index++) {
            const item = imgs[index];
            imageChooser.addImage(item)
        }
    }

    static getImageOptions() {
        var tree = [{
            title: "Delete",
            id: 0
        }]
        return tree;
    }

    static addImage(imgJson) {
        var currentSrc = imgJson.path;
        var id = imgJson.id;
        var thumbnail = imgJson.thumbnail;
        var img = imageChooser.createImgLayout();
        img.find(".img_item_img").attr("src", thumbnail);
        img.find(".img_item_title").text(imgJson.name);
        img.find(".img_item_img").click(function() {
            imageChooser.imgSelected(imgJson);
        })
        img.find(".more").click(function(e) {
            e.stopPropagation();
            menuMaker.show(imageChooser.getImageOptions(), function(ee) {
                if (ee.id == 0) {
                    dialog.show(function(e) {
                        if (e == 1) {

                        } else {
                            imageChooser.deleteImage(imgJson, img)
                        }
                    }, "Delete image", "this image might be used in a wallpaper, are you sure to delete it ?", [
                        ["Cancel", "blankBtn"],
                        ["Delete", "redBtn"]
                    ])
                }

            }, [e.clientX, e.clientY])
        })
        $(".images_wraper").append(img)
    }
    static deleteImage(imgJson, img) {
        loading.show();
        $.ajax({
            url: 'api/delete_image.php?id=' + imgJson.id,
            contentType: false,
            processData: false,
            success: function(response) {
                loading.hide();
                if (response != 0) {
                    console.log(response);

                    var res = JSON.parse(response);
                    if (res.code == 1)
                        img.remove();
                    else
                        error.showErrorJson(res);
                } else {
                    alert("Something went wrong : code 1035");
                }
            },
        });
    }
    static imgSelected(img) {
        if (imageChooser.imageSelectedCallback != null) {
            imageChooser.imageSelectedCallback(img);
            imageChooser.imageSelectedCallback = null;
            imageChooser.hide()
        }
    }

    static hide() {
        $("#imageChooser_container").hide();
        imageChooser.reset();
    }
    static createImgLayout() {
        var htmlObj = "<div class=\"imageItem\">" +
            "<img src=\"\" class=\"img_item_img\">" +
            "<div > " +
            "<img src=\"images/more.png\" class=\"more pointer small_icon rightFloat\">" +
            "<p class=\"img_item_title\" style=\"overflow:hidden\">title</p>" +
            "</div>" +
            "</div>";
        return $(htmlObj);
    }
    static refresh() {
        imageChooser.clear();
        imageChooser.show(imageChooser.callback, imageChooser.type);
    }

    static searchFor(search) {
        if (search == "" && imageChooser.search == null)
            return;
        if (search == undefined || search == "") {
            imageChooser.search = null;
            imageChooser.clear();
            imageChooser.show(imageChooser.callback, imageChooser.type);
            $(".imgSearch input").val("")
            $(".imgSearch .close").css("opacity", "0")
            return;
        }
        $(".imgSearch .close").css("opacity", "1")
        imageChooser.clear();
        imageChooser.search = search;
        imageChooser.show(imageChooser.callback, imageChooser.type);
        console.log("searching for " + search);
    }


    static init() {
        var o = localStorage["imgOrder"];
        if (o != undefined)
            imageChooser.order = o;
        imageChooser.updateOrderText();
    }

    static changeOrderAndLoad() {
        imageChooser.clear();
        if (imageChooser.order == "ASC") {
            imageChooser.order = "DESC";
        } else
            imageChooser.order = "ASC";
        console.log("change order triger img_timesort loading");
        imageChooser.show(imageChooser.callback, imageChooser.type);
        localStorage["imgOrder"] = imageChooser.order;
        imageChooser.updateOrderText();
    }

    static updateOrderText() {
        $(".img_timesort").text(imageChooser.order == "ASC" ? "oldest first" : "newest first")
    }


}

$().ready(function() {
    $(".upload").click(function() {
        $("#file").click()
    })

    $(".closeImageChooser").click(imageChooser.hide);
    $("#file").change(function() {
        var fd = new FormData();
        var files = $('#file')[0].files[0];
        fd.append('file', files);
        fd.append('type', imageChooser.type);
        loading.show();
        $.ajax({
            url: 'api/upload.php',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log(response);
                loading.hide();
                if (response != 0) {
                    var res = JSON.parse(response);
                    if (res.code == 1)
                        imageChooser.addImage(res.result[0]);
                    else
                        error.showErrorJson(res);
                } else {
                    alert('file not uploaded ' + response);
                }
            },
        });


    })


    $(".imgSearch input").keyup(function(e) {
        if (e.keyCode == 13) {
            imageChooser.searchFor($(this).val())
        }
    })

    $(".imgSearch .close").click(function(e) {
        imageChooser.searchFor("")
    })

    $(".img_timesort").click(function() {
        imageChooser.changeOrderAndLoad();
    })



    $(".refreshImages").click(function() {
        imageChooser.refresh();
    })

    $(".img_loadMore").click(function() {
        imageChooser.show(imageChooser.callback, imageChooser.type);
    })
    imageChooser.init();
})