class initializer {
    static setInpuValue(input, val) {

        input.val(val)
        input.trigger("change")
    }
    static initUInput(element, value, range, changeCallback) {
        var mouseDown = false;
        var clickPos = 0;
        var arrowUp = element.find(".arrowUp")
        var arrowDown = element.find(".arrowDown")
        var input = element.find("input");
        input.focus(function() {
            $(this).parent().addClass("selected-Uinput")
            $(this).parent().find(".arrowsHolder").addClass("selected-Uinput-arrowsHolder")
        })
        input.blur(function() {
            $(this).parent().removeClass("selected-Uinput")
            $(this).parent().find(".arrowsHolder").removeClass("selected-Uinput-arrowsHolder")
        })
        input.mousedown(function(e) {
            mouseDown = true;
            clickPos = e.pageY;
            document.body.style.cursor = "row-resize"

        })
        $("body").mouseup(function() {
            mouseDown = false;
            document.body.style.cursor = "auto"
        })
        $("body").mousemove(function(e) {
            if (mouseDown) {
                var marge = clickPos - e.pageY;
                clickPos = e.pageY;
                initializer.setInpuValue(input, parseFloat(input.val()) + marge)
            }


        })
        arrowUp.click(function() {
            initializer.setInpuValue(input, parseFloat(input.val()) + 1)
        })
        arrowDown.click(function() {
            initializer.setInpuValue(input, parseFloat(input.val()) - 1)
        })
        input.val(value)
        input.attr("min", range[0])
        input.attr("max", range[1])
        input.change(function() {
            var val = parseFloat($(this).val(), 0);
            if (Number.isNaN(val))
                val = 0;
            else if (val == undefined)
                val = 0;

            if (val > $(this).attr("max"))
                val = $(this).attr("max");
            else if (val < $(this).attr("min"))
                val = $(this).attr("min");
            val = Math.round(val * 10) / 10
            $(this).val(val)
            if (changeCallback != null)
                changeCallback(val);
            console.log("new val " + val);
        })
        input.keyup(function(e) {
            if (e.key == "ArrowUp") {
                initializer.setInpuValue(input, parseFloat(input.val()) + 1)
            } else if (e.key == "ArrowDown") {
                initializer.setInpuValue(input, parseFloat(input.val()) - 1)
            }
            console.log(e);
            e.stopPropagation()

        })

    }
}
$().ready(function() {
    initializer.initUInput($(".inp1"), 5, function(val) {
        alert("inp1 " + val);
    })

    initializer.initUInput($(".inp2"), 10, function(val) {
        alert("inp2 " + val);
    })



    $('body').on({
        click: function(e) {
            $(this).parent().parent().find(".control_content").toggle();
            var display = $(this).parent().parent().find(".control_content").css("display");
            if (display == "none") {
                $(this).css({
                    'transform': 'rotate(0deg)'
                });
            } else {
                $(this).css({
                    'transform': 'rotate(90deg)'
                });
            }
            e.stopPropagation();

        }
    }, '.panel_hide_btn');

    $('body').on({
        click: function(e) {
            var display = $(this).find(".control_content").css("display");
            if (display == "none") {
                $(this).find(".panel_hide_btn").click()
            }
        }
    }, '.control_panel');

    $(".paralaxStrength .sliderControl").slider({
        range: false,
        min: 20,
        max: 100,
        value: 50,
        slide: function(event, ui) {
            $(this).parent().find(".slideValue").text(ui.value/10)
            parallaxManager.strength = (ui.value /50)
            console.log("parallax strength :"+parallaxManager.strength )
        }
    });

    $(".paralaxSmooth .sliderControl").slider({
        range: false,
        min: 1,
        max: 100,
        value: 70,
        slide: function(event, ui) {
            $(this).parent().find(".slideValue").text(ui.value/10)
            parallaxManager.deltaTime = (100-(ui.value>97?97:ui.value)) / 100
        }
    });

    $(".paralaxReset .sliderControl").slider({
        range: false,
        min: 0,
        max: 100,
        value: 50,
        slide: function(event, ui) {
            $(this).parent().find(".slideValue").text(ui.value)
            parallaxManager.resetSmoothness = ui.value;

        }
    });

    $(".parallaxResetCheckbox").change(function(e)
    {
        console.log(e)
        parallaxManager.allwaysReset = $(this).is(":checked");
    })


    $(".closeWallpaperSettings").click(function()
    {
        $("#wallpaperSettings_container").hide();
    })
    $(".wallpaper_settings ").click(function()
    {
        $("#wallpaperSettings_container").show();
    })
})