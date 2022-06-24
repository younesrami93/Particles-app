class BaseLayer {
    enable = true;
    allowUserControl = false
    w = 0.0;
    h = 0.0;
    htmlElement;
    time;
    title = "layer";
    type = "baseLayer"
    selectWhenInited = false;
    visibleArea = new visibleArea();

    constructor() {
        this.time = new UTime();
    }
    remove() {
        this.htmlElement.remove();
    }
    init() {

    }
    update() {

    }
    drawArea(ctx) {}
    getHeightPercentage() {
        return (this.h / this.w) * 100;
    }
    convertHeightToPercentage(percent) {
        var v = this.getHeightPercentage();
        return v * percent / 100;
    }
    setSize(w, h) {
        this.w = w;
        this.h = h;
    }
    drawFrame(gl) {

    }
    getObjectsCount() {
        return 0;
    }

    updateTitle(val) {
        this.title = val;
        this.htmlElement.find(".layer_title").text(val)
    }

    select() {

    }
}


class visibleArea {
    visibleXArea = new Vector(-1, 1)
    visibleYArea = new Vector(-1, 1)
    fadeAngle = 0



    getControllCssClass() {
        return ["visibleAreaPropPanel", "Visible Area", "images/shadow.png"];
    }

    getControllsData() {
        var data = new Array();
        var VisibleXAngle = { pref: "VisibleXAngle", title: "Visible X Angle", value: [this.visibleXArea.x * 360, this.visibleXArea.y * 360], controllType: "slider2", range: [-360, 360] };
        var VisibleYAngle = { pref: "VisibleYAngle", title: "Visible Y Angle", value: [this.visibleYArea.x * 360, this.visibleYArea.y * 360], controllType: "slider2", range: [-360, 360] };
        var fadeAnglePref = { pref: "fadeAnglePref", title: "Fade Angle", value: this.fadeAngle * 100, controllType: "slider", range: [0, 100] };

        data.push(VisibleXAngle);
        data.push(VisibleYAngle);
        data.push(fadeAnglePref);
        return data;
    }

    valueChanged(pref, value) {
        var parentObj = this;
        if (pref == "fadeAnglePref") {
            this.fadeAngle = value / 100
        } else if (pref == "VisibleXAngle") {
            this.visibleXArea.x = value[0] / 360;
            this.visibleXArea.y = value[1] / 360;
        } else if (pref == "VisibleYAngle") {
            this.visibleYArea.x = value[0] / 360;
            this.visibleYArea.y = value[1] / 360;
        }
    }

    clone() {
        var v = new visibleArea();
        v.visibleXArea = this.visibleXArea.clone()
        v.visibleYArea = this.visibleYArea.clone()
        v.fadeAngle = this.fadeAngle
        return v
    }
}