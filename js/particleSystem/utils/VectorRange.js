class VectorRange {
    min;
    max;
    evenRandomValues = false; // generate the same random value of x,y,z  using min.x and max.x value

    constructor() {
        this.min = new Vector();
        this.max = new Vector();
    }

    static createVectoreRangeEven(min, max) {
        var v = new VectorRange();
        v.min.x = min;
        v.max.x = max;
        v.evenRandomValues = true;
        return v;
    }
    static createVectoreRange(min, max) {
        var v = new VectorRange();
        v.min = min;
        v.max = max;
        return v;
    }

    getRandom() {
        if (this.evenRandomValues) {
            var vx = VectorRange.randomRange(this.min.x, this.max.x);
            return new Vector(vx, vx, vx);
        } else {
            var vector = new Vector(VectorRange.randomRange(this.min.x, this.max.x), VectorRange.randomRange(this.min.y, this.max.y), VectorRange.randomRange(this.min.z, this.max.z));
            return vector;
        }
    }
    getRandom_useXY() {
        if (this.evenRandomValues) {
            var vx = VectorRange.randomRange(this.min.x, this.max.x);
            return new Vector(vx, vx, vx);
        } else {
            var vector = new Vector(VectorRange.randomRange(this.min.x, this.max.y), VectorRange.randomRange(this.min.x, this.max.y), VectorRange.randomRange(this.min.x, this.max.y));
            return vector;
        }
    }

    log() {
        console.log("tag:" + this.toString());
    }

    toString() {
        return "VectoreRange{" + this.min.toString() + "," + this.max.toString() + '}';
    }

    clone() {
        var v = VectorRange.createVectoreRange(this.min.clone(), this.max.clone());
        v.evenRandomValues = this.evenRandomValues;
        return v;
    }

    static randomRange(v1, v2) {
        var low = v1 < v2 ? v1 : v2;
        var high = v1 > v2 ? v1 : v2;
        return Math.random() * (high - low) + low;
    }
    toJson() {
        var json = {
            "min": this.min,
            "max": this.max,
            "evenRandomValues": this.evenRandomValues
        }
        return json;
    }
    static parse(json) {
        var v = new VectorRange();
        v.min = Vector.parse(json.min);
        v.max = Vector.parse(json.max);
        v.evenRandomValues = json.evenRandomValues;
        return v;
    }
}