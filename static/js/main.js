require.config({
    baseUrl: 'static',
    paths: {
        "jquery": "js/jquery-2.2.2.min.js",
        "leaflet": "leaflet/leaflet"
    }
});

require(['leaflet'], function(leaflet) {
    console.log(leaflet);
});