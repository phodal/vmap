define(['leaflet', 'js/data', 'jquery'], function (L, Data, $) {
    var ChinaGeo = Data.ChinaGeo;
    var MapView = function (map) {
        this.map = map;
        this.MapStyle = {
            "color": "#ff7800",
            "weight": 2,
            "opacity": 0.2
        };
        this.bindEvents();
    };

    MapView.prototype.render = function () {
        var that = this;

        var NationGeoLayer = L.geoJson(ChinaGeo, {
            onEachFeature: function (feature, layer) {
                var label = L.marker(layer.getBounds().getCenter(), {
                    icon: L.divIcon({
                        className: 'label',
                        html: feature.properties.name
                    })
                }).addTo(that.map);
                layer.on('click', function (e) {
                    that.ProvinceView(feature, NationGeoLayer)
                });
            },
            style: that.MapStyle
        });
        NationGeoLayer.addTo(that.map);
    };

    MapView.isNationCity = function (locationID) {
        var HK = '81', Macao = '82', Beijing = '11', Tianjin = '12', Shanghai = '31';
        return $.inArray(locationID, [HK, Macao, Beijing, Tianjin, Shanghai]) !== -1;
    };

    MapView.prototype.bindEvents = function () {
        var that = this;

        function handleProvinceChange(urlHash) {
            var id = /-(\d{1,2})/.exec(urlHash)[1];

            that.ProvinceView({
                properties: {
                    id: id
                }
            })
        }

        $(window).bind('hashchange', function (e) {
            var urlHash = window.location.hash;

            var isProvinceChange = urlHash.indexOf("#province") === 0;
            if (isProvinceChange) {
                handleProvinceChange(urlHash);
            }
        });
    };

    MapView.prototype.ProvinceView = function (feature, oldLayer) {
        // map.removeLayer(oldLayer);
        var that = this;
        var provinceID = feature.properties.id;
        $.getJSON("/static/data/province/" + provinceID + ".json", function (data) {
            var scaleLevel = 6;
            if (MapView.isNationCity(provinceID)) {
                scaleLevel = 8;
            }
            var currentZoom = that.map.getZoom();
            if (currentZoom > 8) {
                scaleLevel = currentZoom;
            }

            that.map.setView([data.cp[1], data.cp[0]], scaleLevel, {animation: true});

            var ProvinceLayer = L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                    var label = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'label',
                            html: feature.properties.name
                        })
                    }).addTo(that.map);
                    layer.on('click', function (e) {
                        var scaleLevel = 7;
                        var currentZoom = that.map.getZoom();
                        if (currentZoom > 8) {
                            scaleLevel = currentZoom;
                        }

                        var properties = feature.properties;
                        if (!MapView.isNationCity(properties.id.substring(0, 2))) {
                            that.map.setView([properties.cp[1], properties.cp[0]], scaleLevel, {animation: true});
                            that.CityView(feature, ProvinceLayer)
                        }
                    });
                }
            });
            ProvinceLayer.addTo(that.map);
        });
    };

    MapView.prototype.CityView = function (feature, oldLayer) {
        // map.removeLayer(oldLayer);
        var that = this;
        var cityID = feature.properties.id;
        if (cityID.length <= 4) {
            cityID = cityID + "00"
        }

        $.getJSON("/static/data/city/" + cityID + ".json", function (data) {
            var CityLayer = L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                    var label = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'label',
                            html: feature.properties.name
                        })
                    }).addTo(that.map);
                }
            });
            CityLayer.addTo(that.map);
        });
    };

    return MapView;
});