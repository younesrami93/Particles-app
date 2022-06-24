class graphManager {


    static axises;
    static maxValues = [200, 100]
    static horizentalPading = 30;
    static verticalPading = 30;
    static maxWidth = 600 - this.horizentalPading * 2;
    static maxHeight = 400 - this.verticalPading * 2;
    static heightExtra = this.maxHeight / 2;
    static widthExtra = this.maxWidth / 2;
    static mode = 1;
    static axis;
    static objects;
    static points = [];
    static callbackValues;
    static selectedPoint;
    static show(_objects, graphLimits, maxValues, callback) { // each object is array , first is time, second is vectore , third is array of which axis to manage
        graphManager.callbackValues = callback;
        graphManager.points = [];
        graphManager.objects = _objects
        graphManager.maxValues = maxValues
        graphManager.axises = graphLimits.axis;
        graphManager.axis = graphLimits.axis[0];
        $(".graphTitle").text("Graph Editor : " + graphLimits.title)
        $("#graphEditor").show();
        if (graphLimits.allowMinus) {
            this.heightExtra = this.maxHeight / 2;
            $(".lineH").css("margin-top", (this.maxHeight / 2 + this.verticalPading) + "px")
        } else {
            this.heightExtra = this.maxHeight;
            $(".lineH").css("margin-top", (this.maxHeight + this.verticalPading) + "px")
        }

        graphManager.showPoints(_objects, graphLimits);


        $(".axis").empty();

        for (let i = 0; i < graphManager.axises.length; i++) {
            var item = graphManager.axises[i];
            graphManager.setupAxis(item);
        }
        $(".graphSidePanel").hide();
        this.switchToAddMode();
    }
    static setupAxis(item) {
        var axisHtml = $("<div class=\"ax\">" + item.title + "</div>");
        $(".axis").append(axisHtml);
        axisHtml.click(function() {
            graphManager.axis = item;
            graphManager.showPoints(graphManager.objects, graphManager.graphLimits);
        })
    }
    static showPoints(objects, graphLimits) {
        console.log("graphManager show ");
        console.log(objects);
        $(".pointsContainer").empty()
        for (let i = 0; i < objects.length; i++) {
            var item = objects[i];
            var x = item[0];
            var y = item[1][graphManager.axis.position];
            var p = new graphPoint(undefined, [x, y], i)
            graphManager.points.push(p);
            console.log("graphManager add point : " + x + "/" + y);
            console.log(item);
        }
    }
    static hide() {
        $("#graphEditor").hide();
    }
    static setInputsToPoint(point) {
        if (this.selectedPoint != null)
            this.selectedPoint.htmlElement.removeClass("selectedPoint");
        this.selectedPoint = point;
        this.selectedPoint.htmlElement.addClass("selectedPoint");
        this.updateInputs()
        $('.pointTimeInpt').on('change', this.timeChangedInput);
        $('.pointValueInpt').on('change', this.valueChangedInput);
        $(".graphSidePanel").show();
    }
    static updateInputs() {
        $(".pointTimeInpt").val(this.selectedPoint.cords[0])
        $(".pointValueInpt").val(this.selectedPoint.cords[1])
    }
    static timeChangedInput(e) {
        var val = parseFloat($(this).val(), 10);
        if (Number.isNaN(val))
            val = graphManager.selectedPoint.cords[0];
        graphManager.selectedPoint.cords[0] = val;
        graphManager.selectedPoint.updateCords(graphManager.selectedPoint.cords);
        $(this).val(val);

    }
    static valueChangedInput(e) {
        var val = parseFloat($(this).val(), 10);
        if (Number.isNaN(val))
            val = graphManager.selectedPoint.cords[1];
        graphManager.selectedPoint.cords[1] = val;
        graphManager.selectedPoint.updateCords(graphManager.selectedPoint.cords);
        $(this).val(val);
    }
    static switchToDeleteMode() {
        graphManager.mode = -1;
        $(".graphModeSelected").removeClass("graphModeSelected")
        $(".graphDelete").addClass("graphModeSelected")
    }
    static switchToAddMode() {
        graphManager.mode = 1;
        $(".graphModeSelected").removeClass("graphModeSelected")
        $(".graphAdd").addClass("graphModeSelected")
    }
    static sortObjects() {
        graphManager.objects.sort(graphManager.compare);
        console.log(graphManager.objects);
    }
    static compare(a, b) {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] > b[0]) {
            return 1;
        }
        return 0;
    }
    static reorderPositions() {
        for (let i = 0; i < graphManager.points.length; i++) {
            const item = graphManager.points[i];
            item.pos = i;
        }
    }
}

