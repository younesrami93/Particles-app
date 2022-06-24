class ParticleInitValues {
    speed = new VectorRange();
    velocity = new VectorRange();
    size = new VectorRange();
    alpha = new Range(1, 1);
    rotation = new Range(0, 0);
    squarSize = true;
    constructor(size, speed, velocity) {
        this.size = size;
        this.speed = speed;
        this.velocity = velocity;
        this.size.evenRandomValues = true;
    }
    setupParticle(e) {
        e.velocity = this.velocity.getRandom();
        e.speed = this.speed.getRandom();
        e.size = this.size.getRandom();
        e.alpha.x = this.alpha.getRandom();
        e.rotation.x = this.rotation.getRandom();
    }
    getControllsData() {
        var data = new Array();
        var sizePref = { pref: "size", title: ["Size", "min : w", "h", "max : w", "h"], value: [this.size.min.x, this.size.min.y, this.size.max.x, this.size.max.y], controllType: "number4", range: [0, 400] };
        var squarSize = { pref: "squarSize", title: "squarSize", value: this.squarSize, controllType: "boolean", range:0};
        var speedPref = { pref: "speed", title: ["initial Speed", "min : x", "y", "max : x", "y"], value: [this.speed.min.x, this.speed.min.y, this.speed.max.x, this.speed.max.y], controllType: "number4", range: [-1000, 1000] };
        var alphaPref = { pref: "alpha", title: "initial opacity", value: [this.alpha.min * 100, this.alpha.max * 100], controllType: "slider2", range: [0, 100] };
        var rotationPref = { pref: "rotation", title: "initial rotation", value: [this.rotation.min, this.rotation.max], controllType: "slider2", range: [0, 360] };
        var velocityPref = { pref: "velocity", title: ["initial Veclovity", "min : x", "y", "max : x", "y"], value: [this.velocity.min.x, this.velocity.min.y, this.velocity.max.x, this.velocity.max.y], controllType: "number4", range: [-1000, 1000] };

        data.push(sizePref);
        data.push(squarSize);
        data.push(alphaPref);
        data.push(rotationPref);
        data.push(speedPref);
        data.push(velocityPref);
        return data;
    }
    valueChanged(pref, value) {
        if (pref == "speed") {
            this.speed.min.x = value[0];
            this.speed.min.y = value[1];
            this.speed.max.x = value[2];
            this.speed.max.y = value[3];
        } else if (pref == "size") {
            this.size.min.x = value[0];
            this.size.min.y = value[1];
            this.size.max.x = value[2];
            this.size.max.y = value[3];
        } else if (pref == "velocity") {
            this.velocity.min.x = value[0];
            this.velocity.min.y = value[1];
            this.velocity.max.x = value[2];
            this.velocity.max.y = value[3];
        } else if (pref == "squarSize") {
            this.squarSize = value;
            this.size.evenRandomValues = value
        } else if (pref == "alpha") {
            this.alpha.min = value[0] / 100;
            this.alpha.max = value[1] / 100;
        } else if (pref == "rotation") {
            this.rotation.min = value[0];
            this.rotation.max = value[1];
        }
    }
    getControllCssClass() {
        return ["initialValuesPanel", "Initial values", "images/start.png"];
    }
    clone() {
        var v = new ParticleInitValues(this.size.clone(), this.speed.clone(), this.velocity.clone())
        v.alpha = this.alpha.clone();
        v.rotation = this.rotation.clone();
        v.rotation = this.rotation.clone();
        v.squarSize = this.squarSize
        v.size.evenRandomValues = v.squarSize
        return v;
    }
    toJson() {
        var json = {
            "speed": this.speed.toJson(),
            "velocity": this.velocity.toJson(),
            "rotation": this.rotation.toJson(),
            "alpha": this.alpha.toJson(),
            "squarSize": this.squarSize,
            "size": this.size.toJson()
        }
        return json;
    }
    static parse(json) {
        var v = new ParticleInitValues(VectorRange.parse(json.size), VectorRange.parse(json.speed), VectorRange.parse(json.velocity));
        v.alpha = Range.parse(json.alpha);
        v.rotation = Range.parse(json.rotation);
        v.squarSize = json.hasOwnProperty("squarSize")?json.squarSize:true;
        v.size.evenRandomValues = v.squarSize
        return v;
    }
}