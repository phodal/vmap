define(['leaflet', 'js/data', 'jquery'], function (L, Data, $) {
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
            var nationProvince = '<ul data-spy="scroll" class="dropdown-menu scrollable-menu" role="menu"><li role="presentation"><a href="#province-11" role="menuitem">北京市</a></li><li role="presentation"><a href="#province-12" role="menuitem">天津市</a></li><li role="presentation"><a href="#province-13" role="menuitem">河北省</a></li><li role="presentation"><a href="#province-14" role="menuitem">山西省</a></li><li role="presentation"><a href="#province-15" role="menuitem">内蒙古自治区</a></li><li role="presentation"><a href="#province-21" role="menuitem">辽宁省</a></li><li role="presentation"><a href="#province-22" role="menuitem">吉林省</a></li><li role="presentation"><a href="#province-23" role="menuitem">黑龙江省</a></li><li role="presentation"><a href="#province-31" role="menuitem">上海市</a></li><li role="presentation"><a href="#province-32" role="menuitem">江苏省</a></li><li role="presentation"><a href="#province-33" role="menuitem">浙江省</a></li><li role="presentation"><a href="#province-34" role="menuitem">安徽省</a></li><li role="presentation"><a href="#province-35" role="menuitem">福建省</a></li><li role="presentation"><a href="#province-36" role="menuitem">江西省</a></li><li role="presentation"><a href="#province-37" role="menuitem">山东省</a></li><li role="presentation"><a href="#province-41" role="menuitem">河南省</a></li><li role="presentation"><a href="#province-42" role="menuitem">湖北省</a></li><li role="presentation"><a href="#province-43" role="menuitem">湖南省</a></li><li role="presentation"><a href="#province-44" role="menuitem">广东省</a></li><li role="presentation"><a href="#province-45" role="menuitem">广西壮族自治区</a></li><li role="presentation"><a href="#province-46" role="menuitem">海南省</a></li><li role="presentation"><a href="#province-50" role="menuitem">重庆市</a></li><li role="presentation"><a href="#province-51" role="menuitem">四川省</a></li><li role="presentation"><a href="#province-52" role="menuitem">贵州省</a></li><li role="presentation"><a href="#province-53" role="menuitem">云南省</a></li><li role="presentation"><a href="#province-54" role="menuitem">西藏自治区</a></li><li role="presentation"><a href="#province-61" role="menuitem">陕西省</a></li><li role="presentation"><a href="#province-62" role="menuitem">甘肃省</a></li><li role="presentation"><a href="#province-63" role="menuitem">青海省</a></li><li role="presentation"><a href="#province-64" role="menuitem">宁夏回族自治区</a></li><li role="presentation"><a href="#province-65" role="menuitem">新疆维吾尔自治区</a></li><li role="presentation"><a href="#province-71" role="menuitem">台湾省</a></li><li role="presentation"><a href="#province-81" role="menuitem">香港特别行政区</a></li><li role="presentation"><a href="#province-82" role="menuitem">澳门特别行政区</a></li></ul>';

            div.innerHTML = '<div class="dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">中国<span class="caret"></span></button>' + nationProvince + '</div>';

            div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
            L.DomEvent.disableScrollPropagation(div);
            L.DomEvent.disableClickPropagation(div);
            return div;
        };

        legend.addTo(that.map);
        that.bindEvents();
    };

    LinkCity.prototype.bindEvents = function () {
        $(".dropdown-menu li a").click(function(){
            var $nationButton = $(".nation-link .btn:first-child");
            $nationButton.text($(this).text());
            $nationButton.val($(this).text());
        });
    };

    return LinkCity;
});