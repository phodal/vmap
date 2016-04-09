define(['leaflet', 'js/data', 'jquery', 'mustache'], function (L, Data, $, Mustache) {
    var VIP_USERS = Data.VIP_USERS;

    var UserMarker = function (map) {
        this.map = map;
    };

    var handleUserClickMarker = function (e) {
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
    };
    
    UserMarker.prototype.render = function () {
        var that = this;
        var GitHubIcon = L.icon({
            iconUrl: 'static/images/github.png',
            iconSize: [32, 32] // size of the icon
        });

        for (var i = 0; i < VIP_USERS.length; i++) {
            var marker = new L.marker(VIP_USERS[i].latLang, {icon: GitHubIcon});

            marker.user = VIP_USERS[i];
            marker.bindPopup(VIP_USERS[i].name)
                .addTo(that.map)
                .on('click', function (e) {
                    handleUserClickMarker(e);
                });
        }
    };

    return UserMarker;
});