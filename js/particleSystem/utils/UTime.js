class UTime {
    DeltaTime = 0.0;
    lastTimeUpdated = 0.0;
    constructor() {
        this.DeltaTime = 0;
        this.lastTimeUpdated = Date.now();
    }
    update() {
        var currentTime = Date.now();
        if (this.lastTimeUpdated > 0) {
            this.DeltaTime = (currentTime - this.lastTimeUpdated) / 1000.0;
        }
        this.lastTimeUpdated = currentTime;
    };
    getDeltaTime() {
        return this.DeltaTime;
    };
}