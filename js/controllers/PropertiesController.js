class PropertiesController {
    static showControllsForLayer(layer) {
        $(".controls-area").empty()
        $(".controls_unit").empty();
        $(".controls_unit").hide();
        var firstPanel = PropertiesController.showControlls(layer)
        var objects = layer.getObjectsToControll();
        for (let i = 0; i < objects.length; i++) {
            const item = objects[i];
            PropertiesController.showControlls(item)
        }
        firstPanel.click();
        $(".controls_unit").show();
    }
    static createPanel(cssClass) {
        if ($("." + cssClass).length)
            return $("." + cssClass);
        var htmlText = "<div class=\"panel " + cssClass + "\">" +
            "<img class=\"img\" src=\"images/edit.png\">" +
            "<p class=\"title\">Properties</p>" +
            "</div>";
        return $(htmlText);
    }

    static showControlls(object, select) {
        console.log(" 1 showing controls for");
        console.log(object);
        var controlCssClass = object.getControllCssClass();
        var panel = PropertiesController.createPanel("panel" + controlCssClass[0]);
        panel.find(".title").html(controlCssClass[1])
        panel.find(".img").attr("src", controlCssClass[2])
        $(".controls_unit").append(panel);
        panel.click(function() {
            var data = object.getControllsData();
            $(".selectedpanel").removeClass("selectedpanel");
            panel.addClass("selectedpanel");
            $(".controls-area").empty()
            var parentElement = PropertiesController.getController(controlCssClass[0], controlCssClass[1]);
            parentElement.find(".control_content").empty()
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                PropertiesController.createControl(object, item.controllType, item.pref, item.title, item.range, item.value, parentElement.find(".control_content"));
            }
        })
        if (select)
            panel.click();
        return panel;
    }

    static createControl(object, type, _pref, title, range, value, elementParent) {
        var pref = _pref;
        var currentObject = object;

        if (type == "slider") {
            var htmlObj = PropertiesController.getSliderControll();
            var sliderValue = htmlObj.find(".slideValue")
            sliderValue.text(value)

            htmlObj.find(".title").text(title)

            htmlObj.find(".range-slider").slider({
                range: false,
                min: range[0],
                max: range[1],
                values: [value],
                slide: function(event, ui) {
                    sliderValue.text(ui.values[0])
                    currentObject.valueChanged(pref, ui.values[0]);
                }
            });

            elementParent.append(htmlObj)
        } else if (type == "slider2") {
            var htmlObj = PropertiesController.getSlider2Controll();
            var sliderValue1 = htmlObj.find(".slideValue1")
            var sliderValue2 = htmlObj.find(".slideValue2")
            sliderValue1.text(value[0])
            sliderValue2.text(value[1])

            htmlObj.find(".title").text(title)

            htmlObj.find(".range-slider").slider({
                range: true,
                min: range[0],
                max: range[1],
                values: [value[0], value[1]],
                slide: function(event, ui) {
                    sliderValue1.text(ui.values[0])
                    sliderValue2.text(ui.values[1])
                    currentObject.valueChanged(pref, [ui.values[0], ui.values[1]]);
                }
            });

            elementParent.append(htmlObj)
        } else if (type == "number") {
            var htmlObj = PropertiesController.getNumberControll();
            htmlObj.find(".title").text(title)
            initializer.initUInput(htmlObj.find(".UNumberInput"), value, range, function(val) {
                currentObject.valueChanged(pref, val);
            })
            elementParent.append(htmlObj)
        } else if (type == "number2") {
            var htmlObj = PropertiesController.getNumber2Controll();
            htmlObj.find(".propTitle").text(title[0])
            htmlObj.find(".title").text(title[1])
            htmlObj.find(".title2").text(title[2])

            var input1 = htmlObj.find(".inp1 input");
            var input2 = htmlObj.find(".inp2 input");

            initializer.initUInput(htmlObj.find(".inp1"), value[0], [range[0], range[1]], function(val) {
                currentObject.valueChanged(pref, [parseFloat(input1.val(), 0), parseFloat(input2.val(), 0)]);
            })
            initializer.initUInput(htmlObj.find(".inp2"), value[1], [range[0], range[1]], function(val) {
                currentObject.valueChanged(pref, [parseFloat(input1.val(), 0), parseFloat(input2.val(), 0)]);
            })
            elementParent.append(htmlObj)
        } else if (type == "number4") {
            var htmlObj = PropertiesController.getNumber4Controll();
            htmlObj.find(".propTitle").text(title[0])
            htmlObj.find(".title1").text(title[1])
            htmlObj.find(".title2").text(title[2])
            htmlObj.find("._title3").text(title[3])
            htmlObj.find(".title4").text(title[4])
            var input1 = htmlObj.find(".inp1").find("input");
            var input2 = htmlObj.find(".inp2").find("input");
            var input3 = htmlObj.find(".inp3").find("input");
            var input4 = htmlObj.find(".inp4").find("input");

            var callback = function() {
                currentObject.valueChanged(pref, [parseFloat(input1.val(), 0), parseFloat(input2.val(), 0), parseFloat(input3.val(), 0), parseFloat(input4.val(), 0)]);
            }
            initializer.initUInput(htmlObj.find(".inp1"), value[0], [range[0], range[1]], callback)
            initializer.initUInput(htmlObj.find(".inp2"), value[1], [range[0], range[1]], callback)
            initializer.initUInput(htmlObj.find(".inp3"), value[2], [range[0], range[1]], callback)
            initializer.initUInput(htmlObj.find(".inp4"), value[3], [range[0], range[1]], callback)


            elementParent.append(htmlObj)
        } else if (type == "text") {
            var htmlObj = PropertiesController.getTextControll();
            htmlObj.find(".title").text(title)
            htmlObj.find(".input").val(value)
            htmlObj.find(".input").change(function(e) {
                currentObject.valueChanged(pref, $(this).val());
            });
            elementParent.append(htmlObj)
        } 
        else if (type == "info") {
            var htmlObj = PropertiesController.getInfoControll();
            htmlObj.find(".title").text(title)
            htmlObj.find(".text").text(value)
            elementParent.append(htmlObj)
        } else if (type == "values_list") {
            var htmlObj = PropertiesController.getListValuesControll();
            htmlObj.find(".title").text(title.title)
            console.log("log details")
            console.log(value)
            console.log(range)

            for (let i = 0; i < value.length; i++) {
                const item = value[i];
                PropertiesController.setupListValueItem(value,htmlObj,item,range)
            }
            htmlObj.find(".add_value_item").click(function(){
                var item = [100,[0,0,0]];
                value.push(item)
                PropertiesController.setupListValueItem(value,htmlObj,item,range)
            })
           /* htmlObj.find(".main_button").click(function(e) {
                //currentObject.valueChanged(pref, $(this).val());
                graphManager.show(value, {
                    allowMinus: range[0] < 0,
                    axis: title.titles,
                    title: title.graphTitle
                }, range, function(v) {
                    currentObject.valueChanged(pref, v);
                })
            });*/
            elementParent.append(htmlObj)
        } else if (type == "boolean") {
            var htmlObj = PropertiesController.getCheckboxController();
            htmlObj.find(".title").text(title)
            htmlObj.find(".label1").text(title)
            htmlObj.find(".checkbox").attr("checked", value)
            htmlObj.find(".checkbox").click(function(e) {
                currentObject.valueChanged(pref, this.checked);
            });
            elementParent.append(htmlObj)
        } else if (type == "image") {
            var htmlObj = PropertiesController.getImgControll();
            htmlObj.find(".title").text(title)
            var img = htmlObj.find(".img");
            img.css('background-image', 'url(' + value + ')');
            img.click(function(e) {
                imageChooser.show(function(imgJson) {
                    img.css('background-image', 'url(' + imgJson.path + ')');
                    currentObject.valueChanged(pref, [imgJson.path, imgJson.id]);
                }, "image")
            });

            elementParent.append(htmlObj)
        } else if (type == "options") {
            var htmlObj = PropertiesController.getSelectControll();
            htmlObj.find(".title").text(title)
            var input = htmlObj.find(".selectControll");

            for (let i = 0; i < range.length; i++) {
                const item = range[i];
                var o = new Option(item, item);
                $(o).html(item);
                input.append(o);
            }
            input.val(value)
            htmlObj.find(".input").change(function(e) {
                currentObject.valueChanged(pref, $(this).val());
            });
            elementParent.append(htmlObj)
        } else if (type == "images") {
            var htmlObj = PropertiesController.getParticlesImgsControll();
            htmlObj.find(".title").text(title)
            var container = htmlObj.find(".particlesHolder");

            for (let i = 0; i < value.length; i++) {
                var item = value[i];
                var $element = PropertiesController.instantiateParticleImg(item, currentObject)
                container.prepend($element);
            }

            htmlObj.find(".addParticle").click(function() {
                //
                imageChooser.show(function(img) {
                    var txtImage = currentObject.addImage(img);
                    var $element = PropertiesController.instantiateParticleImg(txtImage, currentObject)
                    container.prepend($element);
                }, "particle")
            })

            elementParent.append(htmlObj)
        } else {
            console.log("cant find controller for " + type)
        }
    }
    static instantiateParticleImg(img, obj) {
        var prtSystem = obj;
        var currentImg = img;
        var element = PropertiesController.createParticleImgItem();
        element.find(".particleItem").attr("src", img.src);
        element.find(".remove").click(function() {
            var res = prtSystem.removeImage(img);
            if (res)
                element.remove();
        });

        element.find(".colorInput").spectrum({
            type: "color",
            color: currentImg.tint,
            clickoutFiresChange:true,
            showInput: true
          });

        element.find(".colorInput").on("change.spectrum", function(e, color) {
            currentImg.tint = color.toHexString();
        });
        /*element.find(".colorInput").on("dragstop.spectrum", function(e, color) {
            img.tint = color.toHexString();
        });*/
          

        return element;
    }
    static getSliderControll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2\"></p>" +
            " <div class=\"range-slider sliderInput\"></div>" +
            "<span class=\"slideValue\">0</span>" +
            "</div>" +
            "</div>"
        return $(htmlText);
    }

    static getSlider2Controll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2\"></p>" +
            "<span class=\"slideValue1\">0</span>" +
            " <div class=\"range-slider sliderInput2\"></div>" +
            "<span class=\"slideValue2\">0</span>" +
            "</div>" +
            "</div>"
        return $(htmlText);
    }
    static getNumberControll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2\"></p>" +
            "<div class=\"UNumberInput\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>"
        "</div>";
        return $(htmlText);
    }
    static getTextControll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2\"></p>" +
            "<input type=\"text\" class=\"input inputText\"></div>"
        return $(htmlText);
    } 
    static getInfoControll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2\"></p>" +
            "<p type=\"text\" class=\"text label1\"></div>"
        return $(htmlText);
    }

    static getGraphControll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2\"></p>" +
            "<div class=\"main_button\">Edit</div></div>"
        return $(htmlText);
    }
    static getListValuesControll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2\"></p>" +
            "<div class=\"list_values_bg\">"+
            "<div class=\"content\"></div>"+
            "<div class=\"add_value_item\"><img src=\"images/add_icon.png\"></div>"+

            "</div>"+
            "</div>"
        return $(htmlText);
    }

    static getSelectControll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2 \">slider 1 </p>" +
            "<select class=\"input inputText selectControll\">" +
            "</select>" +
            "</div>"
        return $(htmlText);
    }


    static getNumber2Controll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"propTitle tinyText2\">sqsq</p>" +
            "<div class=\"inlineDisplay\">" +
            "<p class=\"title tinyText\"></p>" +

            "<div class=\"UNumberInput inp1\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +

            "</div>" +
            " <div class=\"inlineDisplay\">" +
            " <p class=\"title2 tinyText\"></p>" +

            "<div class=\"UNumberInput inp2\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +

            "</div>" +
            "</div>";
        return $(htmlText);
    }
    

    static getNumber2ControllInlineSmall() {
        var htmlText = 
            "<div class=\"inlineDisplay\">" +
            "<p class=\"title tinyText\"></p>" +

            "<div class=\"UNumberInput inp1\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +

            "</div>" +
            " <div class=\"inlineDisplay\">" +
            " <p class=\"title2 tinyText\"></p>" +

            "<div class=\"UNumberInput inp2\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +

            "</div>";
        return $(htmlText);
    }
    

    static getNumber3ControllInlineSmall() {
        var htmlText = 
        "<div class=\"input3Holder\">"+


            "<div class=\"inlineDisplay\">" +
            "<p class=\"title tinyText\"></p>" +
            "<div class=\"UNumberInput UNumberInputSmall inp1\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrowUp_s arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrowDown_s arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +



            "</div>" +
            " <div class=\"inlineDisplay\">" +
            " <p class=\"title2 tinyText\"></p>" +
            "<div class=\"UNumberInput UNumberInputSmall inp2\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrowUp_s arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrowDown_s arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +



            "</div>"+
            " <div class=\"inlineDisplay\">" +
            " <p class=\"title3 tinyText\"></p>" +
            "<div class=\"UNumberInput UNumberInputSmall inp3\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrowUp_s arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrowDown_s arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +


            "</div>" +
            "<img src=\"images/close.png\" class=\"smallClose remove\" />" +


            "</div>";
        return $(htmlText);
    }
    static getNumber4Controll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"propTitle tinyText2\">particles count</p>" +
            "<div class=\"inlineDisplay\">" +
            "    <p class=\"title1 tinyText inlineDisplay\">min : x</p>" +

            "<div class=\"UNumberInput inp1\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +

            "</div>" +
            "<div class=\"inlineDisplay\">" +
            "    <p class=\"title2 tinyText inlineDisplay\">y</p>" +

            "<div class=\"UNumberInput inp2\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +

            "</div>" +
            "<div class=\"inlineDisplay\">" +
            "    <p class=\"_title3 tinyText inlineDisplay\">max: x</p>" +

            "<div class=\"UNumberInput inp3\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +

            "</div>" +
            "<div class=\"inlineDisplay\">" +
            "    <p class=\"title4 tinyText inlineDisplay\">y</p>" +

            "<div class=\"UNumberInput inp4\">" +
            "<div class=\"arrowsHolder\">" +
            "<img src=\"images/arrow_up.png\" class=\"arrowUp arrow\">" +
            "<img src=\"images/arrow_down.png\" class=\"arrowDown arrow\">" +
            "</div>" +
            "<input type=\"text\"  min=\"-100\" max=\"100\" />" +
            "</div>" +

            "</div>" +
            "</div>";
        return $(htmlText);
    }
    static getImgControll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2\">Image Source </p>" +
            "<div class=\"controllHolder\">" +
            "<img style=\"background-image: url('uploads/4k2.jpg');\" class=\"center-cropped inlineDisplay img\">" +
            "<div class=\"inlineDisplay\">" +
            "<div class=\"pading4\">" +
            "</div>" +
            "<div class=\"pading4\">" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        return $(htmlText);
    }
    static getParticlesImgsControll() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2\">images</p>" +
            "<div class=\"inlineDisplay particlesHolder\">" +
            "<img src=\"images/add_small2.png\" class=\"inlineDisplay addParticle size50\">" +
            "</div></div>";
        return $(htmlText);
    }
    static createParticleImgItem() {
        var htmlText = "<div class=\"inlineDisplay particleItemHolder cadr1 hoverDialogButton\">" +
        "<img class=\"inlineDisplay size50  particleItem\">" +
        "<div class=\"\">" +
            "<img src=\"images/trash.png\" class=\"extra_small_icon inlineDisplay remove removeParticle \" alt=\"remove\">" +
            "<div class=\"colorPickerHolder\">"+
            "<input value=\"#000\"  class=\"colorInput\"/>"+
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>"
        return $(htmlText);
    }
    static setupListValueItem(array,parentHtmlObj,item,range)
    {
        var timeValueCallback = function(val){
            item[0] = val;
        }
        
        var val1Callback = function(val){
           // alert(item[0]+" val1 "+val)
            item[1][0] = val;
        }
        
        var val2Callback = function(val){
           // alert(item[0]+" val2 "+val)
            item[1][1] = val;
        }
        var htmlInput3 = undefined;
        var removeCallback = function()
        {
            const index = array.indexOf(item);
            if (index > -1) {
                array.splice(index, 1);
            }
        }
        htmlInput3 = PropertiesController.createListValueItem(item,range,timeValueCallback,val1Callback,val2Callback,removeCallback);
        parentHtmlObj.find(".content").append(htmlInput3);
    }
    static createListValueItem(item,range,timeValueCallback,val1Callback,val2Callback,removeCallback) {
        console.log(item);
      /*  var htmlText = "<div class=\"listItemBg\">" +
            "<input value=\"1\" type=\"text\"  class=\"input\"/>"+
            "<input value=\"1\" type=\"text\"  class=\"input\"/>"+
            "</div>"*/

        var htmlElement = PropertiesController.getNumber3ControllInlineSmall();
        initializer.initUInput(htmlElement.find(".inp1"), item[0], [0, 100], timeValueCallback)
        initializer.initUInput(htmlElement.find(".inp2"), item[1][0], [range[0], range[1]], val1Callback)
        initializer.initUInput(htmlElement.find(".inp3"), item[1][1], [range[0], range[1]], val2Callback)
        htmlElement.find(".remove").click(function(){
            removeCallback();
            htmlElement.remove();
        })
        return htmlElement;
    }
    static getCheckboxController() {
        var htmlText = "<div class=\"control\">" +
            "<p class=\"title tinyText2 \"></p>" +
            "<input type=\"checkbox\" class=\"checkbox\">" +
            "<label class=\"label1\">Fill </label>" +
            "</div>"
        return $(htmlText);
    }

    static getController(_class, title) {
        if ($("." + _class).length) {
            return $("." + _class);
        } else {
            var ctr = PropertiesController.createController(_class, title);
            $(".controls-area").append(ctr)
            return ctr;
        }
    }
    static createController(_class, title) {
        var htmlObj = "<div class=\"control_panel " + _class + "\">" +
            "<div class=\"controll_header\">" +
            "<p class=\"small_title2 inlineDisplay\">" + title + "</p>" +
            "</div>" +
            "<div class=\"control_content\">" +
            "</div>" +
            "</div>"
        return $(htmlObj);
    }


}