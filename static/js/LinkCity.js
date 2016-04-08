define(['leaflet', 'js/data', 'jquery'], function (L, Data, $) {
    function sortNumber(a,b) {
        return parseInt(a.properties.id) - parseInt(b.properties.id)
    }
    var ChinaGeo = Data.ChinaGeo.sort(sortNumber);
    var LinkCity = function (map) {
        this.map = map;
    };

    LinkCity.generateMenu = function (data) {
        var getMenuItem = function (itemData) {
            var item = $("<li role='presentation'>")
                .append(
                    $("<a>", {
                        href: '#province-' + itemData.properties.id,
                        html: itemData.properties.name,
                        role: 'menuitem'
                    }));
            return item;
        };

        var $menu = $('<ul data-spy="scroll" class="dropdown-menu scrollable-menu" role="menu"></ul>');
        $.each(data, function () {
            $menu.append(
                getMenuItem(this)
            );
        });

        return $menu;
    };

    LinkCity.prototype.render = function () {
        var that = this;

        var legend = L.control({position: 'topright'});

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'nation-link');
            var menu = LinkCity.generateMenu(ChinaGeo, div);

            div.innerHTML = '<div class="dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">中国<span class="caret"></span></button>' + menu.prop("outerHTML") + '</div>';

            div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
            L.DomEvent.disableScrollPropagation(div);
            L.DomEvent.disableClickPropagation(div);
            return div;
        };

        legend.addTo(that.map);
    };

    return LinkCity;
});