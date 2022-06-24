class UTexture {
    id;
    bmp;
    src = "";
    height = 0;
    width = 0;
    filter;
    isLoaded = false;
    tint ="#00000000";
    onImageLoadedCallback = null;
    toJson() {
        var json = {
            "src": this.src,
            "id": this.id,
            "tint": this.tint,
            "filter": this.filter
        }
        return json;
    }
    static parse(json) {
        var img = new UTexture(json.src, json.filter, null, json.id);
        img.tint = json.hasOwnProperty("tint")?json.tint:"#00000000";
        return img;
    }
    constructor(src, filter = '', loadedCallback, id) {
        if (id == null || id == undefined)
            throw "id of image cant be null";
        if (loadedCallback != null && loadedCallback != undefined)
            this.onImageLoadedCallback = loadedCallback;
        this.bmp = new Image();
        this.id = id;
        this.src = src;
        this.filter = filter;
        this.bmp.src = src;
        this.bmp.onload = this.imgLoaded;
        var parentObj = this;

        this.bmp.onload = function(e) {
            parentObj.isLoaded = true;
            parentObj.height = parentObj.bmp.height;
            parentObj.width = parentObj.bmp.width;
            if (parentObj.onImageLoadedCallback != null)
                parentObj.onImageLoadedCallback();
        }
    }
    setLoadedCallback(callback) {
        if (this.bmp.width == 0)
            this.onImageLoadedCallback = callback;
        else
            callback();
    }
    imgLoaded(e) {

    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }
    clone() {
        var v = new UTexture(this.src, this.filter, null, this.id);
        v.tint = this.tint;
        return v;
    }
}