class BaseComponant {


    particleSystem;
    started = false;
    oneByOneUpdate = false;


    getLayer() {
        return this.particleSystem;
    }
    constructor(ps) {
        this.particleSystem = ps;
    }

    onStart() {}

    onUpdate(deltaTime) {
        for (var i = 0; i < this.particleSystem.particles.length; i++) {
            this.particleUpdate(this.particleSystem.particles[i], deltaTime);
        }
    }

    onLateUpdate(DeltaTime) {}

    particleUpdate(particle, deltaTime) {
        particle.velocity.y += 200 * deltaTime;
        particle.velocity.x -= -100 * deltaTime;
    }

    update(deltaTime) {
        if (!this.started) {
            this.started = true;
            this.onStart();
        } else {
            this.onUpdate(deltaTime);
        }
    }
    static parse(obj, ps) {
        if (obj.hasOwnProperty("type")) {
            console.log("parsing componant of type : " + obj.type);
            if (obj.type == CustomPropertyChanger.type) {
                return CustomPropertyChanger.parse(obj, ps);
            } else
                return PropertyChanger.parse(obj, ps)
        } else {
            return PropertyChanger.parse(obj, ps)
        }
    }
}