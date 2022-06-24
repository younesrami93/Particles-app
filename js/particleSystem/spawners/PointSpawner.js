class PointSpawner extends BaseSpawner {
    static name = "Point";
    position = null;
    particleLife = new Range(2, 4);
    toJson() {
        var v = {
            "type": PointSpawner.name,
            "position": this.position.toJson(),
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
        var v = new PointSpawner(particleSystem,
            json.maxParticles,
            json.maxParticleSpawnAtOnce,
            Vector.parse(json.position));
        v.particleLife = Range.parse(json.particleLife);
        v.DelayBetweenShots = json.hasOwnProperty("DelayBetweenShots") ? json.DelayBetweenShots : 0;
        v.DelayBetweenSpawns = json.hasOwnProperty("DelayBetweenSpawns") ? json.DelayBetweenSpawns : 0;
        return v;
    }

    clone(particleSystem) {
        var v = new PointSpawner(particleSystem, this.maxParticles, this.maxParticleSpawnAtOnce, this.position.clone())
        v.particleLife = this.particleLife.clone();
        v.DelayBetweenSpawns = this.DelayBetweenSpawns;
        v.DelayBetweenShots = this.DelayBetweenShots;
        return v;
    }

    constructor(particleSystem, maxParticles, maxParticleSpawnAtOnce, position) {
        super(particleSystem, maxParticles, maxParticleSpawnAtOnce);
        this.position = position;
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

    static getDefault(particleSystem) {
        return new PointSpawner(particleSystem, 300, 2, new Vector(50, particleSystem.convertHeightToPercentage(50)));
    }

    getNewPosition() {
        return this.position;
    }

    spawn(position) {
        var e = new Particle(this.particleSystem.paralaxOffset);
        e.setTexture(this.particleSystem.getRandomImg());

        this.particleSystem.initialValues.setupParticle(e)
        e.position = position.clone();
        e.setLife(this.particleLife.getRandom())
        this.particleSystem.addParticle(e);
        e.depth = this.particleSystem.depth
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
        } else if (pref == "particle_size") {
            return "number2"
        } else if (pref == "type") {
            return "options"
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
        var width = 2 * globals.width / 100
        ctx.arc((this.position.x) * globals.width / 100, (this.position.y) * globals.width / 100, width, 0, 2 * Math.PI);
        ctx.stroke();
    }

    getControllsData() {
        console.log(this);
        var data = new Array();
        var particleCountPref = { pref: "particleCount", title: ["particles count", "max", "at once"], value: [this.maxParticles, this.maxParticleSpawnAtOnce], controllType: "number2", range: [1, 2000] };
        var spawnerPref = { pref: "type", title: "type", value: PointSpawner.name, controllType: this.getValueControllType("type"), range: super.getSpawnersTypes() };
        var delayBetweenSpawnsPref = { pref: "DelayBetweenSpawns", title: "Delay Between Spawns (s)", value: this.DelayBetweenSpawns, controllType: "number", range: [0, 100000] };
        var delayBetweenShotsPref = { pref: "DelayBetweenShots", title: "Delay Between Shots (s)", value: this.DelayBetweenShots, controllType: "number", range: [0, 100000] };
        var positionPref = { pref: "position", title: ["position", "left", "top"], value: [this.position.x, this.position.y], controllType: this.getValueControllType("position"), range: [-500, 500] };
        var lifePref = { pref: "particleLife", title: ["particle Life", "min", "max"], value: [this.particleLife.min, this.particleLife.max], controllType: this.getValueControllType("particleLife"), range: [-1, 2000] };
        data.push(spawnerPref);
        data.push(particleCountPref);
        data.push(delayBetweenSpawnsPref);
        data.push(delayBetweenShotsPref);
        data.push(lifePref);
        data.push(positionPref);
        return data;
    }
    drag(x, y) {
        this.position.x += x;
        this.position.y += y;
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
        } else if (pref == "particleCount") {
            this.maxParticles = value[0];
            this.maxParticleSpawnAtOnce = value[1];
        } else if (pref == "particleLife") {
            this.particleLife.min = value[0];
            this.particleLife.max = value[1];
        } else if (pref == "type") {
            super.changeSpawner(value, [this.position.x, this.position.y], [10, 10])
        }
    }
}