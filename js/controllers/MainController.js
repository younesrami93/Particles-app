class MainController {
    static wallpaper;
    static selectedLayer;
    static addNewImage() {
        imageChooser.imageSelectedCallback = function(img) {
            var texture = new UTexture(img.path, "", function() {
                var layer = WallpaperLayer.createDefaultLayer(null, texture);
                layersController.addLayerLayout(layer);
                MainController.wallpaper.addLayer(layer, true);
            }, img.id)

        }
        imageChooser.show(null, "image")

    }
    static addNewParticleSystem() {
        var layer = ParticleSystem.createDefaultLayer();
        MainController.wallpaper.addLayer(layer, true, true);
    }
    static getNewLayerContextMenu() {
        var tree = [];
        var image = menuMaker.createObject("Image", 1)
        var ps = menuMaker.createObject("Particle System", -1)
        ps.childs = menuMaker.createObjects([
            ["New", 2],
            ["Load from preset", 3]
        ])
        tree.push(image);
        tree.push(ps);
        return tree;
    }
}
$().ready(function() {
    $(".remove").click(function() {
        if (!MainController.wallpaper.removeLayer(MainController.selectedLayer))
            alert("Cant remove all layers")
    });
    $(".moveUp").click(function() {
        MainController.wallpaper.moveLayerUp(MainController.selectedLayer)
    });
    $(".moveDown").click(function() {
        MainController.wallpaper.moveLayerDown(MainController.selectedLayer)
    });
    $(".duplicate").click(function() {
        MainController.wallpaper.duplicateLayer(MainController.selectedLayer)
    });
    $(".add_layer_btn").click(function(e) {
        menuMaker.show(MainController.getNewLayerContextMenu(), function(e) {
            if (e.id == 1) {
                MainController.addNewImage();
            } else if (e.id == 2) {
                MainController.addNewParticleSystem();
            } else if (e.id == 3) {
                ps_presetsChooser.showPresets(function(e) {
                    var presetJson = JSON.parse(e.json);
                    var layer = ParticleSystem.parse(presetJson);
                    MainController.wallpaper.addLayer(layer, true, true)
                });
            }

        }, [e.clientX + 175, e.clientY])
        e.stopPropagation();
    })
});