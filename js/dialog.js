class dialog {
    static callback;
    static show(callback, title, msg, buttons) {
        dialog.callback = callback;
        $("#dialog").show();
        $(".dialogTitle").text(title);
        if (msg.length <= 0) {
            $(".msg").text("")
        } else {
            $(".msg").show();
            $(".msg").text(msg);
        }
        $(".closeDialog").click(function() {
            dialog.hide();
        })
        $(".action1").hide();
        $(".action2").hide();
        $(".action3").hide();
        for (let i = 0; i < buttons.length; i++) {
            var item = buttons[i];
            dialog.setupButton(i + 1, item)
        }
    }
    static setupButton(number, item) {
        var thisNumber = number;
        var thisItem = item;
        var action = $(".action" + number);
        action.show()
        action.text(item[0])
        action.removeClass("greenBtn")
        action.removeClass("redBtn")
        action.removeClass("blankBtn")
        action.addClass(item[1])
        action.off("click")
        action.on("click", function(e) {
            console.log("action clicked " + thisItem);
            e.stopPropagation();
            dialog.hide();
            if (dialog.callback != null) {
                var d = dialog.callback;
                dialog.callback = null;
                d(thisNumber);
                d = null;
            }
        })
    }
    static hide() {
        $("#dialog").hide();
    }
}