class CustomPropertyChanger extends BaseComponant {
    values;
    name;
    property;
    static type = "customComponant";
    alterValue;
    type = "customComponant";
    workingTimeSpan; // Range : age span of the particles to accept updates from this object
    htmlElement;
    setTiming(startTime, finishTime) {
        this.workingTimeSpan = new Range(Math.min(startTime, finishTime), Math.max(startTime, finishTime));
        return this;
    }


    static createDefault(ps, property) {
        var values = [
            [0, [0, 0, 0]]
        ]
        if (property == undefined)
            property = Particle.Prop.SPEED
        var velocChanger = new CustomPropertyChanger(ps, property, values);
        velocChanger.setTiming(0, 100)
        return velocChanger
    }
    constructor(particleSystem, property, values) {
        super(particleSystem);
        this.values = values;
        this.property = property;
        this.name = "new custom behavior";
    }

    delete() {
        this.particleSystem.removeComponant(this);
        this.htmlElement.remove();
        graphManager.hide();
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
        if (this.workingTimeSpan == null) {
            this.applyUpdate(particle, deltaTime)
        } else if (particle.inTimeSpan(this.workingTimeSpan.min, this.workingTimeSpan.max)) {
            this.applyUpdate(particle, deltaTime)
        }
    }
    applyUpdate(particle, deltaTime) {
        /* for (let i = this.values.length - 1; i >= 0; i--) {
             var item = this.values[i];
             if (particle.getAge() > item[0]) {
                 particle.getProperty(this.property).x = item[1];
                 console.log("particle custom property applied " + particle.getAge() + "/" + item[1] + "/" + item[0]);
                 break;
             }
         }*/
        if (this.values == null || this.values.length == 0) {
            return;
        }

        if ([Particle.Prop.ALPHA, Particle.Prop.ROTATION].includes(this.property)) {
            particle.getProperty(this.property).x = this.getValue(particle, 0, 0);
        } else if (this.alterValue) {
            particle.getProperty(this.property).x = this.getValue(particle, 0, 0);
            particle.getProperty(this.property).y = this.getValue(particle, 1, 0);
        } else {
            var x = this.getValue(particle, 0, 0);
            var y = this.getValue(particle, 1, 0);

            var x2 = this.getValue(particle, 0, particle.AgeAtLastFrame - particle.Age);
            var y2 = this.getValue(particle, 1, particle.AgeAtLastFrame - particle.Age);

            particle.getProperty(this.property).x += x - x2;
            particle.getProperty(this.property).y += y - y2;
        }

    }
    getValue(particle, axess, ageExtra) {
        var pos = 0;

        if (this.values.length == 1) {
            return this.values[0][1][axess];
        }

        for (let i = this.values.length - 1; i >= 0; i--) {
            var item = this.values[i];
            if (particle.getAge() > item[0]) {
                pos = i;
                break;
            }
        }

        if (pos >= 0 && pos < this.values.length - 1) {
            var t1 = this.values[pos + 1][0] - this.values[pos][0]; // animation phase duration
            var t2 = particle.Age + ageExtra - this.values[pos][0];
            var progressTime = t2 / t1;
            var value = this.values[pos][1][axess] + (this.values[pos + 1][1][axess] - this.values[pos][1][axess]) * progressTime;
            return value;
        }

    }

