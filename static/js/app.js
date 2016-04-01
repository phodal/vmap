var map = L.map('mapid').setView([35.73, 109.59], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'phodal.pi7oknee',
    accessToken: 'pk.eyJ1IjoicGhvZGFsIiwiYSI6ImNpbWcwaWpjcTAxdmh0aWx2MmJ0c2JnOTgifQ.043BP-oahpRBWKNW4A7Ybw'
}).addTo(map);

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var options = {
    position: 'topright',
    draw: {
        polyline: {
            shapeOptions: {
                color: '#f357a1',
                weight: 10
            }
        },
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#fff', // Color the shape will turn when intersects
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#bada55'
            }
        },
        circle: false, // Turns off this drawing tool
        rectangle: {
            shapeOptions: {
                clickable: false
            }
        }
    },
    edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: false
    }
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

// Initialise the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

L.control.locate({
    position: 'topleft',  // set the location of the control
    layer: undefined,  // use your own layer for the location marker, creates a new layer by default
    drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
    follow: false,  // follow the user's location
    setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
    keepCurrentZoomLevel: false, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
    stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below)
    remainActive: false, // if true locate control remains active on click even if the user's location is in view.
    markerClass: L.circleMarker, // L.circleMarker or L.marker
    icon: 'glyphicon glyphicon-map-marker',  // class for icon, fa-location-arrow or fa-map-marker
    iconLoading: 'glyphicon glyphicon-map-marker',  // class for loading icon
    iconElementTag: 'span',  // tag for the icon element, span or i
    circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
    metric: true,  // use metric or imperial units
    onLocationError: function(err) {alert(err.message)},  // define an error callback function
    onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
        alert(context.options.strings.outsideMapBoundsMsg);
    },
    showPopup: true, // display a popup when the user click on the inner marker
    strings: {
        title: "Show me where I am",  // title of the locate control
        metersUnit: "meters", // string for metric units
        popup: "Your are here",  // text to appear if user clicks on circle
        outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds
    }
}).addTo(map);

map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'marker') {
        layer.bindPopup('A popup!');
    }

    drawnItems.addLayer(layer);
});

var isNationCity = function(locationID) {
    var HK = '81', Macao = '82', Beijing = '11', Tianjin = '12', Shanghai = '31';
    return $.inArray(locationID, [HK, Macao, Beijing, Tianjin, Shanghai]) !== -1;
};

var NationGeoLayer = L.geoJson(ChinaGeo, {
    onEachFeature: function (feature, layer) {
        var label = L.marker(layer.getBounds().getCenter(), {
            icon: L.divIcon({
                className: 'label',
                html: feature.properties.name
            })
        }).addTo(map);
        layer.on('click', function (e) {
            var scaleLevel = 6;
            if(isNationCity(feature.properties.id)) {
                scaleLevel = 8;
            }
            var currentZoom = map.getZoom();
            if(currentZoom > 8) {
                scaleLevel = currentZoom;
            }

            map.setView([feature.properties.cp[1], feature.properties.cp[0]], scaleLevel, {animation: true});
            ProvinceView(feature, NationGeoLayer)
        });
    },
    style: {
        "color": "#ff7800",
        "weight": 2,
        "opacity": 0.2
    }
});

NationGeoLayer.addTo(map);

var ProvinceView = function (feature, oldLayer) {
    // map.removeLayer(oldLayer);
    var provinceID = feature.properties.id;
    $.getJSON("/static/data/province/" + provinceID + ".json", function (data) {
        var ProvinceLayer = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                var label = L.marker(layer.getBounds().getCenter(), {
                    icon: L.divIcon({
                        className: 'label',
                        html: feature.properties.name
                    })
                }).addTo(map);
                layer.on('click', function (e) {
                    var scaleLevel = 7;
                    var currentZoom = map.getZoom();
                    if(currentZoom > 8) {
                        scaleLevel = currentZoom;
                    }

                    var properties = feature.properties;
                    if (!isNationCity(properties.id.substring(0, 2))) {
                        map.setView([properties.cp[1], properties.cp[0]], scaleLevel, {animation: true});
                        CityView(feature, ProvinceLayer)
                    }
                });
            }
        });
        ProvinceLayer.addTo(map);
    });
};

var CityView = function (feature, oldLayer) {
    // map.removeLayer(oldLayer);
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
                }).addTo(map);
            }
        });
        CityLayer.addTo(map);
    });
};

window.currentLatLng = [];

function setVipMarker() {
    var GitHubIcon = L.icon({
        iconUrl: 'static/images/github.png',
        iconSize:     [32, 32] // size of the icon
    });

    for (var i = 0; i < VIP_USERS.length; i++) {
        var marker = new L.marker(VIP_USERS[i].latLang, {icon: GitHubIcon});

        marker.user = VIP_USERS[i];
        marker.bindPopup(VIP_USERS[i].name)
            .addTo(map)
            .on('click', function (e) {
                var popup = e.target.getPopup();
                var distance = L.CRS.Earth.distance(window.currentLatLng, L.latLng(e.target._latlng));

                var user = popup.getContent();
                if (user.indexOf("你与") === -1 && !isNaN(distance)) {
                    var yueHTML = '<a id="yue" class="btn btn-primary" target="_blank" href="http://github.com/' + e.target.user.username + '">立即去约他</a>';
                    popup.setContent("你与" + user + "的距离<br />有: " + distance + "米<br/>" + yueHTML);
                }
                popup.update();
            });
    }
    return marker;
}
var marker = setVipMarker();

var $AlertBody = $('#alert-body');

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        $AlertBody.innerHTML = "Geolocation is not supported by this browser";
        $('#myModal').modal('show');
    }
}


function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            $AlertBody.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            $AlertBody.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            $AlertBody.innerHTML = "The request to get user location timed out.";
            break;
    }
    $('#myModal').modal('show');
}

function showPosition(position) {
    var usersWithDistance = VIP_USERS;
    var minDistance = 100000000;
    var minDistanceUser = VIP_USERS[0];

    var currentLatLng = L.latLng([position.coords.latitude, position.coords.longitude]);
    window.currentLatLng = currentLatLng;
    $.each(VIP_USERS, function(index, user){
        var distance = L.CRS.Earth.distance(currentLatLng, L.latLng(user.latLang));
        if(distance <= minDistance) {
            minDistance = distance;
            minDistanceUser = user;
        }
        usersWithDistance[index].distance = distance;
    });
    var $myModal = $('#myModal');

    $myModal.find('#myModalLabel').html("Nice!");
    $myModal.find('#alert-body').html("离你最近的大神是" + minDistanceUser.name + "<br />距离: " + minDistance + "米");
    $myModal.find("a#yue").attr("href", "https://github.com/" + minDistanceUser.username);

    L.popup()
        .setLatLng(L.latLng(minDistanceUser.latLang))
        .setContent("你与" + minDistanceUser.name + "的距离<br />有: " + minDistance + "米")
        .openOn(map);

    $myModal.modal('show');
}

getLocation();