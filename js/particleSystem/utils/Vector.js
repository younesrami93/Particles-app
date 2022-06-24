class Vector {
    x = 0.0;
    y = 0.0;
    z = 0.0;

    constructor(x, y, z) {

        if (x === undefined)
            x = 0.0;
        if (y === undefined)
            y = 0.0;
        if (z === undefined)
            z = 0.0;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(v, deltaTime) {
        this.x += v.x * deltaTime;
        this.y += v.y * deltaTime;
        this.z += v.z * deltaTime;
    }

    static createVector(vector) {
        return new Vector(vector.x, vector.y, vector.z);
    }




    log() {
        console.log(this.toString());
    }
    toString() {
        return "Vectore{" + "x=" + this.x + ", y=" + this.y + ", z=" + this.z + '}';
    }
    clone() {
        return Vector.createVector(this);
    }
    toJson() {
        var json = {
            "x": this.x,
            "y": this.y,
            "z": this.z
        };
        return json;
    }
    static arrayToVector(arr) {
        return new Vector(arr[0], arr[1], arr[2]);
    }
    static parse(json) {
        return new Vector(json.x, json.y, json.z);
    }
}