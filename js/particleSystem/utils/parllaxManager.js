class parallaxManager {
    static strength = 1.0;
    static resetSmoothness = 1.0;
    static allwaysReset  =true
    static xOffset = 0.0;
    static yOffset = 0.0;
    static enabled = false;
    static rotateEnabled = false;
    static maxAngle = 16.7;
    static minAngle = -16.7;

    static xProgress = 0;
    static yProgress = 0;
    static deltaTime = 0.2;

    static smooth_x = 0;
    static smooth_y = 0;

    static toggle() {
        parallaxManager.enabled = !parallaxManager.enabled;
    }


    static getValueOfXOffset(offset) {
       /* if (!this.enabled)
            return 0;*/
        // var v = offset * this.xOffset;
        var v = offset * Math.sin(this.smooth_x / 30) * this.strength;
        return v;
    }

    static getValueOfYOffset(offset) {
       /* if (!this.enabled)
            return 0;*/
        //var v = offset * this.yOffset;
        var v = -offset * Math.sin(this.smooth_y / 30) * this.strength;
        return v;
    }
    static setOffset(xoffset, yoffset) {
        parallaxManager.xOffset = xoffset;
        parallaxManager.yOffset = -yoffset;
        var xr = -yoffset / 3;
        var yr = xoffset / 3;

        parallaxManager.xProgress = (yr / this.maxAngle);
        parallaxManager.yProgress = (xr / this.maxAngle);
        //console.log("paralax percent " + parallaxManager.xProgress + "/" + parallaxManager.yProgress);
        $(".canvasHolder").css("transform", "rotateX(" + (xr) + "deg) rotateY(" + (yr) + "deg)")
    }
    static updateRotation() {

        var xo = 35 * Math.sin(new Date().getTime() / 1000);
        var yo = 35 * Math.cos(new Date().getTime() / 1000);

        parallaxManager.setOffset(xo, yo)
    }
    static intervalId = 0;
    static startRotation() {
        parallaxManager.intervalId = window.setInterval(function() {
            parallaxManager.updateRotation();
        }, 10);
    }
    static stopRotation() {
        parallaxManager.rotateEnabled = false
        clearInterval(parallaxManager.intervalId)
    }
    static reset() {
        parallaxManager.stopRotation()
        this.enabled = false;
        $(".rotateButton").removeClass("button1-selected")
        $(".parallaxButton").removeClass("button1-selected")
        $(".paralaxHandler").css("display", "none");
        parallaxManager.xOffset = 0;
        parallaxManager.yOffset = 0;
        $(".canvasHolder").css("transform", "rotateX(0deg) rotateY(0deg)")
    }



    static smoothCalc()
    {
        parallaxManager.smooth_x = parallaxManager.smooth_x + (-(parallaxManager.smooth_x - parallaxManager.xOffset) * parallaxManager.deltaTime); //(yr / this.maxAngle);
        parallaxManager.smooth_y = parallaxManager.smooth_y + (-(parallaxManager.smooth_y - parallaxManager.yOffset) * parallaxManager.deltaTime); //(yr / this.maxAngle);
    }
}

$(document).ready(function() {
    var clickedDown = false;
    
    setInterval(parallaxManager.smoothCalc, 20);

    var lastX = 0;
    var lastY = 0;
    var xM = 25;
    var yM = 25;

    var maxM = 50;

    $(".rotateButton").click(function() {
        parallaxManager.rotateEnabled = !parallaxManager.rotateEnabled
        if (parallaxManager.rotateEnabled) {
            parallaxManager.startRotation()
            $(".rotateButton").addClass("button1-selected")
        } else {
            $(".rotateButton").removeClass("button1-selected")
            parallaxManager.stopRotation()
        }
    })


    $(".paralaxHandler").mousedown(function(e) {
        clickedDown = true;
        lastX = e.pageX;
        lastY = e.pageY;
    })
    $("body").mouseup(function(e) {
        clickedDown = false;
    })

    $("body").mousemove(function(e) {

        if (!clickedDown)
            return;
        xM += e.pageX - lastX;
        yM += e.pageY - lastY;

        lastX = e.pageX;
        lastY = e.pageY;

        if (xM > maxM)
            xM = maxM;
        else if (xM < 0)
            xM = 0;

        if (yM > maxM)
            yM = maxM;
        else if (yM < 0)
            yM = 0;

        parallaxManager.setOffset(((xM - maxM / 2) / maxM) * 100, ((yM - maxM / 2) / maxM) * 100)
        $(".paralaxHandler .paralaxThumb").css("margin", yM + "px 0px 0px " + xM + "px")
    })

    $(".parallaxButton").click(function() {
        parallaxManager.toggle();
        if (parallaxManager.enabled) {
            $(".parallaxButton").addClass("button1-selected")
            $(".paralaxHandler").css("display", "inline-block");
        } else {
            parallaxManager.reset()
        }
    })
    $(".paralaxHandler").css("display", "none");


})