class BaseSpawner {
    particleSystem;
    maxParticles = 0;
    maxParticleSpawnAtOnce = 0;
    particleSpawned = 0;
    timer = new UTime();
    DelayBetweenSpawns = 0;
    DelayBetweenShots = 0;
    age = 0;
    particleLife = new Range(2, 4);
    pauseForSeconds = 0;

    constructor(particleSystem, maxParticles = 10, maxParticleSpawnAtOnce = 2) {
        this.particleSystem = particleSystem;
        this.maxParticles = maxParticles;
        this.maxParticleSpawnAtOnce = maxParticleSpawnAtOnce;
    }

    SizeChanged(w = 0, h = 0) {

    }
    update(x, y) {
        this.timer.update();
        this.age += this.timer.getDeltaTime();
        this.pauseForSeconds -= this.timer.getDeltaTime();
    }

    shoudSpawn() {
        if (this.particleSpawned >= this.maxParticles) {
            this.pauseForSeconds = this.DelayBetweenShots;
            this.particleSpawned = 0;
            return false;
        }
        return true;
    }

    isTimeForSpawn() {
        if (this.pauseForSeconds > 0)
            return false;
        if (this.age < this.DelayBetweenSpawns) {
            return false;
        } else {
            this.age = 0;
        }
        return true;
    }

    getNewPosition() {
        return new Vector(50, 50);
    }

    spawn(position) {
        console.log("spawn baseSpawner")

        var e = new Particle(0);
        e.setTexture(this.particleSystem.getRandomImg());

        var width = 20;
        var height = (width * (e.bmpHeight / e.bmpWidth));
        e.setHeight(height);
        e.setWidth(width);

        e.position = position.clone();
        e.position.x -= width / 2;
        e.position.y -= height / 2;
        this.particleSystem.addParticle(e);
        this.particleSpawned++;
    }
    particleDestroyed(particle) {

    }
    getSpawnersTypes() {
        return ["Point", "Circle", "Rectangle", "Line"]
    }

    changeSpawner(type, pos, size) {
        var sp = null;
        console.log("spawner change to " + type);
        if (type == CircleSpawner.name) {
            sp = CircleSpawner.getDefault(this.particleSystem);
            sp.radius = size[0];
            sp.position.x = pos[0];
            sp.position.y = pos[1];
        } else if (type == PointSpawner.name) {
            sp = PointSpawner.getDefault(this.particleSystem);
            sp.position.x = pos[0];
            sp.position.y = pos[1];
        } else if (type == RectSpawner.name) {
            sp = RectSpawner.getDefault(this.particleSystem);
            sp.size.x = size[0];
            sp.size.y = size[1];
            sp.position.x = pos[0];
            sp.position.y = pos[1];
        } else if (type == LineSpawner.name) {
            sp = LineSpawner.getDefault(this.particleSystem);
            sp.position1.x = pos[0];
            sp.position1.y = pos[1];
            sp.position2.x = pos[0]+20;
            sp.position2.y = pos[1]+20;
        }
        sp.DelayBetweenSpawns = this.DelayBetweenSpawns
        sp.DelayBetweenShots = this.DelayBetweenShots
        sp.maxParticleSpawnAtOnce = this.maxParticleSpawnAtOnce
        sp.maxParticles = this.maxParticles
        sp.pauseForSeconds = this.pauseForSeconds
        sp.particleLife = this.particleLife



        this.particleSystem.changeSpawner(sp)

    }
    static parse(jsonSpawner, ps) {
        if (jsonSpawner.type == CircleSpawner.name) {
            return CircleSpawner.parse(jsonSpawner, ps);
        } else if (jsonSpawner.type == RectSpawner.name) {
            return RectSpawner.parse(jsonSpawner, ps);
        } else if (jsonSpawner.type == PointSpawner.name) {
            return PointSpawner.parse(jsonSpawner, ps);
        } else if (jsonSpawner.type == LineSpawner.name) {
            return LineSpawner.parse(jsonSpawner, ps);
        }
    }
    drawArea(ctx) {

    }
    drag(x, y) {

    }
}