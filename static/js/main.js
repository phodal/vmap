require.config({
    baseUrl: 'static',
    paths: {
        "jquery": "js/jquery-2.2.2.min",
        "bootstrap": "js/bootstrap.min",
        "leaflet": "leaflet/leaflet",
        "mustache": "js/mustache.min",
        "leaflet.ajax": "leaflet/plugins/leaflet.ajax.min",
        "leaflet.draw": "leaflet/plugins/leaflet.draw"
    },
    shim: {
        "bootstrap": {"deps": ['jquery']},
        "leaflet.ajax": {"deps": ['leaflet']},
        "leaflet.draw": {"deps": ['leaflet']}
    }
});

require(['js/app'], function () {

});