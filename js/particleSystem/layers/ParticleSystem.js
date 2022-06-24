class ParticleSystem extends BaseLayer {
    static count = 0;
    startDelay = 0;
    delayBetweenShots = 1;
    spawnType = "time"
    started = false;
    age = 0; // calculate in ms
    images;
    particles = new Array();
    spawner; // BaseSpawner
    componants = new Array();
    initialValues;
    layerComponantsHtml;
    paralaxOffset = new Range();
    depth = false
    drawArea = false;
    alpha = 1;
    finalAlpha = 1; // after calculating angle

    preSpawnTime = 0;
    
    showArea() {
        this.drawArea = true;
    }
    hideArea() {
        this.drawArea = false;
    }
    static type = "particleSystem"
    type = "particleSystem"

    static parse(json) {
        var ps = new ParticleSystem();
        ps.title = json.title;
        ps.depth = json.hasOwnProperty("depth") ? json.depth : false;
        ps.preSpawnTime = json.hasOwnProperty("preSpawnTime") ? json.preSpawnTime : 0;
        ps.startDelay = json.hasOwnProperty("startDelay") ? json.startDelay : 0;
        ps.spawnType = json.hasOwnProperty("spawnType") ? json.spawnType : "time";
        ps.enable = json.enable;
        ps.allowUserControl = json.hasOwnProperty("allowUserControl") ? json.allowUserControl : false;
        ps.alpha = json.hasOwnProperty("alpha") ? json.alpha : 1;


        ps.visibleArea.fadeAngle = json.hasOwnProperty("fadeAngle") ? json.fadeAngle : 0.3;
        ps.visibleArea.visibleXArea = json.hasOwnProperty("visibleXArea") ? Vector.parse(json.visibleXArea) : new Vector(-1, 1);
        ps.visibleArea.visibleYArea = json.hasOwnProperty("visibleYArea") ? Vector.parse(json.visibleYArea) : new Vector(-1, 1);


        ps.initialValues = ParticleInitValues.parse(json.initialValues);
        ps.paralaxOffset = !isNaN(json.paralaxOffset) ? new Range(json.paralaxOffset, json.paralaxOffset) : Range.parse(json.paralaxOffset);
        console.log(ps.paralaxOffset)
        var images = imageCollection.parse(json.images, function() {
            ps.init();
        });
        ps.setImages(images);
        ps.setSize(globals.width, globals.height);
        var spawner;
        spawner = BaseSpawner.parse(json.spawner, ps);

        ps.setSpawner(spawner);
        for (let i = 0; i < json.componants.length; i++) {
            var item = json.componants[i];
            ps.addComponnant(BaseComponant.parse(item, ps));
        }
        return ps;
    }
    toJson() {
        var v = {
            "type": ParticleSystem.type,
            "width": this.w,
            "height": this.h,
            "depth": this.depth,
            "preSpawnTime": this.preSpawnTime,
            "startDelay": this.startDelay,
            "title": this.title,
            "alpha": this.alpha,
            "enable": this.enable,
            "spawnType": this.spawnType,
            "allowUserControl": this.allowUserControl,
            "spawner": this.spawner.toJson(),
            "initialValues": this.initialValues.toJson(),
            "images": this.images.toJson(),
            "componants": this.componantsJson(),
            "visibleXArea": this.visibleArea.visibleXArea.toJson(),
            "visibleYArea": this.visibleArea.visibleYArea.toJson(),
            "fadeAngle": this.visibleArea.fadeAngle,
            "paralaxOffset": this.paralaxOffset.toJson()
        }
        return v;
    }
    componantsJson() {
        var json = new Array();
        for (let i = 0; i < this.componants.length; i++) {
            var item = this.componants[i];
            json.push(item.toJson())
        }
        return json;
    }

    static createDefaultLayer() {
        var ps = new ParticleSystem();
        var initSize = VectorRange.createVectoreRange(new Vector(5, 5), new Vector(5, 5));
        var initSpeed = VectorRange.createVectoreRange(new Vector(0, 5), new Vector(0, -15));
        var initVelocity = VectorRange.createVectoreRange(new Vector(0, 5), new Vector(0, 10));
        ps.initialValues = new ParticleInitValues(initSize, initSpeed, initVelocity);
        var imgArray = new Array(["images/prt1.png", 32], ["images/prt2.png", 33]);
        var images = new imageCollection(imgArray, "lighter", function() {
            ps.init();
        });
        ps.setImages(images);
        ps.setSize(globals.width, globals.height);
        var spawner = new CircleSpawner(ps, 300, 3, new Vector(0, ps.convertHeightToPercentage(0)), 100, false);
        ps.setSpawner(spawner);
        ps.spawnType = "time"
        return ps;
    }
    getRandomImg() {
        //return this.bitmaps.list[1];
        return this.images.getRandom();
    }
    addImage(img) {
       return this.images.addImageWhenLoaded(img)
    }

    removeImage(img) {
        if (this.images.list.length > 1) {
            this.images.remove(img);
            return true;
        } else {
            alert("this list cant be empty")
            return false;
        }
    }
    setSpawner(spawner) {
        this.spawner = spawner;
    }

    getSpawner() {
        return this.spawner;
    }
    changeSpawner(spawner) {
        this.particles = new Array();
       // spawner.position = this.spawner.position.clone();
        this.spawner = spawner;
        PropertiesController.showControlls(spawner, true)
    }

    constructor() {
        super();
        ParticleSystem.count++;
        this.title = "particle system " + ParticleSystem.count;
    }
    setImages(images) {
        this.images = images;
    }

    addComponnant(componant) {
        this.componants.push(componant);
    }

    createComponant(obj, title) {
        if (obj.hasOwnProperty("isCustom")) {
            var componant = CustomPropertyChanger.createDefault(this, obj.property);
            componant.name = title;
            this.componants.push(componant);
            return componant;
        } else {
            var speed = VectorRange.createVectoreRange(new Vector(obj.speed[0][0], obj.speed[0][1], 0), new Vector(obj.speed[1][0], obj.speed[1][1], 0));

            var componant = new PropertyChanger(this, obj.property, speed);
            componant.setTiming(obj.timing[0], obj.timing[1])
            componant.name = title;
            this.componants.push(componant);
            return componant;
        }
    }
    loadImage(src, filter = "") {
        var img = new UTexture(src, filter);
        return img
    }
    init() {
        if (this.selectWhenInited)
            this.select();
        this.selectWhenInited = false;
        this.inited = true;
    }


    preSpawn()
    {
        var currentTime = 0;
        var deltaTime = 0.017;
        while(currentTime < this.preSpawnTime)
        {
            console.log("currentTime "+currentTime+" "+this.particles.length)
            currentTime += deltaTime;
            this.age += deltaTime;
            this.preUpdateParticles(deltaTime);

            for (var i = 0; i < this.particles.length; i++) {
                var p = this.particles[i];
                if(i == 0)
                {
                    console.log("particle life "+p.getAge()+" "+p.lifeSpanMs)
                }
                for (var j = 0; j < this.componants.length; j++) {
                    var c = this.componants[j];
                    if (c.oneByOneUpdate)
                        c.particleUpdate(p, deltaTime);
                }
                p.update(deltaTime);
                if (!p.draw(null, this.w, this.h, deltaTime,this.finalAlpha)) {
                    this.particles.splice(i, 1);
                    i--;
                    this.spawner.particleDestroyed(p);
                }
            }

            
            if (this.spawner != null && this.spawnType == "time")
            {
                this.spawner.timer.DeltaTime = 0.017;
                this.spawner.update();
            }

            this.lateUpdateParticles(60);
        }
    }
    preUpdateParticles(deltaTime)
    {
        for (var i = 0; i < this.componants.length; i++) {
            var c = this.componants[i];
            if (!c.oneByOneUpdate)
                c.onUpdate(deltaTime);
        }
    }
    drawFrame(ctx) {
        this.time.update();
        this.age += this.time.getDeltaTime();

        if (!this.enable)
            return;


        if (!this.started) {
            console.log("startDelay " + this.startDelay + "  " + this.started + "   " + this.age);
            if (this.startDelay == 0) {
                this.started = true;
                this.age = 0;
            } else if (this.age > this.startDelay) {
                this.started = true;
                this.age = 0;
            }
            this.preSpawn()

        }

        if (!this.started)
            return;

        this.preUpdateParticles(this.time.getDeltaTime());

        this.updateAngleAlpha();

        for (var i = 0; i < this.particles.length; i++) {
            var p = this.particles[i];

            for (var j = 0; j < this.componants.length; j++) {
                var c = this.componants[j];
                if (c.oneByOneUpdate)
                    c.particleUpdate(p, this.time.getDeltaTime());
            }
            p.update(this.time.getDeltaTime());
            if (!p.draw(ctx, this.w, this.h, this.time.getDeltaTime(),this.finalAlpha)) {
                this.particles.splice(i, 1);
                i--;
                this.spawner.particleDestroyed(p);
            }
        }

        this.lateUpdateParticles(this.time.getDeltaTime())

        if (this.spawner != null && this.spawnType == "time")
            this.spawner.update();
    }
    lateUpdateParticles()
    {
        for (var i = 0; i < this.componants.length; i++) {
            var c = this.componants[i];
            c.onLateUpdate(this.time.getDeltaTime());
        }
    }

    DrawArea(ctx) {
        if (this.drawArea) {
            this.spawner.drawArea(ctx);
        }
    }

    addParticle(e) {
        this.particles.push(e);
    }

    getObjectsCount() {
        return this.particles.length;
    }
    getControllCssClass() {
        return ["layerPropPanel", "Layer Properties", "images/option.png"];
    }
    deselect() {
        this.htmlElement.find(".layerChild").removeClass("selectedLayer")
        this.htmlElement.find(".layerComponants").hide();
    }
    select() {
        if (MainController.selectedLayer != null) {
            MainController.selectedLayer.deselect()
        }
        this.htmlElement.find(".layerComponants").show();
        MainController.selectedLayer = this;
        this.htmlElement.find(".layerChild").addClass("selectedLayer")
        PropertiesController.showControllsForLayer(this)
    }

    getValueControllType(pref) {
        if (pref == "name") {
            return "text"
        } else if (pref == "images") {
            return "images"
        } else if (pref == "filter") {
            return "options"
        }
    }

    valueChanged(pref, value) {
        if (pref == "name") {
            this.updateTitle(value)
        } else if (pref == "paralax") {
            this.paralaxOffset.min = value[0];
            this.paralaxOffset.max = value[1];
            /*for (let i = 0; i < this.particles.length; i++) {
                const e = this.particles[i];
                e.paralaxOffset = this.paralaxOffset
            }*/
        } else if (pref == "size") {
            this.wallpaper.size.x = value[0];
            this.wallpaper.size.y = value[1];
        } else if (pref == "filter") {
            this.images.setFilter(value);
        } else if (pref == "startDelay") {
            this.startDelay = value;
        } else if (pref == "allowUserControl") {
            this.allowUserControl = value;
        } else if (pref == "VisibleXAngle") {
            this.visibleArea.visibleXArea.x = value[0];
            this.visibleArea.visibleXArea.y = value[1];
        } else if (pref == "VisibleYAngle") {
            this.visibleArea.visibleYArea.x = value[0];
            this.visibleArea.visibleYArea.y = value[1];
        } else if (pref == "alphaPref") {
            this.alpha = value / 100
        } else if (pref == "spawnType") {
            this.spawnType = value;
        } else if (pref == "preSpawnTime") {
            this.preSpawnTime = value;
        } else if (pref == "depth") {
            this.depth = value;
            for (let i = 0; i < this.particles.length; i++) {
                const e = this.particles[i];
                e.depth = this.depth
            }
        }
    }

    removeComponant(cp) {
        for (let i = 0; i < this.componants.length; i++) {
            var item = this.componants[i];
            if (item == cp) {
                this.componants.splice(i, 1);
            }
        }
    }
    getControllsData() {
        var data = new Array();
        var namePref = { pref: "name", title: "name", value: this.title, controllType: this.getValueControllType("name"), range: 50 };
        var allowUserControlPref = { pref: "allowUserControl", title: "Allow User Control", value: this.allowUserControl, controllType: "boolean", range: 0 };
        var preSpawnTimePref = { pref: "preSpawnTime", title: "Pre Spawn Time", value: this.preSpawnTime, controllType: "number", range: [0,100000] };
        var startDelayPref = { pref: "startDelay", title: "start delay", value: this.startDelay, controllType: "number", range: 1000000 };
        var alphaPref = { pref: "alphaPref", title: "alpha", value: this.alpha * 100, controllType: "slider", range: [0, 100] };
        var filterPref = { pref: "filter", title: "particles filter", value: this.images.filter, controllType: this.getValueControllType("filter"), range: ["normal", "lighter", "multiply", "color", "exclusion", "hard-light"] };
        var paralaxPref = { pref: "paralax", title: "paralax offset", value: [this.paralaxOffset.min, this.paralaxOffset.max], controllType: "slider2", range: [-100, 100] };
        var depthPref = { pref: "depth", title: "Paralax depth", value: this.depth, controllType: "boolean", range: [] };
        var imagesPref = { pref: "images", title: "particles", value: this.images.list, controllType: this.getValueControllType("images"), range: 0 };
        var spawnTypePref = { pref: "spawnType", title: "Spawn Type", value: this.spawnType, controllType: "options", range: ["time", "touch"] };
        data.push(namePref);
        data.push(imagesPref);
        data.push(allowUserControlPref);
        data.push(preSpawnTimePref);
        data.push(spawnTypePref);
        data.push(paralaxPref);
        data.push(alphaPref);
        data.push(depthPref);
        data.push(startDelayPref);
        data.push(filterPref);
        return data;
    }

    getObjectsToControll() {
        var data = [this.initialValues, this.spawner,this.visibleArea];
        return data;
    }

    drag(xDrag, yDrag, xpos, ypos) {
        xDrag = xDrag / globals.width * 100
        yDrag = yDrag / globals.width * 100

        //console.log(xpos + "  " + ypos)

        if (this.spawnType == "touch") {
            this.spawner.update(xpos / (globals.width / 100), ypos / (globals.height / 200));
        } else {
            this.spawner.drag(xDrag, yDrag)
        }

    }

    clone() {
        var newLayer = new ParticleSystem();
        newLayer.images = this.images.clone(function() {
            newLayer.init();
        });
        newLayer.setSize(this.w, this.h)
        newLayer.spawner = this.spawner.clone(newLayer);
        newLayer.spawnType = this.spawnType;
        newLayer.preSpawnTime = this.preSpawnTime;
        newLayer.initialValues = this.initialValues.clone();
        newLayer.componants = new Array();
        for (let i = 0; i < this.componants.length; i++) {
            var item = this.componants[i];
            newLayer.componants.push(item.clone(newLayer))
        }
        newLayer.alpha = this.alpha;
        newLayer.enable = true;
        newLayer.startDelay = this.startDelay;
        newLayer.delayBetweenShots = this.delayBetweenShots;
        newLayer.paralaxOffset = this.paralaxOffset.clone();
        newLayer.visibleArea = this.visibleArea.clone();
        return newLayer;
    }
    getImagesIds() {
        return this.images.getImagesIds();
    }


    
    updateAngleAlpha() {
        var a1 = 1;
        if (parallaxManager.xProgress < this.visibleArea.visibleXArea.x) {
            var diff = this.visibleArea.visibleXArea.x - parallaxManager.xProgress
            if (diff < this.visibleArea.fadeAngle) {
                a1 = 1 - (diff / this.visibleArea.fadeAngle);
            } else {
                a1 = 0;
            }
        } else if (parallaxManager.xProgress > this.visibleArea.visibleXArea.y) {
            var diff = parallaxManager.xProgress - this.visibleArea.visibleXArea.y
            if (diff < this.visibleArea.fadeAngle) {
                a1 = 1 - (diff / this.visibleArea.fadeAngle);
            } else {
                a1 = 0;
            }
        } else {
            a1 = 1;
        }
        var a2 = 1;
        if (parallaxManager.yProgress < this.visibleArea.visibleYArea.x) {
            var diff = this.visibleArea.visibleYArea.x - parallaxManager.yProgress
            if (diff < this.visibleArea.fadeAngle) {
                a2 = 1 - (diff / this.visibleArea.fadeAngle);
            } else {
                a2 = 0;
            }
        } else if (parallaxManager.yProgress > this.visibleArea.visibleYArea.y) {
            var diff = parallaxManager.yProgress - this.visibleArea.visibleYArea.y
            if (diff < this.visibleArea.fadeAngle) {
                a2 = 1 - (diff / this.visibleArea.fadeAngle);
            } else {
                a2 = 0;
            }
        } else {
            a2 = 1;
        }


        a1 = a1 < a2 ? a1 : a2

        this.finalAlpha = a1 * this.alpha;
    }
}