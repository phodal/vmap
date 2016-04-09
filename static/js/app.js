define(['leaflet', 'jquery', 'mustache', 'js/data', 'js/MapView', 'js/LinkCity', 'js/UserMarker', 'bootstrap', 'leaflet.draw'], function (L, $, Mustache, Data, MapView, LinkCity, UserMarker) {
    var VIP_USERS = Data.VIP_USERS;

    var chinaCenterPoint = [35.73, 109.59];
    var map = L.map('mapid').setView(chinaCenterPoint, 4);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'phodal.pi7oknee',
        accessToken: 'pk.eyJ1IjoicGhvZGFsIiwiYSI6ImNpbWcwaWpjcTAxdmh0aWx2MmJ0c2JnOTgifQ.043BP-oahpRBWKNW4A7Ybw'
    }).addTo(map);

    var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);

    var options = {
        position: 'topleft',
        draw: {
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
            marker: false,
            polyline: false,
            circle: false,
            rectangle: false
        }
    };

    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);

// Initialise the FeatureGroup to store editable layers
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    map.addControl(drawControl);

    map.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;

        if (type === 'marker') {
            layer.bindPopup('A popup!');
        }

        drawnItems.addLayer(layer);
    });

    var mapView = new MapView(map);
    mapView.render();

    window.currentLatLng = [];

    var linkCity = new LinkCity(map);
    linkCity.render();


    var userMarker = new UserMarker(map);
    userMarker.render();

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
        switch (error.code) {
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
        $.each(VIP_USERS, function (index, user) {
            var distance = L.CRS.Earth.distance(currentLatLng, L.latLng(user.latLang));
            if (distance <= minDistance) {
                minDistance = distance;
                minDistanceUser = user;
            }
            usersWithDistance[index].distance = distance;
        });
        var $myModal = $('#myModal');

        $myModal.find('#myModalLabel').html("Nice!");
        var template = "离你最近的大神是 {{username}}<br />距离: {{minDistance}} 米<br /> 太远了? 来添加大神 <a href='https://github.com/phodal/vmap'>V Map</a>";

        var alertBodyHTML = Mustache.render(template, {
            username: minDistanceUser.name,
            minDistance: minDistance.toFixed(2)
        });
        $myModal.find('#alert-body').html(alertBodyHTML);
        $myModal.find("a#yue").attr("href", "https://github.com/" + minDistanceUser.username);

        L.popup()
            .setLatLng(L.latLng(minDistanceUser.latLang))
            .setContent("你与" + minDistanceUser.name + "的距离<br />有: " + minDistance + "米")
            .openOn(map);

        $myModal.modal('show');
    }

    getLocation();
});