class Range {
    min = 0.0;
    max = 0.0;
    constructor(min, max) {
        if (min === undefined)
            min = 0;
        if (max == undefined)
            max = 0;
        this.min = min;
        this.max = max;
    }
    getRandom() {
        return this.randomRange(this.min, this.max);
    }
    randomRange(v1, v2) {
        var low = v1 < v2 ? v1 : v2;
        var high = v1 > v2 ? v1 : v2;
        return Math.random() * (high - low) + low;
    }
    clone() {
        var v = new Range(this.min, this.max);
        return v;
    }
    toJson() {
        var json = {
            "min": this.min,
            "max": this.max
        }
        return json;
    }
    static parse(json) {
        return new Range(json.min, json.max);
    }

}