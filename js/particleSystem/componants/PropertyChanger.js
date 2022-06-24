class PropertyChanger extends BaseComponant {
    speed;
    name;
    property;
    static type = "componant";
    type = "componant";
    workingTimeSpan; // Range : age span of the particles to accept updates from this object
    htmlElement;
    setTiming(startTime, finishTime) {
        this.workingTimeSpan = new Range(Math.min(startTime, finishTime), Math.max(startTime, finishTime));
        return this;
    }

    static createDefault(ps) {
        var speed = VectorRange.createVectoreRange(new Vector(0, 0, 0), new Vector(0, 0, 0));
        var velocChanger = new PropertyChanger(ps, Particle.Prop.VELOCITY, speed);
        velocChanger.setTiming(0, 100)
        return velocChanger
    }

    constructor(particleSystem, property, speed) {
        super(particleSystem);
        this.speed = speed;
        this.property = property;
        this.name = "new behavior";
    }

    delete() {
        this.particleSystem.select()
        this.particleSystem.removeComponant(this);
        this.htmlElement.remove();
    }
    onStart() {}

    onUpdate(deltaTime) {
        for (var i = 0; i < this.particleSystem.particles.length; i++) {
            this.particleUpdate(this.particleSystem.particles[i], deltaTime);
        }
    }

    onLateUpdate(DeltaTime) {

    }

    particleUpdate(particle, deltaTime) {
        if (this.workingTimeSpan == null)
            particle.getProperty(this.property).add(this.speed.getRandom(), deltaTime);
        else if (particle.inTimeSpan(this.workingTimeSpan.min, this.workingTimeSpan.max)) {
            if(this.property == Particle.Prop.DIRECTION)
            {
                var extraRotation = this.speed.min.x;
                particle.rotation.x = extraRotation + this.radians_to_degrees(Math.atan2(particle.speed.y , particle.speed.x));
            }
            else if(this.property == Particle.Prop.MOVE_DIRECTION)
            {
                var extraRotation = this.speed.min.y;
                particle.speed.y = (Math.sin(this.degrees_to_radians(particle.rotation.x+extraRotation)) * this.speed.min.x);
                particle.speed.x = (Math.cos(this.degrees_to_radians(particle.rotation.x+extraRotation)) * this.speed.min.x);
                //particle.rotation.x = this.speed.min.x + this.radians_to_degrees(Math.atan2(particle.speed.y , particle.speed.x));
            }
            else{
                if (this.property == Particle.Prop.ROTATION)
                {
                    particle.getProperty(this.property).add(this.speed.getRandom_useXY(), deltaTime);    
                }
                else{
                    particle.getProperty(this.property).add(this.speed.getRandom(), deltaTime);
                }
            }
        }
    }

    radians_to_degrees(radians)
    {
        var pi = Math.PI;
        return radians * (180/pi);
    }

    degrees_to_radians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    }

    getControllType() {
        if ([Particle.Prop.ALPHA, Particle.Prop.ROTATION, Particle.Prop.MOVE_DIRECTION].includes(this.property)) {
            return "number2";
        } 
        else if (this.property == Particle.Prop.DIRECTION)
        {
            return "number";
        }
         else {
            return "number4";
        }
    }
    getSpeedTitles() {
        if ([Particle.Prop.ALPHA, Particle.Prop.ROTATION].includes(this.property)) {
            return ["speed", "min", "max"];
        }
        else if( this.property == Particle.Prop.DIRECTION)
        {
            return "Extra Rotation";
        } 
        else if( this.property == Particle.Prop.MOVE_DIRECTION)
        { 
            return ["Values","Speed","Extra Rotation"];
        }
        else {
            return ["speed", "min : x", "y", "max: x", "y"];
        }
    }
    getControllsData() {
        console.log(this);
        var data = new Array();
        var namePref = { pref: "name", title: "name", value: this.name, controllType: "text", range: "" };
        var propertyPref = { pref: "property", title: "property", value: this.property, controllType: "options", range: Particle.getPropertiesList() };
        var typePref = { pref: "typePref", title: "Property", value: this.property, controllType: "info", range: [] };
        var timePref = { pref: "timespan", title: "timespan", value: [this.workingTimeSpan.min, this.workingTimeSpan.max], controllType: "slider2", range: [0, 100] };
        var speedPref = { pref: "speed", title: this.getSpeedTitles(), value: [this.speed.min.x, this.speed.min.y, this.speed.max.x, this.speed.max.y], controllType: this.getControllType(), range: [-1000, 1000] };
        if( this.property == Particle.Prop.DIRECTION)
        {
            speedPref = { pref: "speed", title: this.getSpeedTitles(), value: this.speed.min.x, controllType: this.getControllType(), range: [-2000, 2000] };
        }
        else if( this.property == Particle.Prop.MOVE_DIRECTION)
        {
            speedPref = { pref: "speed", title: this.getSpeedTitles(), value: [this.speed.min.x, this.speed.min.y], controllType: this.getControllType(), range: [-2000, 2000] };
        }
        
        data.push(typePref);
        data.push(namePref);
        // data.push(propertyPref);
        data.push(timePref);
        data.push(speedPref);
        return data;
    }

    valueChanged(pref, value) {
        console.log(value);
        if (pref == "speed") {
            if ([Particle.Prop.ALPHA, Particle.Prop.ROTATION, Particle.Prop.MOVE_DIRECTION].includes(this.property)) {
                this.speed.min.x = value[0];
                this.speed.min.y = value[1];
                this.speed.max.x = value[0];
                this.speed.max.y = value[1];
            } else if (this.property == Particle.Prop.DIRECTION) {
                this.speed.min.x = value;
                this.speed.min.y = value;
                this.speed.max.x = value;
                this.speed.max.y = value;
            }
            else {
                this.speed.min.x = value[0];
                this.speed.min.y = value[1];
                this.speed.max.x = value[2];
                this.speed.max.y = value[3];
            }
            this.speed.min.log()
            this.speed.max.log()
        } else if (pref == "timespan") {
            this.workingTimeSpan.min = value[0];
            this.workingTimeSpan.max = value[1];
        } else if (pref == "name") {
            this.name = value;
            this.updateName();
        } else if (pref == "property") {
            this.property = value;
            PropertiesController.showControlls(this, true);
        }
    }
    updateName() {
        this.htmlElement.find(".title").html(this.name)
    }
    deselect() {
        this.htmlElement.removeClass("selectedLayer")
        this.particleSystem.deselect()
    }
    select() {
        if (MainController.selectedLayer != null) {
            MainController.selectedLayer.deselect()
        }
        this.particleSystem.select();
        MainController.selectedLayer = this;
        this.htmlElement.addClass("selectedLayer")
        PropertiesController.showControllsForLayer(this)
    }
    getControllCssClass() {
        return ["componantsPanel", "Componants", "images/acceleration.png"];
    }
    getObjectsToControll() {
        return [];
    }

    clone(particleSystem) {
        var v = new PropertyChanger(particleSystem, this.property, this.speed.clone())
        v.workingTimeSpan = this.workingTimeSpan.clone();
        console.log("property duplicated "+this.property);
        v.name = this.name;
        v.oneByOneUpdate = this.oneByOneUpdate;
        return v;
    }
    toJson() {
        var v = {
            "speed": this.speed.toJson(),
            "property": this.property,
            "name": this.name,
            "type": PropertyChanger.type,
            "workingTimeSpan": this.workingTimeSpan.toJson()
        }
        return v
    }
    static parse(json, particleSystem) {
        var v = new PropertyChanger(particleSystem, json.property, VectorRange.parse(json.speed));
        v.workingTimeSpan = Range.parse(json.workingTimeSpan);
        v.name = json.hasOwnProperty("name") ? json.name : "componant";
        return v;
    }
}