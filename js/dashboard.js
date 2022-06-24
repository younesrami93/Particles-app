class dashboard {
    static user = null;
    static init() {
        $("#mainContainer").hide();
        $("#mainLoadingContainer").show();
        $.ajax({
            url: "api/get_user_details.php",
            success: function(result) {
                try {
                    console.log("user loaded " + result);
                    var res = JSON.parse(result);
                    if (res.code == 1) {
                        dashboard.loginSecces(res.result);
                    } else if (res.code == -100) {
                        dashboard.loginRequired();
                    } else {
                        /*  alert(res.code)
                          error.showErrorJson(res);*/
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });
    }
    static loginRequired() {
        window.location.href = "login.html";
    }
    static appRemoved() {
        dashboard.user.appsCount--;
        dashboard.updateCounts();
    }
    static appCreated() {
        dashboard.user.appsCount++;
        dashboard.updateCounts();
    }
    static wallpaperCreated() {
        dashboard.user.wallpapersCount++;
        dashboard.updateCounts();
    }
    static wallpaperRemoved() {
        dashboard.user.wallpapersCount--;
        dashboard.updateCounts();
    }
    static loginSecces(user) {
        if (dashboard.user == null) {
            dashboard.user = user;
            $("#mainContainer").show();
            $("#mainLoadingContainer").hide();
        }
        this.showUser();
        dashboard.loadFirstPage();
    }
    static showUser() {
        $(".profile p").text(dashboard.user.name);
        this.updateCounts();
    }
    static updateCounts() {
        $(".wallpapersCount").text(dashboard.user.wallpapersCount)
        $(".appsCount").text(dashboard.user.appsCount)
    }
    static insertParam(key, value) {
        /*  key = encodeURIComponent(key);
          value = encodeURIComponent(value);

          // kvp looks like ['key1=value1', 'key2=value2', ...]
          var kvp = document.location.search.substr(1).split('&');
          let i = 0;

          for (; i < kvp.length; i++) {
              if (kvp[i].startsWith(key + '=')) {
                  let pair = kvp[i].split('=');
                  pair[1] = value;
                  kvp[i] = pair.join('=');
                  break;
              }
          }

          if (i >= kvp.length) {
              kvp[kvp.length] = [key, value].join('=');
          }

          // can return this or...
          let params = kvp.join('&');

          // reload page with new params
          window.history.replaceState(null, null, params);*/
    }
    static loadFirstPage() {
        var data = $(".action_button-selected").attr("data");
        data = data.split(",");
        var link = data[0];
        var key = data[1];
        if (link != undefined)
            $('.content_area').load(link);
    }
    static logout() {
        $.ajax({
            url: "api/logout.php",
            success: function(result) {
                try {
                    var res = JSON.parse(result);
                    if (res.code == 1) {
                        window.location.href = "login.html";
                    } else {
                        error.showErrorJson(res);
                    }
                } catch (e) {
                    error.showError("can't parse data arrived from server", e);
                }
            }
        });
    }
}

$().ready(function() {

    $(".action_button").click(function() {
        var data = $(this).attr("data");
        if (data == undefined) {
            alert("Not configured yet")
        } else if (data == "editor") {
            var win = window.open("wlp.html?", '_blank');
            win.focus();
        } else {
            data = data.split(",");
            var link = data[0];
            var key = data[1];
            $('.content_area').load(link);
            $(".action_button-selected").removeClass("action_button-selected");
            $(this).addClass("action_button-selected");
            dashboard.insertParam("page", key);
        }

    })
    $(".logout").click(function() {
        dashboard.logout();
    })
    dashboard.init();

})