    getControllType() {
        if ([Particle.Prop.ALPHA, Particle.Prop.ROTATION].includes(this.property)) {
            return "number2";
        } else {
            return "number4";
        }
    }
    getValuesTitles() {
        if (this.property == Particle.Prop.ALPHA) {
            return { title: "values", graphTitle: "Alpha", titles: [{ "title": "Alpha", "position": 0 }] };
        } else if (this.property == Particle.Prop.ROTATION) {
            return { title: "values", graphTitle: "Rotation", titles: [{ "title": "Rotation", "position": 0 }] };
        } else if (this.property == Particle.Prop.SPEED) {
            return { title: "values", graphTitle: "Speed", titles: [{ "title": "x", "position": 0 }, { "title": "y", "position": 1 }] };
        } else if (this.property == Particle.Prop.VELOCITY) {
            return { title: "values", graphTitle: "Velocity", titles: [{ "title": "x", "position": 0 }, { "title": "y", "position": 1 }] };
        } else if (this.property == Particle.Prop.POSITION) {
            return { title: "values", graphTitle: "Velocity", titles: [{ "title": "x", "position": 0 }, { "title": "y", "position": 1 }] };
        } else if (this.property == Particle.Prop.SIZE) {
            return { title: "values", graphTitle: "SIZE", titles: [{ "title": "width", "position": 0 }, { "title": "height", "position": 1 }] };
        }
    }
    getRangeValue() {
        if (this.property == Particle.Prop.ALPHA)
            return [0, 1]
        else if (this.property == Particle.Prop.ROTATION)
            return [-1000, 1000]
        else if (this.property == Particle.Prop.POSITION)
            return [-5000, 5000]
        else if (this.property == Particle.Prop.SPEED)
            return [-10000, 10000]
        else if (this.property == Particle.Prop.VELOCITY)
            return [-10000, 10000]
        else if (this.property == Particle.Prop.SIZE)
            return [-5000, 5000]
    }
    getControllsData() {
        console.log(this);
        var data = new Array();
        var namePref = { pref: "name", title: "name", value: this.name, controllType: "text", range: "" };
        var alterPref = { pref: "alterValue", title: "alterValue", value: this.alterValue, controllType: "boolean", range: "" };
        var propertyPref = { pref: "property", title: "property", value: this.property, controllType: "options", range: Particle.getPropertiesList() };
        var timePref = { pref: "timespan", title: ["timespan", "start", "finish"], value: [this.workingTimeSpan.min, this.workingTimeSpan.max], controllType: "number2", range: [0, 100] };
        var valuesPref = { pref: "values", title: this.getValuesTitles(), value: this.values, controllType: "values_list", range: this.getRangeValue() };
        data.push(namePref);
        //data.push(propertyPref);
        data.push(timePref);
        data.push(valuesPref);
        data.push(alterPref);
        return data;
    }

    valueChanged(pref, value) {
        console.log("old values ");
        console.log(this.values);
        console.log(this.value);
        if (pref == "values") {
            this.values = value;
            /* if ([Particle.Prop.ALPHA, Particle.Prop.ROTATION].includes(this.property)) {
                 this.speed.min.x = value[0];
                 this.speed.min.y = value[1];
                 this.speed.max.x = value[0];
                 this.speed.max.y = value[1];
             } else {
                 this.speed.min.x = value[0];
                 this.speed.min.y = value[1];
                 this.speed.max.x = value[2];
                 this.speed.max.y = value[3];
             }*/
            // this.speed.min.log()
            // this.speed.max.log()
        } else if (pref == "timespan") {
            this.workingTimeSpan.min = value[0];
            this.workingTimeSpan.max = value[1];
        } else if (pref == "name") {
            this.name = value;
            this.updateName();
        } else if (pref == "alterValue") {
            this.alterValue = value;
            this.updateName();
        } else if (pref == "property") {
            this.property = value;
            console.log("property changed, try to show controlls for this again");
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
        var v = new PropertyChanger(particleSystem, this.property, this.cloneValues())
        v.workingTimeSpan = this.workingTimeSpan.clone();
        v.name = this.name;
        v.oneByOneUpdate = this.oneByOneUpdate;
        return v;
    }
    cloneValues() {
        return this.values;
    }
    toJson() {
        var v = {
            "values": JSON.stringify(this.values),
            "property": this.property,
            "name": this.name,
            "type": CustomPropertyChanger.type,
            "workingTimeSpan": this.workingTimeSpan.toJson()
        }
        return v
    }
    static parse(json, particleSystem) {
        var v = new CustomPropertyChanger(particleSystem, json.property, JSON.parse(json.values));
        v.workingTimeSpan = Range.parse(json.workingTimeSpan);
        v.name = json.hasOwnProperty("name") ? json.name : "componant";
        return v;
    }
}