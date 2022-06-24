class loading {
    static show(msg) {
        if (msg == undefined)
            msg = "loading.."
        $("#loadingDialog").show();
        $(".msg2").text(msg);
    }
    static hide() {
        $("#loadingDialog").hide();
    }
}