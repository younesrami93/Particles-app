class error {
    static showError(message, e) {
        alert(message);
        console.log(message);
        console.log(e);
        console.log(e.stack);
    }
    static showErrorJson(json) {
        alert("error :" + json.code + "  " + json.message);
        console.log(json);
    }

}