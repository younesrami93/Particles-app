class CircleSpawner extends BaseSpawner {
    position;
    static name = "Circle";
    fill = true;
    radius = 0;
    particleLife = new Range(2, 4);

    toJson() {
        var v = {
            "type": CircleSpawner.name,
            "position": this.position.toJson(),
            "particleLife": this.particleLife.toJson(),
            "radius": this.radius,
            "maxParticles": this.maxParticles,
            "DelayBetweenShots": this.DelayBetweenShots,
            "DelayBetweenSpawns": this.DelayBetweenSpawns,
            "maxParticleSpawnAtOnce": this.maxParticleSpawnAtOnce,
            "fill": this.fill
        }
        return v;
    }
    drag(x, y) {
        this.position.x += x;
        this.position.y += y;
    }

    constructor(particleSystem, maxParticles, maxParticleSpawnAtOnce, position, radius, fill) {
        super(particleSystem, maxParticles, maxParticleSpawnAtOnce);
        this.position = position;
        this.radius = radius;
        this.fill = fill;
    }
    static parse(json, particleSystem) {
        var v = new CircleSpawner(particleSystem,
            json.maxParticles,
            json.maxParticleSpawnAtOnce,
            Vector.parse(json.position),
            json.radius,
            json.fill);
        v.particleLife = Range.parse(json.particleLife);
        v.DelayBetweenShots = json.hasOwnProperty("DelayBetweenShots") ? json.DelayBetweenShots : 0;
        v.DelayBetweenSpawns = json.hasOwnProperty("DelayBetweenSpawns") ? json.DelayBetweenSpawns : 0;
        return v;
    }
    clone(particleSystem) {
        var v = new CircleSpawner(particleSystem, this.maxParticles, this.maxParticleSpawnAtOnce, this.position.clone(), this.radius, this.fill)
        v.particleLife = this.particleLife.clone();
        v.DelayBetweenSpawns = this.DelayBetweenSpawns;
        v.DelayBetweenShots = this.DelayBetweenShots;
        return v;
    }
    update(x, y) {
        //console.log("circleSpawner update "+this.particleSystem.particles.length +"/"+this.maxParticles+"/"+this.maxParticleSpawnAtOnce)
        super.update();
        if (!this.isTimeForSpawn())
            return;
        for (var i = 0; i < this.maxParticleSpawnAtOnce; i++) {
            if (!this.shoudSpawn())
                return;
            if (x != null && x != undefined && y != null && y != undefined) {
                if (this.particleSystem.particles.length < this.maxParticles)
                    this.spawn(new Vector(x, y));
            } else {
                if (this.particleSystem.particles.length < this.maxParticles)
                    this.spawn(this.getNewPosition());
                else
                    break;
            }
        }
    }
    drawArea(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "red";
        var width = this.radius / 2 * globals.width / 100
        ctx.arc((this.position.x) * globals.width / 100 + width, (this.position.y) * globals.width / 100 + width, width, 0, 2 * Math.PI);
        ctx.stroke();
    }
    static getDefault(ps) {
        return new CircleSpawner(ps, 300, 2, new Vector(0, 0), 100, false);
    }

    getNewPosition() {
        if (this.fill) {
            var a = Math.random() * 2 * Math.PI;
            var r = this.radius / 2 * Math.sqrt(Math.random());

            var x = r * Math.cos(a) + this.position.x + this.radius / 2;
            var y = r * Math.sin(a) + this.position.y + this.radius / 2;
            return new Vector(x, y);
        } else {
            var angle = Math.random() * Math.PI * 2;
            var x = (Math.cos(angle) * (this.radius / 2)) + this.position.x + this.radius / 2;
            var y = (Math.sin(angle) * (this.radius / 2)) + this.position.y + this.radius / 2;
            return new Vector(x, y);
        }
    }

    spawn(pos) {
        var e = new Particle(this.particleSystem.paralaxOffset);
        e.setTexture(this.particleSystem.getRandomImg());
        e.position = pos.clone();
        this.particleSystem.initialValues.setupParticle(e)
        e.setLife(this.particleLife.getRandom())
        this.particleSystem.addParticle(e);
        this.particleSpawned++;
        e.depth = this.particleSystem.depth
    }
    particleDestroyed(particle) {

    }
    SizeChanged(w, h) {

    }



    getControllCssClass() {
        return ["spawnerPropPanel", "Spawner", "images/movement.png"];
    }

    getValueControllType(pref) {
        if (pref == "position") {
            return "number2"
        } else if (pref == "type") {
            return "options"
        } else if (pref == "radius") {
            return "number"
        } else if (pref == "particle_size") {
            return "number2"
        } else if (pref == "fill") {
            return "boolean"
        } else if (pref == "maxparticle") {
            return "number"
        } else if (pref == "maxParticleSpawnAtOnce") {
            return "number"
        } else if (pref == "particleLife") {
            return "number2"
        }
    }

    getControllsData() {
        var data = new Array();
        var spawnerPref = { pref: "type", title: "type", value: CircleSpawner.name, controllType: this.getValueControllType("type"), range: super.getSpawnersTypes() };
        var particleCountPref = { pref: "particleCount", title: ["particles count", "max", "at once"], value: [this.maxParticles, this.maxParticleSpawnAtOnce], controllType: "number2", range: [1, 2000] };
        var delayBetweenSpawnsPref = { pref: "DelayBetweenSpawns", title: "Delay Between Spawns (s)", value: this.DelayBetweenSpawns, controllType: "number", range: [0, 100000] };
        var delayBetweenShotsPref = { pref: "DelayBetweenShots", title: "Delay Between Shots (s)", value: this.DelayBetweenShots, controllType: "number", range: [0, 100000] };
        var positionPref = { pref: "position", title: ["position", "left", "top"], value: [this.position.x, this.position.y], controllType: this.getValueControllType("position"), range: [-500, 500] };
        var radiusPref = { pref: "radius", title: "radius", value: this.radius, controllType: this.getValueControllType("radius"), range: [0, 300] };
        var lifePref = { pref: "particleLife", title: ["particle Life", "min", "max"], value: [this.particleLife.min, this.particleLife.max], controllType: this.getValueControllType("particleLife"), range: [-1, 2000] };
        var fillPref = { pref: "fill", title: "Spawn inside", value: this.fill, controllType: this.getValueControllType("fill") };
        data.push(spawnerPref);
        data.push(particleCountPref);
        data.push(delayBetweenSpawnsPref);
        data.push(delayBetweenShotsPref);
        data.push(lifePref);
        data.push(positionPref);
        data.push(radiusPref);
        data.push(fillPref);
        return data;
    }

    valueChanged(pref, value) {
        console.log(value);
        if (pref == "position") {
            this.position.x = value[0];
            this.position.y = value[1];
        } else if (pref == "fill") {
            this.fill = value;
        } else if (pref == "DelayBetweenSpawns") {
            this.DelayBetweenSpawns = value;
        } else if (pref == "DelayBetweenShots") {
            this.DelayBetweenShots = value;
        } else if (pref == "radius") {
            this.radius = value;
        } else if (pref == "particleCount") {
            this.maxParticles = value[0];
            this.maxParticleSpawnAtOnce = value[1];
        } else if (pref == "particleLife") {
            this.particleLife.min = value[0];
            this.particleLife.max = value[1];
        } else if (pref == "type") {
            super.changeSpawner(value, [this.position.x, this.position.y], [this.radius, this.radius])
        }
    }


}