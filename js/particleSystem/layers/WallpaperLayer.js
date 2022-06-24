class WallpaperLayer extends BaseLayer {
    static count = 0;
    depth = false;
    wallpaper = null;
    position;
    texture = null;
    static type = "wallpaper"
    alpha = 1
    type = "wallpaper"
    drawArea = false;
    paralaxOffset = 0.0;
    static parse(json) {
        var wallpaperTexture = UTexture.parse(json.texture);
        wallpaperTexture.filter = json.texture.filter;
        var position = Vector.parse(json.position);
        var wlp = new WallpaperLayer(wallpaperTexture, position)
        wlp.title = json.title;
        wlp.enable = json.enable;
        wlp.paralaxOffset = json.paralaxOffset;

        wlp.depth = json.hasOwnProperty("depth") ? json.depth : false;
        wlp.alpha = json.hasOwnProperty("alpha") ? json.alpha : 1;

        wlp.allowUserControl = json.hasOwnProperty("allowUserControl") ? json.allowUserControl : false;
        wlp.visibleArea.fadeAngle = json.hasOwnProperty("fadeAngle") ? json.fadeAngle : 0.3;
        wlp.visibleArea.visibleXArea = json.hasOwnProperty("visibleXArea") ? Vector.parse(json.visibleXArea) : new Vector(-1, 1);
        wlp.visibleArea.visibleYArea = json.hasOwnProperty("visibleYArea") ? Vector.parse(json.visibleYArea) : new Vector(-1, 1);


        wlp.initParticle();
        wlp.wallpaper.size.x = json.width;
        wlp.wallpaper.size.y = json.height;

        wallpaperTexture.setLoadedCallback(function() {
            wlp.init();
        });
        wlp.setSize(globals.width, globals.height);
        return wlp;
    }
    toJson() {
        var v = {
            "title": this.title,
            "type": WallpaperLayer.type,
            "width": this.wallpaper.size.x,
            "height": this.wallpaper.size.y,
            "depth": this.depth,
            "allowUserControl": this.allowUserControl,
            "alpha": this.alpha,
            "enable": this.enable,
            "position": this.wallpaper.position.toJson(),
            "paralaxOffset": this.paralaxOffset,
            "visibleXArea": this.visibleArea.visibleXArea.toJson(),
            "visibleYArea": this.visibleArea.visibleYArea.toJson(),
            "fadeAngle": this.visibleArea.fadeAngle,
            "texture": this.texture.toJson()
        }
        return v;
    }
    constructor(texture, position) {
        super()
        WallpaperLayer.count++;
        this.title = "image " + WallpaperLayer.count;
        this.texture = texture;
        this.position = position;
    }

    showArea() {
        this.drawArea = true;
    }
    hideArea() {
        this.drawArea = false;
    }


    clone() {
        var texture = this.texture.clone();
        var v = new WallpaperLayer(texture, this.position.clone())
        v.paralaxOffset = this.paralaxOffset;
        v.alpha = this.alpha;
        v.depth = this.depth;
        v.initParticle();
        texture.onImageLoadedCallback = function() {
            v.init();
        }
        v.setSize(this.w, this.h)

        v.wallpaper.size.x = this.wallpaper.size.x
        v.wallpaper.size.y = this.wallpaper.size.y
        v.visibleArea = this.visibleArea.clone();
        return v;
    }
    initParticle() {
        this.wallpaper = new Particle(0);
        this.wallpaper.position = this.position.clone();
        var width = 100;
        var height = 100;
        if (this.texture != null && this.texture.isLoaded)
            height = (width * (this.texture.height / this.texture.width));
        this.wallpaper.setHeight(height);
        this.wallpaper.setWidth(width);
        this.wallpaper.depth = this.depth;
        this.wallpaper.setInvincible(true);
        this.wallpaper.paralaxOffset = this.paralaxOffset;
    }
    init() {
        super.init();
        this.wallpaper.setTexture(this.texture);
        if (this.selectWhenInited)
            this.select();
        this.selectWhenInited = false;
        this.inited = true;
    }

    update() {
        super.update();
    }

    drawFrame(ctx) {
        super.drawFrame(ctx);
        if (!this.enable)
            return;
        if (this.wallpaper != null) {
            this.updateAngleAlpha();
            this.wallpaper.alpha.x = this.alpha * this.wallpaper.alpha.x
            this.wallpaper.draw(ctx, this.w, this.h, this.time.getDeltaTime());
        }

    }
    updateAngleAlpha() {
        var alpha = 1;
        if (parallaxManager.xProgress < this.visibleArea.visibleXArea.x) {
            var diff = this.visibleArea.visibleXArea.x - parallaxManager.xProgress
            if (diff < this.visibleArea.fadeAngle) {
                alpha = 1 - (diff / this.visibleArea.fadeAngle);
            } else {
                alpha = 0;
            }
        } else if (parallaxManager.xProgress > this.visibleArea.visibleXArea.y) {
            var diff = parallaxManager.xProgress - this.visibleArea.visibleXArea.y
            if (diff < this.visibleArea.fadeAngle) {
                alpha = 1 - (diff / this.visibleArea.fadeAngle);
            } else {
                alpha = 0;
            }
        } else {
            alpha = 1;
        }
        var alpha2 = 1;
        if (parallaxManager.yProgress < this.visibleArea.visibleYArea.x) {
            var diff = this.visibleArea.visibleYArea.x - parallaxManager.yProgress
            if (diff < this.visibleArea.fadeAngle) {
                alpha2 = 1 - (diff / this.visibleArea.fadeAngle);
            } else {
                alpha2 = 0;
            }
        } else if (parallaxManager.yProgress > this.visibleArea.visibleYArea.y) {
            var diff = parallaxManager.yProgress - this.visibleArea.visibleYArea.y
            if (diff < this.visibleArea.fadeAngle) {
                alpha2 = 1 - (diff / this.visibleArea.fadeAngle);
            } else {
                alpha2 = 0;
            }
        } else {
            alpha2 = 1;
        }


        this.wallpaper.alpha.x = alpha < alpha2 ? alpha : alpha2

    }
    DrawArea(ctx) {
        if (this.drawArea) {
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "red";
            ctx.rect(this.wallpaper.getX(this.w), this.wallpaper.getY(this.w), this.wallpaper.getWidth(this.w), this.wallpaper.getHeight(this.w));
            ctx.stroke();
        }
    }

    getObjectsCount() {
        return super.getObjectsCount();
    }
    static createDefaultLayer(img = "images/wallpaper.png", texture) {
        var wallpaperTexture;
        if (texture != null && texture != undefined)
            wallpaperTexture = texture
        else
            wallpaperTexture = new UTexture(img);
        var wlp = new WallpaperLayer(wallpaperTexture, new Vector(50, 50))
        wlp.initParticle();
        if (wallpaperTexture.isLoaded)
            wlp.init();
        else {
            wallpaperTexture.setLoadedCallback(function() {
                wlp.init();
            });
        }
        wlp.setSize(globals.width, globals.height);
        return wlp;
    }
    setSize(width, height) {
        this.w = width;
        this.h = height;
        //this.updateWallpaperSize();

    }
    updateWallpaperSize() {
        /* if (this.wallpaper != null) {
             this.wallpaper.size.x = w;
             this.wallpaper.size.y = h;
         }*/
    }
    deselect() {
        this.htmlElement.find(".layerChild").removeClass("selectedLayer")
    }
    select() {
        if (MainController.selectedLayer != null) {
            MainController.selectedLayer.deselect()
        }
        MainController.selectedLayer = this;
        this.htmlElement.find(".layerChild").addClass("selectedLayer")
        PropertiesController.showControllsForLayer(this)
    }
    valueChanged(pref, value) {
        var parentObj = this;
        if (pref == "position") {
            this.wallpaper.position.x = value[0];
            this.wallpaper.position.y = value[1];
        } else if (pref == "paralax") {
            this.paralaxOffset = value;
            this.wallpaper.paralaxOffset = value;
        } else if (pref == "size") {
            this.wallpaper.size.x = value[0];
            this.wallpaper.size.y = value[1];
        } else if (pref == "depth") {
            this.depth = value;
            this.wallpaper.depth = value;
        } else if (pref == "name") {
            this.updateTitle(value)
        } else if (pref == "allowUserControl") {
            this.allowUserControl = value;
        } else if (pref == "fadeAnglePref") {
            this.fadeAngle = value
        } else if (pref == "alphaPref") {
            this.alpha = value / 100
        } else if (pref == "VisibleXAngle") {
            this.visibleArea.visibleXArea.x = value[0];
            this.visibleArea.visibleXArea.y = value[1];
        } else if (pref == "VisibleYAngle") {
            this.visibleArea.visibleYArea.x = value[0];
            this.visibleArea.visibleYArea.y = value[1];
        } else if (pref == "image") {
            var img = new UTexture(value[0], "", function() {
                parentObj.changeTexture(img);
            }, value[1]);
        }

    }
    changeTexture(img) {
        var position = this.wallpaper.position.clone();
        this.texture = img
        this.init();
        this.wallpaper.position = position;
    }
    getValueControllType(pref) {
        if (pref == "name") {
            return "text"
        } else if (pref == "position") {
            return "number2"
        } else if (pref == "size") {
            return "number2"
        } else if (pref == "image") {
            return "image"
        }
    }
    getControllCssClass() {
        return ["layerPropPanel", "Layer Properties", "images/global-settings.png"];
    }
    getControllsData() {
        var data = new Array();
        var namePref = { pref: "name", title: "name", value: this.title, controllType: this.getValueControllType("name"), range: 50 };
        var allowUserControlPref = { pref: "allowUserControl", title: "Allow User Control", value: this.allowUserControl, controllType: "boolean", range: 0 };
        var paralaxPref = { pref: "paralax", title: "paralax offset", value: this.paralaxOffset, controllType: "slider", range: [-100, 100] };
        var alphaPref = { pref: "alphaPref", title: "alpha", value: this.alpha * 100, controllType: "slider", range: [0, 100] };
        var depthPref = { pref: "depth", title: "Paralax depth", value: this.depth, controllType: "boolean", range: [] };
        var imgPref = { pref: "image", title: "image source", value: this.texture.src, controllType: this.getValueControllType("image"), range: 50 };
        var sizePref = { pref: "size", title: ["size", "width", "height"], value: [this.wallpaper.size.x, this.wallpaper.size.y], controllType: this.getValueControllType("size"), range: [0, 300] };
        var positionPref = { pref: "position", title: ["position", "left", "top"], value: [this.wallpaper.position.x, this.wallpaper.position.y], controllType: this.getValueControllType("position"), range: [-300, 300] };

        data.push(namePref);
        data.push(allowUserControlPref);
        data.push(paralaxPref);
        data.push(depthPref);
        data.push(alphaPref);
        data.push(imgPref);
        data.push(sizePref);

        data.push(positionPref);

        return data;
    }
    getObjectsToControll() {
        return [this.visibleArea];
    }
    drag(x, y) {
        x = x / globals.width * 100
        y = y / globals.width * 100
        this.wallpaper.position.x += x;
        this.wallpaper.position.y += y;
    }
    getImagesIds() {
        return [this.texture.id];
    }
}