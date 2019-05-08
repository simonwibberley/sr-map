/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Collection
	// ---------------

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	app.Features = Backbone.Collection.extend({
        url : 'assets/listings.geo.json',
		// Reference to this collection's model.
        model: app.Feature,
        toJSON : function() {
            var features = Backbone.Collection.prototype.toJSON.call(this);
            var json = {
                "type": "FeatureCollection",
                "features" : features
            }; 
            return json;
        }
	});
})();
