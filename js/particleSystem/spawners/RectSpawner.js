class RectSpawner extends BaseSpawner {
    position;
    size;
    static name = "Rectangle";
    fill = true;
    toJson() {
        var v = {
            "type": RectSpawner.name,
            "position": this.position.toJson(),
            "size": this.size.toJson(),
            "particleLife": this.particleLife.toJson(),
            "DelayBetweenShots": this.DelayBetweenShots,
            "DelayBetweenSpawns": this.DelayBetweenSpawns,
            "maxParticles": this.maxParticles,
            "maxParticleSpawnAtOnce": this.maxParticleSpawnAtOnce,
            "fill": this.fill
        }
        return v;
    }
    static parse(json, particleSystem) {
        var v = new RectSpawner(particleSystem,
            json.maxParticles,
            json.maxParticleSpawnAtOnce,
            Vector.parse(json.position),
            Vector.parse(json.size),
            json.fill);
        v.DelayBetweenShots = json.hasOwnProperty("DelayBetweenShots") ? json.DelayBetweenShots : 0;
        v.DelayBetweenSpawns = json.hasOwnProperty("DelayBetweenSpawns") ? json.DelayBetweenSpawns : 0;
        v.particleLife = Range.parse(json.particleLife);
        return v;
    }
    clone(particleSystem) {
        var v = new RectSpawner(particleSystem, this.maxParticles, this.maxParticleSpawnAtOnce, this.position.clone(), this.size.clone(), this.fill)
        v.particleLife = this.particleLife.clone();
        v.DelayBetweenSpawns = this.DelayBetweenSpawns;
        v.DelayBetweenShots = this.DelayBetweenShots;
        return v;
    }

    constructor(particleSystem, maxParticles, maxParticleSpawnAtOnce, position, size, fill) {
        super(particleSystem, maxParticles, maxParticleSpawnAtOnce);
        this.position = position;
        this.size = size;
        this.fill = fill;
    }

    update(x, y) {
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

    static getDefault(ps) {
        return new RectSpawner(ps, 300, 2, new Vector(40, ps.convertHeightToPercentage(40)), new Vector(10, ps.convertHeightToPercentage(10)), false);
    }

    getNewPosition() {
        if (this.fill) {
            return new Vector(Math.random() * this.size.x + this.position.x, Math.random() * this.size.y + this.position.y);
        } else {
            return new Vector(Math.random() * this.size.x + this.position.x, Math.random() * this.size.y + this.position.y);
        }
    }

    spawn(pos) {
        var e = new Particle(this.particleSystem.paralaxOffset);
        e.setTexture(this.particleSystem.getRandomImg());
        e.position = pos.clone();
        this.particleSystem.initialValues.setupParticle(e)
        e.setLife(this.particleLife.getRandom())
        e.depth = this.particleSystem.depth
        this.particleSystem.addParticle(e);
        this.particleSpawned++;
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
        } else if (pref == "size") {
            return "number2"
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

    drawArea(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "red";
        ctx.rect(this.position.x * globals.width / 100, this.position.y * globals.width / 100, this.size.x * globals.width / 100, this.size.y * globals.width / 100);
        ctx.stroke();
    }

    getControllsData() {
        console.log(this);
        var data = new Array();
        var spawnerPref = { pref: "type", title: "type", value: RectSpawner.name, controllType: this.getValueControllType("type"), range: super.getSpawnersTypes() };
        var particleCountPref = { pref: "particleCount", title: ["particles count", "max", "at once"], value: [this.maxParticles, this.maxParticleSpawnAtOnce], controllType: "number2", range: [1, 2000] };
        var delayBetweenSpawnsPref = { pref: "DelayBetweenSpawns", title: "Delay Between Spawns (s)", value: this.DelayBetweenSpawns, controllType: "number", range: [0, 100000] };
        var delayBetweenShotsPref = { pref: "DelayBetweenShots", title: "Delay Between Shots (s)", value: this.DelayBetweenShots, controllType: "number", range: [0, 100000] };
        var positionPref = { pref: "position", title: ["position", "left", "top"], value: [this.position.x, this.position.y], controllType: this.getValueControllType("position"), range: [-500, 500] };
        var sizePref = { pref: "size", title: ["size", "width", "height"], value: [this.size.x, this.size.y], controllType: this.getValueControllType("size"), range: [0, 500] };
        var radiusPref = { pref: "radius", title: "radius", value: this.radius, controllType: this.getValueControllType("radius"), range: [0, 150] };
        var lifePref = { pref: "particleLife", title: ["particle Life", "min", "max"], value: [this.particleLife.min, this.particleLife.max], controllType: this.getValueControllType("particleLife"), range: [-1, 2000] };
        var fillPref = { pref: "fill", title: "Spawn inside", value: this.fill, controllType: this.getValueControllType("fill") };
        data.push(spawnerPref);
        data.push(particleCountPref);
        data.push(delayBetweenSpawnsPref);
        data.push(delayBetweenShotsPref);
        data.push(lifePref);
        data.push(fillPref);
        data.push(positionPref);
        console.log(this.position)
        data.push(sizePref);
        data.push(radiusPref);
        return data;
    }
    drag(x, y) {
        console.log("drag:" + x + "/" + y)

        if (x != undefined && y != undefined) {
            this.position.x += x;
            this.position.y += y;
        }
    }

    valueChanged(pref, value) {
        console.log(value);
        if (pref == "position") {
            this.position.x = value[0];
            this.position.y = value[1];
        } else if (pref == "DelayBetweenSpawns") {
            this.DelayBetweenSpawns = value;
        } else if (pref == "DelayBetweenShots") {
            this.DelayBetweenShots = value;
        } else if (pref == "size") {
            this.size.x = value[0];
            this.size.y = value[1];
        } else if (pref == "fill") {
            this.fill = value;
        } else if (pref == "radius") {
            this.radius = value;
        } else if (pref == "particleCount") {
            this.maxParticles = value[0];
            this.maxParticleSpawnAtOnce = value[1];
        } else if (pref == "particleLife") {
            this.particleLife.min = value[0];
            this.particleLife.max = value[1];
        } else if (pref == "type") {
            super.changeSpawner(value, [this.position.x, this.position.y], [this.size.x, this.size.y])
        }
    }


}