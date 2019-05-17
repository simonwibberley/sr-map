/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function () {
	'use strict';

    // kick things off by creating the `App`
    var map = new app.Map({
        startCentre : [55, -4.5],
        startZoom : 6.3,
        start : moment("1971-01-01"),
        end : moment("1971-01-01"),
        layerUrl : "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    });

    app.listings = new app.Features();
    app.listings.url = "assets/listings.geo.json";

    app.letters = new app.Features();
    app.letters.url = "assets/letters.geo.json";
    
    var promise = app.listings.fetch();
    app.letters.fetch();

    promise.done( () => {
        var appView = new app.AppView();
        var mapView = new app.MapView({model:map});
        mapView.render();
    });
  
});
