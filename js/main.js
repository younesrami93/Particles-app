"use strict";

function main() {
    var mouseDown = false;
    var mouseDown_h_resizer = false;
    var mouseDown_w_resizer = false;
    var mouseDownCords = new Array();

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    var canvas = document.getElementById("glCanvas");
    var ctx = canvas.getContext("2d");
    globals.width = canvas.width;
    globals.height = canvas.height;

    var wallpaper = new ULiveWallpaper();
    MainController.wallpaper = wallpaper;
    wallpaper.setSize(canvas.width, canvas.height)
    wallpaper.init();
    var layer = ParticleSystem.createDefaultLayer()

    $(".wallpapers").click(function() {
        liveWallpaperChooser.show(null)
    })
    $(".images").click(function() {
        imageChooser.show(null, "image")
    })
    $(".particles").click(function() {
        imageChooser.show(null, "particle")
    })

    $(".h-sizer").mousedown(function(e) {
        mouseDown_h_resizer = true;
        var parentOffset = $("body").offset();
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        mouseDownCords[0] = relX;
        mouseDownCords[1] = relY;
    })
    $(".w-sizer").mousedown(function(e) {
        mouseDown_w_resizer = true;
        var parentOffset = $("body").offset();
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        mouseDownCords[0] = relX;
        mouseDownCords[1] = relY;
    })
    $("body").mouseup(function() {
        mouseDown_h_resizer = false;
        mouseDown_w_resizer = false;
    })
    $("body").mousemove(function(e) {
        if (mouseDown_h_resizer) {
            var parentOffset = $("body").offset();
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            var xdrag = x - mouseDownCords[0];
            var ydrag = y - mouseDownCords[1];

            mouseDownCords[0] = x;
            mouseDownCords[1] = y;
            canvas.height = canvas.height + ydrag;
            globals.height = canvas.height;
            MainController.wallpaper.updateViewPort(canvas.width, canvas.height);
        } else if (mouseDown_w_resizer) {
            var parentOffset = $("body").offset();
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            var xdrag = x - mouseDownCords[0];
            var ydrag = y - mouseDownCords[1];

            mouseDownCords[0] = x;
            mouseDownCords[1] = y;
            canvas.width = canvas.width - xdrag * 2;
            globals.width = canvas.width;
            MainController.wallpaper.updateViewPort(canvas.width, canvas.height);
        }

    })
    $("#glCanvas").mousemove(function(e) {
        /*var parentOffset = $(this).parent().offset();
        var x = e.pageX - parentOffset.left;
        var y = e.pageY - parentOffset.top;

        var xf = (x - canvas.width / 2) / globals.width;
        var yf = (y - canvas.height / 2) / globals.width;

        parallaxManager.setOffset(xf, yf)*/
    })
    $("#glCanvas").mousedown(function(e) {
        mouseDown = true;
        var parentOffset = $(this).parent().offset();
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        mouseDownCords[0] = relX;
        mouseDownCords[1] = relY;
        if (MainController.selectedLayer == null)
            return;
        if (MainController.selectedLayer.type.toLowerCase().indexOf("componant") > -1)
            MainController.selectedLayer.getLayer().showArea();
        else
            MainController.selectedLayer.showArea();
    })

    $("#glCanvas").mouseup(function(e) {
        mouseDown = false;
        if (MainController.selectedLayer == null)
            return;
        if (MainController.selectedLayer.type.toLowerCase().indexOf("componant") > -1)
            MainController.selectedLayer.getLayer().hideArea();
        else
            MainController.selectedLayer.hideArea();
    })

    $("#glCanvas").mousemove(function(e) {
        if (MainController.selectedLayer == null)
            return;
        if (mouseDown) {
            var parentOffset = $(this).parent().offset();
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            var xdrag = x - mouseDownCords[0];
            var ydrag = y - mouseDownCords[1];

            mouseDownCords[0] = x;
            mouseDownCords[1] = y;

            if (MainController.selectedLayer != null) {
                if (MainController.selectedLayer.type.toLowerCase().indexOf("componant") > -1)
                    MainController.selectedLayer.getLayer().drag(xdrag, ydrag, x, y);
                else
                    MainController.selectedLayer.drag(xdrag, ydrag, x, y);
            }
        }

    })

    function update(progress) {
        // Update the state of the world for the elapsed time since last render
    }
    var time = 0.1;

    function draw() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.fillRect(v.getX(canvas.width), v.getY(canvas.width), v.getWidth(canvas.width), v.getHeight(canvas.width));
        MainController.wallpaper.drawFrame(ctx);

        //if(!v.draw(ctx,canvas.width,canvas.height,0))
        //console.log("part dead "+v.lifeSpanMs);
        //alert("part is dead");
    }

    function loop(timestamp) {
        var progress = timestamp - lastRender

        update(progress)
        draw()

        lastRender = timestamp
        window.requestAnimationFrame(loop)
    }


    var lastRender = 0
    window.requestAnimationFrame(loop)


    layersController.showUWallpaperLayers(wallpaper)

    function checkForWallpaper() {
        const queryString = window.location.search;
        if (queryString.length > 0) {
            const urlParams = new URLSearchParams(queryString);
            const wlpId = urlParams.get('wlpId')
            if (wlpId != null) {
                liveWallpaperChooser.loadWallpaper(wlpId, function(resWlp) {
                    liveWallpaperChooser.showWallpaper(resWlp);
                });
            } else {
                liveWallpaperChooser.show(null, false);
            }
        } else
            liveWallpaperChooser.show(null, false);

    }
    checkForWallpaper();
}

window.onload = main;