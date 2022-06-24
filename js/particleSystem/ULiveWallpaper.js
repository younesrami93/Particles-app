class ULiveWallpaper {
    w = 0;
    h = 0;
    title = "Untitled";
    id = null;
    layers = new Array();

    setSize(w, h) {
        this.w = w;
        this.h = h;
    }

    removeLayer(layer) {
        if (this.layers.length <= 1)
            return false;
        else {
            var i = this.layers.indexOf(layer);
            this.layers.splice(i, 1)
            if (this.layers.length > i) {
                this.layers[i].select();
            } else {
                this.layers[i - 1].select();
            }
            layer.remove();
            return true;
        }
    }
    moveLayerUp(layer) {
        var i = this.layers.indexOf(layer);
        if (i > 0) {
            var l1 = this.layers[i - 1];
            this.layers[i - 1] = layer;
            this.layers[i] = l1;
            layer.htmlElement.insertBefore(l1.htmlElement)
        }
    }
    moveLayerDown(layer) {
        var i = this.layers.indexOf(layer);
        if (i < this.layers.length - 1) {
            var l1 = this.layers[i + 1];
            this.layers[i + 1] = layer;
            this.layers[i] = l1;
            layer.htmlElement.insertAfter(l1.htmlElement)
        }
    }
    duplicateLayer(layer) {
        var newLayer = layer.clone();
        var i = this.layers.indexOf(layer);
        this.addLayer(newLayer)
        layersController.addLayerLayout(newLayer, true);
    }
    updateViewPort(width, height) {
        for (let i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            layer.setSize(width, height)

        }
    }
    toJson() {

        var json = {
            "width": this.w,
            "height": this.h,
            "parallaxStrength": parallaxManager.strength,
            "paralaxSmoothness": parallaxManager.deltaTime,
            "resetSmoothness": parallaxManager.resetSmoothness,
            "allwaysReset": parallaxManager.allwaysReset,
            "layers": this.layersJson()
        }
        console.log(json);
        return json;
    }
    getImagesIds() {
        var images = [];
        for (let i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            var layerImages = layer.getImagesIds();
            images = images.concat(layerImages)
        }
        var imagesText = "";
        for (let i = 0; i < images.length; i++) {
            if (i > 0)
                imagesText = imagesText + ",";
            imagesText = imagesText + parseInt(images[i]);
        }

        return imagesText;
    }

    static parse(json) {
        var wlp = new ULiveWallpaper();
        wlp.id = json.id;
        wlp.title = json.title;
        if (json.json.length > 3) {
            var wlpJs = JSON.parse(json.json)
            wlp.w = json.width;
            wlp.h = json.height;

            if(wlpJs.hasOwnProperty("parallaxStrength"))
            {
                parallaxManager.strength = wlpJs.parallaxStrength;
                parallaxManager.deltaTime = wlpJs.paralaxSmoothness;
                parallaxManager.resetSmoothness = wlpJs.resetSmoothness;
                parallaxManager.allwaysReset = wlpJs.allwaysReset;

                var stregthSliderValue = parallaxManager.strength * 50;
                $(".parallaxResetCheckbox").prop("checked",parallaxManager.allwaysReset);
                $(".paralaxStrength .sliderControl").slider('value',stregthSliderValue);
                $(".paralaxStrength .slideValue").text(stregthSliderValue/10)

                
                var smoothVal =  100 - (parallaxManager.deltaTime * 100) 
                $(".paralaxSmooth .sliderControl").slider('value',smoothVal);
                $(".paralaxSmooth .slideValue").text(smoothVal)


                $(".paralaxReset .sliderControl").slider('value',parallaxManager.resetSmoothness);
                $(".paralaxReset .slideValue").text(parallaxManager.resetSmoothness)

            }

            if (wlpJs.layers.length > 0)
                wlp.parseLayers(wlpJs.layers);
        }
        return wlp;
    }
    parseLayers(jsonLayers) {
        for (let i = 0; i < jsonLayers.length; i++) {
            var item = jsonLayers[i];
            if (item.type == ParticleSystem.type) {
                this.layers.push(ParticleSystem.parse(item));
            } else if (item.type == WallpaperLayer.type) {
                this.layers.push(WallpaperLayer.parse(item));
            } else {
                alert(item.type + " not recognized")
            }
        }
    }
    layersJson() {
        var json = new Array();
        for (let i = 0; i < this.layers.length; i++) {
            var item = this.layers[i];
            json.push(item.toJson())
        }
        return json;
    }
    init() {

        /*var ps = new ParticleSystem();
        ps.setSize(this.w, this.h);
        var bs = new BaseComponant(ps);

        var spawner = new PointSpawner(ps, 300, 3, new Vector(50, ps.convertHeightToPercentage(50)));
        ps.setSpawner(spawner);

        var sizeSpeed = VectorRange.createVectoreRange(new Vector(100, 100, 0), new Vector(-100, -100, 0));
        ps.addComponnant(new PropertyChanger(ps, Particle.Prop.VELOCITY, sizeSpeed).setTiming(0, 100));*/

        /*var wallpaperTexture = new UTexture("images/wallpaper.png");

        var wlp = new WallpaperLayer(wallpaperTexture, new Vector(50, 50))
        wlp.setSize(this.w, this.h);

        this.layers.push(wlp);

        wallpaperTexture.onImageLoadedCallback = function() {
            wlp.init();
        }
        ps.init();
        this.addLayer(ps);

        */


    }
    addLayer(layer, select, showHtml) {
        this.layers.push(layer);
        if (showHtml) {
            layersController.addLayerLayout(layer);
        }
        if (select) {
            if (layer.inited)
                layer.select();
            else
                layer.selectWhenInited = true;
        }

    }
    getObjectsCount() {
        var count = 0;
        for (let i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            count += layer.getObjectsCount();
        }
        return count;
    }

    drawFrame(ctx) {
        for (let i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            layer.drawFrame(ctx);
        }
        for (let i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            layer.DrawArea(ctx);
        }
    }
}