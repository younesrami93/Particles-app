class MainMenu {}
$().ready(function() {
    $(".newWlp").click(function() {
        liveWallpaperChooser.showCreateWallpaperDialog();
    })
    $(".openWlp").click(function() {
        liveWallpaperChooser.show();
    })
    $(".saveWlp").click(function() {
        liveWallpaperChooser.saveCurrentWallpaper();
    })
    $(".saveAsWlp").click(function() {
        liveWallpaperChooser.saveCurrentWallpaperAs();
    })
    $(".saveChanges").click(function() {
        liveWallpaperChooser.saveCurrentWallpaper();
    })
    $(".menuDashboard").click(function() {
        window.open("index.html");
    })
    $(".exportPackage").click(function() {
        window.open("api/export.php?id=" + MainController.wallpaper.id);
    })
    $(".Presets").click(function() {
        ps_presetsChooser.showPresets(function(e)
        {
            dialog.show(function(ee){
                if(ee == 2)
                {
                    var presetJson = JSON.parse(e.json);
                    var layer = ParticleSystem.parse(presetJson);
                    MainController.wallpaper.addLayer(layer, true, true)
                }
            },"Add as layer","Add selected preset as particle system layer ?",[["cancel","blankBtn  "],["Yes","greenBtn"]])
        })
    })

})