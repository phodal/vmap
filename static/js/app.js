define(['leaflet', 'jquery', 'mustache', 'js/data', 'js/MapView', 'js/LinkCity', 'bootstrap', 'leaflet.ajax', 'leaflet.draw'], function (L, $, Mustache, Data, MapView, LinkCity) {
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

    function renderUserMarker() {
        var GitHubIcon = L.icon({
            iconUrl: 'static/images/github.png',
            iconSize: [32, 32] // size of the icon
        });

        for (var i = 0; i < VIP_USERS.length; i++) {
            var marker = new L.marker(VIP_USERS[i].latLang, {icon: GitHubIcon});

            marker.user = VIP_USERS[i];
            marker.bindPopup(VIP_USERS[i].name)
                .addTo(map)
                .on('click', function (e) {
                    var popup = e.target.getPopup();
                    var githubUserName = e.target.user.username;
                    var distance = L.CRS.Earth.distance(window.currentLatLng, L.latLng(e.target._latlng));

                    var user = popup.getContent();
                    if (user.indexOf("你与") === -1 && !isNaN(distance)) {
                        var distanceWithUnits = '';
                        if (distance > 1000) {
                            distanceWithUnits = (distance / 1000).toFixed(2) + '公里'
                        } else {
                            distanceWithUnits = distance + '米'
                        }
                        var yueTemplate = '你距离{{user}}<br/>有: {{distance}} <br/> <a id="yue" class="btn btn-primary" target="_blank" href="https://github.com/{{githubUserName}}">立即去约他</a>';

                        var yueHTML = Mustache.render(yueTemplate, {
                            distance: distanceWithUnits,
                            user: user,
                            githubUserName: githubUserName
                        });
                        popup.setContent(yueHTML);
                        $.getJSON('https://api.github.com/users/' + githubUserName, function (data) {
                            var githubTemplate = '<h3>Github 信息</h3> <img src="{{data.avatar_url}}" alt="" width="140" height="140"> <br> Ta在 {{data.company}} <br /> Ta有 {{data.followers}} 个粉丝';

                            var githubHTML = Mustache.render(githubTemplate, {data: data});
                            popup.setContent(yueHTML + "<br />" + githubHTML);
                            popup.update();
                        });
                    }
                    popup.update();
                });
        }
        return marker;
    }

    renderUserMarker();

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

    // getLocation();
});