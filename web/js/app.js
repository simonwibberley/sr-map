/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function () {
    'use strict';
    var startCentre;
    var startZoom;
    if(_iframe) {
        startCentre = [53.7, -4.5]
        startZoom = 5;
    } else {
        startCentre = [55, -4.5];
        startZoom = 6.3;
    }

    // kick things off by creating the `App`
    var map = new app.Map({
        startCentre : startCentre,
        startZoom : startZoom,
        start : moment("1971-01-01"),
        end : moment("1971-01-01"),
        layerUrl : "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    });

    app.master = new app.Features();
    app.master.url = "assets/master.geo.json";

    var promise = app.master.fetch();

    promise.done( () => {
        // var appView = new app.AppView();
        var mapView = new app.MapView({model:map});
        mapView.render();
    });

});
