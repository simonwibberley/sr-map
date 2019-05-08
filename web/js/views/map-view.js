/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

    app.MapView = Backbone.View.extend({
        el:"#sr-map",
        render: function() {
            
            var start = this.model.get('start');
            var end = this.model.get('end');
            var DATE_FORMAT = this.model.get('DATE_FORMAT');

            var map = this.map =  L.map(this.$el.attr('id'))
                .setView(this.model.get('startCentre'), this.model.get('startZoom'))
                .addLayer(L.tileLayer(this.model.get('layerUrl'), { maxZoom: 18 }));
            
            var timeline = this.timeline = L.timeline(app.features.toJSON(), {
                // start :start.toDate().getTime(),
                // end: end.toDate().getTime(),
                getInterval: (feature) => {
                    return {
                        start : moment(feature.properties.start).subtract(4, 'months').toDate(),
                        end : moment(feature.properties.end).add(4, 'months').toDate(),
                    };
                },
                // drawOnSetTime: false,
                pointToLayer: function(data, latlng) {
      
                    return L.circleMarker(latlng, {radius:5, color:'red'}).bindPopup(function(l) {
                        return "<ul>" +
                        // "<li>Match: " + data.metadata.with[0].match + "</li>"+
                        // "<li>Original: " + data.metadata.spanned + "</li>"+
                        "<li>Lat: " + latlng.lat + "</li>"+
                        "<li>Lng: " + latlng.lng+ "</li>"+
                        // "<li>Date: " + data.metadata.date + "</li>"+
                        // "<li>Trial: " + data.metadata.trialId + "</li>"+
                        "</ul>";
                    });
                }
            });


            var timelineControl = this.timelineControl = L.timelineSliderControl({
                // start : start.toDate().getTime(),
                // end : end.toDate().getTime(),
                // duration : daysCovered * $ctrl.timelineDuration,
        //                enableKeyboardControls: true,
                
                formatOutput: function(date){
                    return moment(date).format(DATE_FORMAT);
                }
            });

            timelineControl.addTo(map);
            timelineControl.addTimelines(timeline);

            var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({});
            mcgLayerSupportGroup.addTo(map);
            mcgLayerSupportGroup.checkIn(timeline); 
            timeline.addTo(map);

        }
        
    });
})(jQuery);