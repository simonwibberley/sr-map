/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Map = Backbone.Model.extend({

		// Save all of the todo items under this example's namespace.
		// localStorage: new Backbone.LocalStorage('sr-map'),
		defaults : {
			DATE_FORMAT : 'YYYY-MM-DD'
		}
	});
})();
