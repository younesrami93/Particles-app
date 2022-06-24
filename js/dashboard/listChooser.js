class listChooser {
    static listToEdit = null;
    static listToEditHtml = null;
    static currentPosition = 0;
    static requestCount = 10;
    static allLoaded = false;
    static isLoading = false;
    static search = null;
    static order = "DESC";
    static clear() {
        $(".listsContainer").empty();
        listChooser.currentPosition = 0;
        listChooser.allLoaded = false;
    }
    static changeOrderAndLoad() {
        listChooser.clear();
        if (listChooser.order == "ASC") {
            listChooser.order = "DESC";
        } else
            listChooser.order = "ASC";
        console.log(listChooser.order);
        console.log("change order triger list loading");
        listChooser.show();
        localStorage["listsOrder"] = listChooser.order;
        listChooser.updateOrderText();
    }
    static refresh() {
        listChooser.clear();
        this.show();
    }
    static updateOrderText() {
        $(".timesort p").text(listChooser.order == "ASC" ? "oldest first" : "newest first")
    }

    static searchFor(search) {
        if (search == "" && listChooser.search == null)
            return;
        if (search == undefined || search == "") {
            listChooser.search = null;
            listChooser.clear();
            listChooser.show();
            $(".search input").val("")
            $(".search .close").css("opacity", "0")
            return;
        }
        $(".search .close").css("opacity", "1")
        listChooser.clear();
        listChooser.search = search;
        listChooser.show();
        console.log("searching for " + search);
    }
    static showLoadMore() {
        $(".loadMoreLists").show();
    }
    static hideLoadMore() {
        $(".loadMoreLists").hide();
    }
    static showLoading() {
        $(".loadingLists").show();
    }
    static hideLoading() {
        $(".loadingLists").hide();
    }
    static dataLoaded() {
        listChooser.isLoading = false;
        listChooser.showLoadMore();
        listChooser.hideLoading();
    }
    static alllistsLoaded() {
        listChooser.hideLoading();
        listChooser.hideLoadMore();
        listChooser.allLoaded = true;
        console.log("all lists loaded ");
    }
    static loading() {
        listChooser.isLoading = true;
        listChooser.hideLoadMore();
        listChooser.showLoading();
    }
    static show() {
        if (listChooser.isLoading)
            return;
        var search = "";
        if (listChooser.search != undefined) {
            search = "&search=" + listChooser.search;
        } else
            search = "";
        listChooser.loading();
        console.log("loading lists " + search);
        $.ajax({
            url: "api/get_lists.php?position=" + listChooser.currentPosition + "&count=" + listChooser.requestCount + "&order=" + listChooser.order + search,
            success: function(result) {
                listChooser.dataLoaded();
                try {
                    console.log("lists loaded " + result);
                    var lists = JSON.parse(result);
                    if (lists.code == 1) {
                        if (lists.result.length < listChooser.requestCount) {
                            listChooser.alllistsLoaded();
                        } else {
                            listChooser.currentPosition += lists.result.length;
                            listChooser.showLoadMore();
                        }
                        listChooser.displaylists(lists.result)
                    } else {
                        error.showErrorJson(lists);
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });
    }
    static showCreatelistDialog(list, listHtml) {
        listChooser.showCreatenewlistDialog()
        $(".list_image_holder").attr("src", "images/image_holder.png");
        $("#list_thmb_inpt").val("");
        if (list != undefined) {
            listChooser.listToEdit = list;
            listChooser.listToEditHtml = listHtml;
            $("#list_title_inpt").val(list.title);
            $("#list_label_inpt").val(list.label);
            if (list.image.length > 0)
                $(".list_image_holder").attr("src", list.image);
        } else {
            listChooser.listToEdit = null;
            listChooser.listToEditHtml = null;
            $("#list_title_inpt").val("");
            $("#list_label_inpt").val("");

        }
    }
    static displaylists(lists) {

        for (let index = 0; index < lists.length; index++) {
            const item = lists[index];
            listChooser.addlist(item)
        }

        if (lists.length == listChooser.requestCount && Math.abs($(".content_data")[0].scrollHeight - $(".content_data")[0].clientHeight) <= 1) {
            console.log("scroll bar not visible yet, so load more");
            listChooser.show();
        }
    }
    static addlist(list, prepend) {
        var thislist = list;
        var thumbnail = list.image;
        if (thumbnail == "")
            thumbnail = "images/default_list.png"
        var listHtml = listChooser.createlistLayout();
        var type = list.type;
        listHtml.find(".icon").attr("src", thumbnail);
        listHtml.find(".id").text(list.id);
        listHtml.find(".listtitle").text(list.title);
        listHtml.find(".count").text(list.wallpapersCount);

        if (type == "")
            type = 0;
        listHtml.find(".type").find("select").prop('selectedIndex', type);

        listHtml.find(".type").find("select").change(function(e) {
            var t = $(this).prop('selectedIndex')
            listChooser.listToEdit = thislist;
            listChooser.listToEditHtml = listHtml;
            listChooser.savelist("", null, "edit", thislist.id, null, t, function(response) {
                if (response.code == 1) {
                    if (listChooser.listToEdit == null) { // new list created
                        listChooser.addlist(response.result, true)
                    } else { // update edited list
                        listChooser.updatelist(response.result, listChooser.listToEditHtml)
                    }
                } else
                    error.showErrorJson(response);
            })
        })

        listHtml.find(".more").click(function(e) {
            menuMaker.show(listChooser.getOptions(), function(e) {
                if (e.id == 0) {
                    listChooser.showEditlist(list, listHtml);
                } else if (e.id == 1) {
                    list_wallpapers.loadWallpapersForList(list, function(count) {
                        listHtml.find(".count").text(count);
                    });
                } else if (e.id == 2) {
                    listChooser.deleteProcess(list, listHtml);
                }

            }, [e.clientX, e.clientY])
            e.stopPropagation()
        })

        /*  listHtml.click(function() {
              list_wallpapers.loadWallpapersForList(list, function(count) {
                  listHtml.find(".count").text(count);
              });
          })*/
        listHtml.find(".label").text(list.label);
        if (prepend == undefined)
            $(".listsContainer").append(listHtml)
        else
            $(".listsContainer").prepend(listHtml)
    }
    static deleteProcess(list, listHtml) {
        dialog.show(function(e) {
            if (e == 2) { // deleting list
                listChooser.deletelist(list, listHtml);
            } else // cancel
            {}
        }, "Delete list : " + list.title, "You cant restore it back after deleting it", [
            ["Cancel", "blankBtn"],
            ["Delete", "redBtn"]
        ])
    }
    static getOptions() {
        var tree = [{
            title: "Manage wallpapers",
            id: 1
        }, {
            title: "Edit",
            id: 0
        }, {
            title: "Delete",
            id: 2
        }]
        return tree;
    }
    static updatelist(list, listHtml) {
        listHtml.unbind();
        /*  listHtml.find(".more").unbind();
          listHtml.find(".delete").unbind();
          listHtml.find(".edit").unbind();*/

        var thislist = list;
        var thumbnail = list.image;
        if (thumbnail == "")
            thumbnail = "images/default_list.png"
        listHtml.find(".icon").attr("src", thumbnail);
        listHtml.find(".id").text(list.id);
        listHtml.find(".listtitle").text(list.title);
        var type = list.type;
        if (type == "")
            type = 0;
        listHtml.find(".type").find("select").prop('selectedIndex', type);

        listHtml.find(".type").find("select").change(function(e) {
            var t = $(this).prop('selectedIndex')
            listChooser.listToEdit = thislist;
            listChooser.listToEditHtml = listHtml;
            listChooser.savelist("", null, "edit", thislist.id, null, t, function(response) {
                if (response.code == 1) {
                    if (listChooser.listToEdit == null) { // new list created
                        listChooser.addlist(response.result, true)
                    } else { // update edited list
                        listChooser.updatelist(response.result, listChooser.listToEditHtml)
                    }
                } else
                    error.showErrorJson(response);
            })
        })

        /*listHtml.find(".delete").click(function() {
            dialog.show(function(e) {
                if (e == 2) { // deleting list
                    listChooser.deletelist(list, listHtml);
                } else // cancel
                {}
            }, "Delete list : " + list.title, "You cant restore it back after deleting it", [
                ["Cancel", "blankBtn"],
                ["Delete", "redBtn"]
            ])
        })
        listHtml.find(".edit").click(function() {
            listChooser.showEditlist(list, listHtml);
        })*/

        listHtml.find(".more").click(function(e) {
                menuMaker.show(listChooser.getOptions(), function(e) {
                    if (e.id == 0) {
                        listChooser.showEditlist(list, listHtml);
                    } else if (e.id == 1) {
                        list_wallpapers.loadWallpapersForList(list, function(count) {
                            listHtml.find(".count").text(count);
                        });
                    } else if (e.id == 2) {
                        listChooser.deleteProcess(list, listHtml);
                    }

                }, [e.clientX, e.clientY])
            })
            /*listHtml.click(function() {
                list_wallpapers.loadWallpapersForList(list, function(count) {
                    listHtml.find(".count").text(count);
                });
            })*/

        listHtml.find(".label").text(list.label);
    }

    static showEditlist(list, htmlElement) {
        listChooser.showCreatelistDialog(list, htmlElement);
    }
    static deletelist(list, htmlElement) {
        loading.show("Deleting :" + list.title)
        $.ajax({
            url: "api/delete_list.php?id=" + list.id,
            success: function(result) {
                loading.hide()
                console.log(result);
                var res = JSON.parse(result);
                if (res.code == 1) {
                    htmlElement.remove();
                } else {
                    error.showErrorJson(res);
                }
            }
        });
    }
    static listSelected(list) {

    }

    static hideCreatenewlistDialog() {
        $("#new_container").hide();
    }
    static showCreatenewlistDialog() {
        $("#new_container").show();
    }

    static createlistLayout() {
        var htmlObj = " <tr>" +
            "<td class=\"id\">1</td>" +
            "<td><img src=\"images/image_holder.png\" class=\"listicon_medium icon\"></td>" +
            "<td class=\"listtitle\"></td>" +
            "<td class=\"type\"><select><option>3 collumn</option><option>2 collumn</option><option>1 collumn</option></select></td>" +
            "<td class=\"label\"></td>" +
            "<td class=\"count\"></td>" +
            "<td class=\"actions\">" +
            /* "<img class=\"small_action_button edit\" src=\"images/edit.png\">" +
             "<img class=\"small_action_button delete\" src=\"images/delete2.png\">" +*/
            "<img class=\"small_action_button more paddingLeft20\" src=\"images/more.png\">" +
            "</td>" +
            "</tr>";
        return $(htmlObj);
    }
    static savelist(file, title, type, listId, label, list_type, callback) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('type', type);
        fd.append('list_type', list_type);
        if (label != null)
            fd.append('label', label);

        if (title != null)
            fd.append('title', title);

        if (listId != null) {
            fd.append('id', listId);
        }
        loading.show();
        $.ajax({
            url: 'api/save_list.php',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log(response);
                loading.hide();
                response = JSON.parse(response);
                if (callback != null) {
                    callback(response);
                }
            },
        });
    }
    static init() {
        $(".list_image_holder").click(function() {
            $("#list_thmb_inpt").click()
        })

        $(".closeNewlist").click(listChooser.hideCreatenewlistDialog);
        $(".closelistChooser").click(listChooser.hide);
        $("#list_thmb_inpt").change(function() {
            var file = $(this).get(0).files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function() {
                    $(".list_image_holder").attr("src", reader.result)
                }
                reader.readAsDataURL(file);
            }
        })
        $("#submitNewlist").click(function() {
            var file = $('#list_thmb_inpt')[0].files[0];
            var title = $("#list_title_inpt").val();
            var label = $("#list_label_inpt").val();
            if (title == "") {
                alert("title is empty")
                return;
            }
            if (label == "") {
                alert("label is empty")
                return;
            }
            listChooser.hideCreatenewlistDialog()

            var type = 'save';
            var listId = null;
            if (listChooser.listToEdit != null) {
                listId = listChooser.listToEdit.id;
                type = 'edit';
            }


            listChooser.savelist(file, title, type, listId, label, 0, function(response) {
                if (response.code == 1) {
                    if (listChooser.listToEdit == null) { // new list created
                        listChooser.addlist(response.result, true)
                    } else { // update edited list
                        listChooser.updatelist(response.result, listChooser.listToEditHtml)
                    }
                    listChooser.listToEdit = null;
                } else
                    error.showErrorJson(response);
            })
        })

        $(".timesort").click(function() {
            listChooser.changeOrderAndLoad();
        })
        $(".content_data").scroll(function() {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1) {
                if (!listChooser.allLoaded) {
                    console.log("scroll triger list loading");
                    //listChooser.show();
                }
            }
        });
        $(".loadMoreLists").click(function() {
            listChooser.show();
        })

        $(".search input").keyup(function(e) {
            if (e.keyCode == 13) {
                listChooser.searchFor($(this).val())
            }
        })

        $(".search .close").click(function(e) {
            listChooser.searchFor("")
        })

        $(".refresh").click(function() {
            listChooser.refresh();
        })
        $(".newlist").click(function() {
            listChooser.showCreatelistDialog();
        })

        var o = localStorage["listsOrder"];
        if (o != undefined)
            listChooser.order = o;
        listChooser.updateOrderText();
        listChooser.show();
    }
}