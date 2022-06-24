class LineSpawner extends BaseSpawner {
    static name = "Line";
    position1 = null;
    position2 = null;
    particleLife = new Range(2, 4);
    toJson() {
        var v = {
            "type": LineSpawner.name,
            "position1": this.position1.toJson(),
            "position2": this.position2.toJson(),
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
        var v = new LineSpawner(particleSystem,
            json.maxParticles,
            json.maxParticleSpawnAtOnce,
            Vector.parse(json.position1),
            Vector.parse(json.position2));
        v.particleLife = Range.parse(json.particleLife);
        v.DelayBetweenShots = json.hasOwnProperty("DelayBetweenShots") ? json.DelayBetweenShots : 0;
        v.DelayBetweenSpawns = json.hasOwnProperty("DelayBetweenSpawns") ? json.DelayBetweenSpawns : 0;
        return v;
    }

    clone(particleSystem) {
        var v = new LineSpawner(particleSystem, this.maxParticles, this.maxParticleSpawnAtOnce, this.position1.clone(), this.position2.clone())
        v.particleLife = this.particleLife.clone();
        v.DelayBetweenSpawns = this.DelayBetweenSpawns;
        v.DelayBetweenShots = this.DelayBetweenShots;
        return v;
    }

    constructor(particleSystem, maxParticles, maxParticleSpawnAtOnce, position1, position2) {
        super(particleSystem, maxParticles, maxParticleSpawnAtOnce);
        this.position1 = position1;
        this.position2 = position2;
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
        return new LineSpawner(particleSystem, 300, 2, new Vector(30, particleSystem.convertHeightToPercentage(40)), new Vector(70, particleSystem.convertHeightToPercentage(70)));
    }

    getNewPosition() {
        var percent = Math.random() * 1;
        var minx = this.position1.x //Math.min(this.position1.x, this.position2.x)
        var maxx = this.position2.x //Math.max(this.position1.x, this.position2.x)
        var miny = this.position1.y //Math.min(this.position1.y, this.position2.y)
        var maxy = this.position2.y //Math.max(this.position1.y, this.position2.y)

        var xd = maxx - minx;
        var yd = maxy - miny;
        var newx = xd * percent + minx;
        var newy = yd * percent + miny;
        return new Vector(newx, newy, 0);
    }

    spawn(position) {
        var e = new Particle(this.particleSystem.paralaxOffset);
        e.setTexture(this.particleSystem.getRandomImg());

        this.particleSystem.initialValues.setupParticle(e)
        e.position = position;
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
        if (pref == "position1" || pref == "position2") {
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
    drag(x, y) {
        this.position1.x += x;
        this.position1.y += y;
        this.position2.x += x;
        this.position2.y += y;
    }

    drawArea(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "red";
        ctx.moveTo(this.position1.x * globals.width / 100, this.position1.y * globals.width / 100);
        ctx.lineTo(this.position2.x * globals.width / 100, this.position2.y * globals.width / 100);
        ctx.stroke();
    }

    getControllsData() {
        console.log(this);
        var data = new Array();
        var particleCountPref = { pref: "particleCount", title: ["particles count", "max", "at once"], value: [this.maxParticles, this.maxParticleSpawnAtOnce], controllType: "number2", range: [1, 2000] };
        var spawnerPref = { pref: "type", title: "type", value: LineSpawner.name, controllType: this.getValueControllType("type"), range: super.getSpawnersTypes() };
        var delayBetweenSpawnsPref = { pref: "DelayBetweenSpawns", title: "Delay Between Spawns (s)", value: this.DelayBetweenSpawns, controllType: "number", range: [0, 100000] };
        var delayBetweenShotsPref = { pref: "DelayBetweenShots", title: "Delay Between Shots (s)", value: this.DelayBetweenShots, controllType: "number", range: [0, 100000] };
        var position1Pref = { pref: "position1", title: ["Point1", "left", "top"], value: [this.position1.x, this.position1.y], controllType: this.getValueControllType("position1"), range: [-500, 500] };
        var position2Pref = { pref: "position2", title: ["Point2", "left", "top"], value: [this.position2.x, this.position2.y], controllType: this.getValueControllType("position2"), range: [-500, 500] };
        var lifePref = { pref: "particleLife", title: ["particle Life", "min", "max"], value: [this.particleLife.min, this.particleLife.max], controllType: this.getValueControllType("particleLife"), range: [-1, 2000] };
        data.push(spawnerPref);
        data.push(particleCountPref);
        data.push(delayBetweenSpawnsPref);
        data.push(delayBetweenShotsPref);
        data.push(lifePref);
        data.push(position1Pref);
        data.push(position2Pref);
        return data;
    }

    valueChanged(pref, value) {
        console.log(value);
        if (pref == "position1") {
            this.position1.x = value[0];
            this.position1.y = value[1];
        } else if (pref == "DelayBetweenSpawns") {
            this.DelayBetweenSpawns = value;
        } else if (pref == "DelayBetweenShots") {
            this.DelayBetweenShots = value;
        } else if (pref == "position2") {
            this.position2.x = value[0];
            this.position2.y = value[1];
        } else if (pref == "particleCount") {
            this.maxParticles = value[0];
            this.maxParticleSpawnAtOnce = value[1];
        } else if (pref == "particleLife") {
            this.particleLife.min = value[0];
            this.particleLife.max = value[1];
        } else if (pref == "type") {
            super.changeSpawner(value, [this.position1.x, this.position1.y], [10, 10])
        }
    }
}