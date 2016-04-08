define(['leaflet', 'js/data', 'jquery', 'js/LinkCity'], function (L, Data, $, LinkCity) {
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
                    $(".nation-link .btn:first-child").text(feature.properties.name);
                    that.ProvinceView(feature, NationGeoLayer);
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

        function handleProvinceChange(id) {
            that.ProvinceView({
                properties: {
                    id: id
                }
            })
        }

        function handleCityChange(id) {
            that.CityView({
                properties: {
                    id: id
                }
            })
        }

        $(window).bind('hashchange', function (e) {
            var urlHash = window.location.hash;

            var isProvinceChange = urlHash.indexOf("#province") === 0;
            var isCityChange = urlHash.indexOf("#city") === 0;
            if (isProvinceChange) {
                var id = /-(\d{1,2})/.exec(urlHash)[1];
                handleProvinceChange(id);
            }
            if (isCityChange) {
                var id = /-(\d{1,4})/.exec(urlHash)[1];
                if (!MapView.isNationCity(id.substring(0, 2))) {
                    handleCityChange(id);
                }
            }
        });
    };

    function createCitiesDropdown(data) {
        var cityMenu = LinkCity.generateMenu(data.features, '#city').html();
        var cityHtml = '<div class="city-dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">市/区<span class="caret"></span></button><ul data-spy="scroll" class="city-dropdown dropdown-menu scrollable-menu" role="menu">' + cityMenu + '</ul></div>';

        if ($("div.city-dropdown").length) {
            $("div.city-dropdown").remove()
        }
        $(cityHtml).insertAfter(".nation-dropdown");

        $(".city-dropdown li a").click(function () {
            var $nationButton = $(".nation-link .city-dropdown .btn:first-child");
            $nationButton.text($(this).text());
            $nationButton.val($(this).text());
        });
    }

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
            createCitiesDropdown(data);

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

                        $(".nation-link .city-dropdown .btn:first-child").text(feature.properties.name);

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


    function createZonesDropdown(data) {
        var cityMenu = LinkCity.generateMenu(data.features, '#zone').html();
        var cityHtml = '<div class="zone-dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">区/县<span class="caret"></span></button><ul data-spy="scroll" class="zone-dropdown-ul dropdown-menu scrollable-menu" role="menu">' + cityMenu + '</ul></div>';

        if ($("div.zone-dropdown").length) {
            $("div.zone-dropdown").remove()
        }
        $(cityHtml).insertAfter("div.city-dropdown");

        $(".zone-dropdown li a").click(function () {
            var $nationButton = $(".nation-link .zone-dropdown .btn:first-child");
            $nationButton.text($(this).text());
            $nationButton.val($(this).text());
        });
    }

    MapView.prototype.CityView = function (feature, oldLayer) {
        // map.removeLayer(oldLayer);
        var that = this;
        var cityID = feature.properties.id;
        if (cityID.length <= 4) {
            cityID = cityID + "00"
        }

        $.getJSON("/static/data/city/" + cityID + ".json", function (data) {
            createZonesDropdown(data);
            var CityLayer = L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                    var label = L.marker(layer.getBounds().getCenter(), {
                        icon: L.divIcon({
                            className: 'label',
                            html: feature.properties.name
                        })
                    }).addTo(that.map);
                    layer.on('click', function (e) {
                        $(".nation-link .zone-dropdown .btn:first-child").text(feature.properties.name);
                    });
                }
            });
            CityLayer.addTo(that.map);
        });
    };

    return MapView;
});