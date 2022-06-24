class layersController {
    static getLayersContainer() {
        return $("#layers_container");
    }
    static createLayerHtml(layer) {
        var visibilityIcon = "eye_closed.png"
        if (layer.enable)
            visibilityIcon = "eye_icon.png"

        var icon = "images/wallpaper_icon.png";
        if (layer.type == "wallpaper") {
            icon = "images/wallpaper_icon.png";
        } else {
            icon = "images/effects_icon.png";
        }

        var htmlText = "<div class=\"layer\">" +
            "<div class=\"layerChild\">" +
            "<img src=\"images/" + visibilityIcon + "\" class=\"extra_small_icon inlineDisplay visibility\">" +
            "<img src=\"" + icon + "\" class=\"extra_small_icon inlineDisplay\">" +
            "<p class=\"extra_small_title inlineDisplay layer_title\">" + layer.title + "</p>" +
            "<img src=\"images/more.png\" class=\"more extra_small_icon inlineDisplay rightFloat\">" +
            "</div>" +
            "<div class=\"layerComponants\" style=\"display: none;\"></div>"
        "</div>";
        layer.htmlElement = $(htmlText); // $.parseHTML(htmlText)
        layer.htmlElement.click(function() {
            layer.select()
        })

        layer.layerComponantsHtml = layer.htmlElement.find(".layerComponants");
        if (layer.type == ParticleSystem.type) {
            for (let i = 0; i < layer.componants.length; i++) {
                var item = layer.componants[i];
                layersController.addLayoutForComponant(item, layer.layerComponantsHtml, "componant " + (i + 1));
            }
            layer.htmlElement.find(".more").click(function(e) {
                layer.select()
                menuMaker.show(ComponantMaker.getComponantsTree(), function(e) {
                    if (e.id == 0) {
                        layer.select();
                        console.log(layer);
                        var cp = PropertyChanger.createDefault(layer);
                        layer.addComponnant(cp);
                        layersController.addLayoutForComponant(cp, layer.layerComponantsHtml, "new behavior");
                    } else if (e.id == 1) {
                        MainController.wallpaper.duplicateLayer(layer)
                    } else if (e.id == 2) {
                        ps_presetsChooser.showNewPresetDialog(layer);
                    } else if (e.id == 3) {
                        if (!MainController.wallpaper.removeLayer(layer))
                            alert("Cant remove all layers")
                    } else {
                        layer.select();
                        var arr = [];
                        if (Array.isArray(e.obj)) {
                            for (let i = 0; i < e.obj.length; i++) {
                                const element = e.obj[i];
                                var cp = layer.createComponant(element, e.title);
                                arr.push(cp);
                            }
                        } else {
                            var cp = layer.createComponant(e.obj, e.title);
                            arr.push(cp);
                        }
                        for (let i = 0; i < arr.length; i++) {
                            const element = arr[i];
                            layersController.addLayoutForComponant(element, layer.layerComponantsHtml);
                        }
                    }


                }, [e.clientX, e.clientY])


                e.stopPropagation();

            })
        } else {


            layer.htmlElement.find(".more").click(function(e) {
                layer.select()
                menuMaker.show(ComponantMaker.getWallpaperLayerTree(), function(e) {
                    if (e.id == 1) {
                        MainController.wallpaper.duplicateLayer(layer)
                    } else if (e.id == 2) {
                        if (!MainController.wallpaper.removeLayer(layer))
                            alert("Cant remove all layers")
                    }
                }, [e.clientX, e.clientY])


                e.stopPropagation();

            })
        }
        layer.htmlElement.find(".visibility").click(function(e) {
            e.stopPropagation();
            layer.enable = !layer.enable;
            if (layer.enable)
                $(this).attr("src", "images/eye_icon.png")
            else
                $(this).attr("src", "images/eye_closed.png")

        })
        return layer.htmlElement;
    }
    static addLayoutForComponant(cp, parentElement, title) {
        var item = cp;
        var cpLayout = layersController.createComponantHtml(item);
        parentElement.append(cpLayout)
        cpLayout.find(".title").text(cp.name)
        item.htmlElement = cpLayout;
        item.htmlElement.click(function(e) {
            item.select();
            e.stopPropagation()
        })
        item.htmlElement.find(".remove").click(function(e) {
            item.delete();
            e.stopPropagation()
        })
        item.updateName();
    }
    static showUWallpaperLayers(wallpaper) {
        layersController.getLayersContainer().empty()
        if (wallpaper.layers.length > 0) {
            for (let i = 0; i < wallpaper.layers.length; i++) {
                const layer = wallpaper.layers[i];
                layersController.addLayerLayout(layer)
            }
            wallpaper.layers[0].select();
        }

        layersController.showTitle(wallpaper);
    }
    static showTitle(wallpaper) {
        $(".wallpaperTitle p").text("Editing : " + wallpaper.title);
    }
    static addLayerLayout(layer) {
        layersController.getLayersContainer().append(layersController.createLayerHtml(layer));
    }
    static createComponantHtml(componant) {
        var htmlText = "<div class=\"componantLayout\">" +
            "<img src=\"images/magnet.png\" class=\"icon extra_small_icon2 inlineDisplay\">" +
            "<p class=\"title extra_small_title2 inlineDisplay\">componant 1</p>" +
            "<img src=\"images/delete.png\" class=\"remove rightFloat  extra_small_icon2 inlineDisplay\">" +
            "</div>";
        return $(htmlText);
    }



}