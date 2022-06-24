class menuMaker {
    static callback;
    static show(tree, callback, position) {
        menuMaker.callback = callback;
        var html = $("<div class=\"menuList\" style=\"display:block\"></div>");
        for (let i = 0; i < tree.length; i++) {
            var element = tree[i];
            menuMaker.createNode(element, html);
        }
        $(".menuContainer").empty();
        $(".menuContainer").append(html);
        html.css({ top: position[1] - 10, left: position[0] - 170 });
        html.mouseleave(function() {
            menuMaker.hide();
        })

    }
    static createNode(item, parent) {
        var currentParent = parent;
        console.log("creating node for " + item.title);
        var currentItem = item;
        var htmlElement = menuMaker.createNodeHtml(currentItem)
        if (currentItem.childs != undefined && currentItem.childs.length > 0) {
            var sideList = htmlElement.find(".sideList")
            sideList.empty()
            for (let i = 0; i < currentItem.childs.length; i++) {
                const element = currentItem.childs[i];
                console.log("adding child " + element.title + " to " + currentItem.title);
                menuMaker.createNode(element, sideList);
            }
        }
        currentParent.append(htmlElement);
    }
    static createNodeHtml(item) {

        if (item.childs != undefined && item.childs.length > 0) {
            var html = "<div class=\"menuItem\">" +
                "<div class=\"sideList\"></div>" +
                "<img src=\"images/arrow_left.png\" class=\"extra_small_icon3 menuArrow inlineDisplay rightFloat\"> " + item.title + "</div>";
            return $(html);

        } else {
            var html = $("<div class = \"menuItem\">" + item.title + "</div>")
            html.click(function() {
                if (menuMaker.callback != null) {
                    menuMaker.callback(item);
                }
                menuMaker.hide();
            })
            return html;
        }
    }
    static hide() {
        $(".menuContainer").empty();
        menuMaker.callback = null;
    }
    static createObject(title, id, _obj) {
        return {
            title: title,
            id: id,
            childs: [],
            obj: _obj
        };
    }
    static createObjects(arr) {
        var items = [];
        console.log(arr);

        for (let i = 0; i < arr.length; i++) {
            var item = arr[i];
            console.log(item[0]);
            var obj = item.length >= 3 ? item[2] : null;
            items.push(menuMaker.createObject(item[0], item[1], obj))
        }
        return items;
    }
}