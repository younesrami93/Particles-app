class imageCollection {
    list;
    onLoadCallback = null;
    filter;
    constructor(srcs, filter, onLoadCallback) {
        this.list = new Array();
        this.filter = filter;
        this.addImages(srcs, onLoadCallback)
    }

    toJson() {
        var json = {
            "filter": this.filter,
            "images": this.imagesJson()
        }
        return json;
    }
    imagesJson() {
        var json = new Array();
        for (let i = 0; i < this.list.length; i++) {
            var item = this.list[i];
            json.push(item.toJson())
        }
        return json;
    }
    static parse(json, onLoadCallback) {
        var imgs = new Array();
        for (let i = 0; i < json.images.length; i++) {
            var item = json.images[i];
            imgs.push([item.src, item.id,item.tint]);
        }
        var v = new imageCollection(imgs, json.filter, onLoadCallback);
        return v;
    }
    clone(loadCallaback) {
        var srcs = new Array();
        for (let i = 0; i < this.list.length; i++) {
            var item = this.list[i];
            srcs.push([item.src, item.id, item.tint]);
        }
        var v = new imageCollection(srcs, this.filter, loadCallaback);
        return v;
    }
    setFilter(filter) {
        this.filter = filter;
        for (let i = 0; i < this.list.length; i++) {
            var item = this.list[i];
            item.filter = this.filter;
        }
    }
    addImages(srcs, onLoadCallback) {
        this.onLoadCallback = onLoadCallback;
        var parentObj = this;
        for (let i = 0; i < srcs.length; i++) {
            var item = srcs[i];
            var img = new UTexture(item[0], this.filter, null, item[1]);
            if(item[2] == undefined)
                img.tint = "#00000000"
            else
                img.tint = item[2]
            img.setLoadedCallback(function() {
                parentObj.imgLoaded(this);
            })
            this.list.push(img)
        }
    }
    addImageWhenLoaded(img) {
        var parentObj = this;
        var item = img.path;
        var img = new UTexture(item, this.filter, null, img.id);
        img.setLoadedCallback(function() {
            parentObj.list.push(img)
        })
        return img;
    }

    getArrayString() {
        var arr = new Array();
        for (let i = 0; i < this.list.length; i++) {
            var item = this.list[i];
            arr.push(item.src);
        }
        return arr;
    }
    imgLoaded(img) {
        if (this.isAllImagesLoaded() && this.onLoadCallback != null) {
            this.onLoadCallback();
        } else {}
    }
    remove(img) {
        for (let i = 0; i < this.list.length; i++) {
            var item = this.list[i];
            if (item == img) {
                this.list.splice(i, 1);
                break;
            }
        }
    }
    isAllImagesLoaded() {

        for (let i = 0; i < this.list.length; i++) {
            var item = this.list[i];
            if (item.width <= 0) {
                return false;
            }
        }
        return true;
    }
    getRandom() {
        return this.list[Math.floor(Math.random() * this.list.length)]
    }
    getImagesIds() {
        var imagesids = [];
        for (let i = 0; i < this.list.length; i++) {
            var item = this.list[i];
            imagesids.push(item.id)
        }
        return imagesids;
    }
}