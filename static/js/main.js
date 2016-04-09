require.config({
    baseUrl: 'static',
    paths: {
        "jquery": "js/lib/jquery-2.2.2.min",
        "bootstrap": "js/lib/bootstrap.min",
        "leaflet": "leaflet/leaflet",
        "mustache": "js/lib/mustache.min",
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