$(document).ready(function() {

    $(".graphDelete").click(function() {
        graphManager.switchToDeleteMode();
    })
    $(".graphAdd").click(function() {
        graphManager.switchToAddMode();
    })

    $("#graphEditor .close").click(function() {
        graphManager.hide();
    })


    /* graphManager.show([
         [0, [0, 0, 0]],
         [10, [10, 0, 0]],
         [20, [20, 0, 0]],
         [30, [30, 0, 0]],
         [40, [40, 0, 0]],
         [60, [20, 0, 0]],
         [100, [-10, 0, 0]]
     ], {
         allowMinus: true,
         axis: [{ "title": "x", "position": 0 }, { "title": "y", "position": 1 }]
     }, [100, 100])*/

    $(".pointsContainer").mousedown(function(evt) {

        if (graphManager.mode == 1) {
            var x = evt.pageX - $(this).offset().left;
            var y = evt.pageY - $(this).offset().top;
            graphManager.objects.push([0, [0, 0, 0]])
            var p = new graphPoint(undefined, [0, 0], graphManager.objects.length - 1)
                //p.lastmouseCords = [evt.pageX, evt.pageY]
                //p.clickedDown = true;
        }
    })

})

class graphPoint {
    htmlElement;
    clickedDown = false;
    cords;
    pos;
    lastmouseCords;
    delete() {
        this.htmlElement.remove();
        console.log(graphManager.objects);
        graphManager.objects.splice(this.pos, 1)
        graphManager.points.splice(this.pos, 1)
        console.log(graphManager.objects);
        graphManager.reorderPositions();
        if (graphManager.objects.length > 0) {
            if (this.pos > 0)
                graphManager.points[this.pos - 1].select()
        } else {
            $(".graphSidePanel").hide();
            graphManager.switchToAddMode();
        }
    }
    select() {
        graphManager.setInputsToPoint(this)
    }
    constructor(htmlElement, cords, pos) {
        this.pos = pos;
        if (htmlElement == undefined) {
            htmlElement = $("<div class=\"point\"></div>");
            $(".pointsContainer").append(htmlElement)
        }

        this.htmlElement = htmlElement;



        this.cords = cords;
        var thisObj = this;
        this.htmlElement.mousedown(function(e) {
            if (graphManager.mode == -1) {
                thisObj.delete();
                e.stopPropagation();
            } else {
                thisObj.clickedDown = true;
                thisObj.lastmouseCords = [e.pageX, e.pageY];
                e.stopPropagation();
                thisObj.select();
            }
        })
        $(document).mouseup(function(e) {
            if (thisObj.clickedDown) {

                thisObj.clickedDown = false;
                graphManager.sortObjects()
                e.stopPropagation()

            }
        })
        $(document).mousemove(function(e) {
            if (thisObj.clickedDown) {
                var offset = [e.pageX - thisObj.lastmouseCords[0], e.pageY - thisObj.lastmouseCords[1]]
                thisObj.cords[0] += offset[0] / graphManager.maxWidth * 100;
                thisObj.cords[1] -= offset[1] / graphManager.maxHeight * graphManager.maxValues[1];
                thisObj.updateCords(thisObj.cords);
                console.log("cords " + thisObj.cords[0] + "/" + thisObj.cords[1]);
                //thisObj.htmlElement.css("margin-left", x + "px");
                //thisObj.htmlElement.css("margin-top", y + "px");
                thisObj.lastmouseCords = [e.pageX, e.pageY];
                //graphManager.callbackValues(graphManager.objects)
                graphManager.updateInputs(thisObj)
            }
        })

        this.updateCords(cords)
        console.log("point created ");
    }
    updateCords(_cords) {
        this.cords = _cords;
        var x = (this.cords[0] / 100) * graphManager.maxWidth + graphManager.horizentalPading;
        x -= 7;

        var y = graphManager.heightExtra - (this.cords[1] / graphManager.maxValues[1]) * graphManager.maxHeight;
        y -= 7 - graphManager.verticalPading;
        this.htmlElement.css("margin-left", x + "px");
        this.htmlElement.css("margin-top", y + "px");
        graphManager.objects[this.pos][0] = this.cords[0];
        graphManager.objects[this.pos][1][graphManager.axis.position] = this.cords[1];
    }

}