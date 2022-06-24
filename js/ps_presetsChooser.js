class ps_presetsChooser {
    static currentLayer;
    static presetsSelectedCallback
    static showPresets(callback) {
        ps_presetsChooser.presetsSelectedCallback = callback;
        $("#presets_container").show();
        loading.show();
        var fd = new FormData();
        $(".presets_content").empty();

        //fd.append('title', );
        $.ajax({
            url: 'api/get_presets.php',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log(response);
                loading.hide();

                response = JSON.parse(response);
                if (response.code == 1) {
                    ps_presetsChooser.displayPresets(response.result);
                } else
                    error.showErrorJson(response);
            },
        });

    }
    static displayPresets(items) {
        $(".presets_content").empty();
        for (let i = 0; i < items.length; i++) {
            var item = items[i];
            $(".presets_content").append(ps_presetsChooser.createPresetHtml(item));
        }
    }
    static showNewPresetDialog(layer) {
        ps_presetsChooser.currentLayer = layer;
        $("#newPreset_container").show();
        $("#preset_title").val(layer.title);
    }
    static hide() {
        ps_presetsChooser.presetsSelectedCallback = null;
        $("#presets_container").hide();
    }
    static hideNewPreset() {
        ps_presetsChooser.currentLayer = null;
        $("#newPreset_container").hide();
    }
    static presetSelected(preset) {
        var callback = ps_presetsChooser.presetsSelectedCallback;
        ps_presetsChooser.hide();
        if (callback != null) {
            loading.show();
            var fd = new FormData();
            fd.append('id', preset.id);
            $.ajax({
                url: 'api/get_preset.php',
                type: 'post',
                data: fd,
                contentType: false,
                processData: false,
                success: function(result) {
                    loading.hide();
                    try {
                        console.log(result);
                        var res = JSON.parse(result);
                        if (res.code == 1) {
                            console.log("preset loaded successfully");
                            callback(res.result[0]);
                        } else {
                            error.showErrorJson(res);
                        }
                    } catch (e) {
                        error.showError("can't parse data arrived from server", e);
                    }
                }
            });
        }
    }
    static deletePreset(item, html) {
        loading.show();
        $.ajax({
            url: 'api/delete_preset.php?id=' + item.id,
            contentType: false,
            processData: false,
            success: function(response) {
                loading.hide();
                if (response != 0) {
                    console.log(response);
                    var res = JSON.parse(response);
                    if (res.code == 1)
                        html.remove();
                    else
                        error.showErrorJson(res);
                } else {
                    alert("Something went wrong : code 1025");
                }
            },
        });
    }
    static saveAsPreset() {


        var title = $("#preset_title").val();
        var description = $("#preset_description").val();
        var json = JSON.stringify(ps_presetsChooser.currentLayer.toJson());
        console.log(title + "/" + json);

        var fd = new FormData();
        fd.append('title', title);
        fd.append('json', json);
        fd.append('description', description);

        loading.show();

        $.ajax({
            url: 'api/save_preset.php',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(result) {
                loading.hide();

                try {
                    console.log(result);
                    var res = JSON.parse(result);
                    if (res.code == 1) {
                        ps_presetsChooser.hideNewPreset();
                        console.log("preset saved " + result);
                    } else {
                        error.showErrorJson(wlps);
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });

    }
    static createPresetHtml(item) {
        var html = "<div class=\"preset_item\">" +
            "<img src=\"images/preset_img.png\" class=\"preset_item_img\">" +
            "<img src=\"images/trash 2.png\" class=\"removeIcon small_icon rightFloat\">" +
            "<p class=\"title padding6\">title here</p>" +
            "</div>"
        var html = $(html);
        html.find(".title").text(item.title);
        html.click(function() {
            ps_presetsChooser.presetSelected(item);
        })
        html.find(".removeIcon").click(function(e) {
            e.stopPropagation();
            dialog.show(function(e) {
                if (e == 1) {

                } else {
                    ps_presetsChooser.deletePreset(item, html)
                }
            }, "Delete preset:" + item.title, "you wont be able to restore it back", [
                ["Cancel", "blankBtn"],
                ["Delete", "redBtn"]
            ])

        })
        return html;
    }
}

$().ready(function() {

    $(".closeNewPreset").click(function() {
        ps_presetsChooser.hideNewPreset();
    })
    $(".closePresetChooser").click(function() {
        ps_presetsChooser.hide();
    })



    $("#submitNewPreset").click(function() {
        ps_presetsChooser.saveAsPreset();
    })
})