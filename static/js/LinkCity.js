define(['leaflet', 'js/data', 'jquery'], function (L, Data, $) {
    var ChinaGeo = Data.ChinaGeo;
    var LinkCity = function (map) {
        this.map = map;
    };

    LinkCity.prototype.render = function () {
        var that = this;

        var legend = L.control({position: 'topright'});
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = '<div class="dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">中国<span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#">HTML</a></li><li><a href="#">CSS</a></li> <li><a href="#">JavaScript</a></li></ul></div>';
            div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
            return div;
        };
        legend.addTo(that.map);
    };
    
    return LinkCity;
});