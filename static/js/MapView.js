define(['leaflet', 'js/data', 'jquery'], function (L, Data, $) {
    var ChinaGeo = Data.ChinaGeo;
    var MapView = function (map) {
        this.map = map;
        var that = this;

        this.render = function () {
            var NationGeoLayer = L.geoJson(ChinaGeo, {
                onEachFeature: function (feature, layer) {
                    var label = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'label',
                            html: feature.properties.name
                        })
                    }).addTo(that.map);
                    // layer.on('click', function (e) {
                    //     var scaleLevel = 6;
                    //     if (isNationCity(feature.properties.id)) {
                    //         scaleLevel = 8;
                    //     }
                    //     var currentZoom = map.getZoom();
                    //     if (currentZoom > 8) {
                    //         scaleLevel = currentZoom;
                    //     }
                    //
                    //     map.setView([feature.properties.cp[1], feature.properties.cp[0]], scaleLevel, {animation: true});
                    //     ProvinceView(feature, NationGeoLayer)
                    // });
                },
                style: {
                    "color": "#ff7800",
                    "weight": 2,
                    "opacity": 0.2
                }
            });
            NationGeoLayer.addTo(that.map);
        };
    };

    MapView.isNationCity = function (locationID) {
        var HK = '81', Macao = '82', Beijing = '11', Tianjin = '12', Shanghai = '31';
        return $.inArray(locationID, [HK, Macao, Beijing, Tianjin, Shanghai]) !== -1;
    };

    //
    // var ProvinceView = function (feature, oldLayer) {
    //     // map.removeLayer(oldLayer);
    //     var provinceID = feature.properties.id;
    //     $.getJSON("/static/data/province/" + provinceID + ".json", function (data) {
    //         var ProvinceLayer = L.geoJson(data, {
    //             onEachFeature: function (feature, layer) {
    //                 var label = L.marker(layer.getBounds().getCenter(), {
    //                     icon: L.divIcon({
    //                         className: 'label',
    //                         html: feature.properties.name
    //                     })
    //                 }).addTo(map);
    //                 layer.on('click', function (e) {
    //                     var scaleLevel = 7;
    //                     var currentZoom = map.getZoom();
    //                     if (currentZoom > 8) {
    //                         scaleLevel = currentZoom;
    //                     }
    //
    //                     var properties = feature.properties;
    //                     if (!isNationCity(properties.id.substring(0, 2))) {
    //                         map.setView([properties.cp[1], properties.cp[0]], scaleLevel, {animation: true});
    //                         CityView(feature, ProvinceLayer)
    //                     }
    //                 });
    //             }
    //         });
    //         ProvinceLayer.addTo(map);
    //     });
    // };
    //
    // var CityView = function (feature, oldLayer) {
    //     // map.removeLayer(oldLayer);
    //     var cityID = feature.properties.id;
    //     if (cityID.length <= 4) {
    //         cityID = cityID + "00"
    //     }
    //
    //     $.getJSON("/static/data/city/" + cityID + ".json", function (data) {
    //         var CityLayer = L.geoJson(data, {
    //             onEachFeature: function (feature, layer) {
    //                 var label = L.marker(layer.getBounds().getCenter(), {
    //                     icon: L.divIcon({
    //                         className: 'label',
    //                         html: feature.properties.name
    //                     })
    //                 }).addTo(map);
    //             }
    //         });
    //         CityLayer.addTo(map);
    //     });
    // };

    return MapView;
});