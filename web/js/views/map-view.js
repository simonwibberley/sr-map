/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

var _colors = [ "#000000", "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
"#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
"#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
"#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
"#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
"#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
"#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
"#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
"#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
"#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
"#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
"#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
"#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C",
"#83AB58", "#001C1E", "#D1F7CE", "#004B28", "#C8D0F6", "#A3A489", "#806C66", "#222800",
"#BF5650", "#E83000", "#66796D", "#DA007C", "#FF1A59", "#8ADBB4", "#1E0200", "#5B4E51",
"#C895C5", "#320033", "#FF6832", "#66E1D3", "#CFCDAC", "#D0AC94", "#7ED379", "#012C58"];

(function ($) {
	'use strict';

    app.MapView = Backbone.View.extend({
        el:"#sr-map",
        render: function() {

            var getCategories = (features) => {
                var categories = new Set();
                for(var i = 0; i < features.features.length; ++i) {
                    categories.add(features.features[i].properties.data.categories[0]);
                }
                categories = Array.from(categories);
                categories.sort();
                return categories;
            }

            // var scheme = new ColorScheme;
            // scheme.from_hue(21)          
            //     .scheme('tetrade')
            //     .distance(1);   
            
            // var colors = scheme.colors()

            var options = this.model.toJSON();

            var start = options['start'];
            var end = options['end'];
            var DATE_FORMAT = options['DATE_FORMAT'];

            var map = this.map =  L.map(this.$el.attr('id'))
                .setView(options['startCentre'], options['startZoom'])
                .addLayer(L.tileLayer(options['layerUrl'], { maxZoom: 18 }));
            
            var features = app.features.toJSON();

            var categories = getCategories(features);

            console.log(categories);
            
            var timeline = this.timeline = L.timeline(features, {
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


            var iconCreateFunction = (cluster) => {
                var catDist = {};
                var markers = cluster.getAllChildMarkers();
                var markerCount = cluster.getChildCount();
                var slices = [];
                for(var i = 0; i < markerCount; ++i) {
                    var marker = markers[i];
                    var cat = marker.feature.properties.data.categories[0];
                    if(cat in catDist) {
                        catDist[cat]++;
                    } else {
                        catDist[cat] = 1;
                    }
                }
                
                var p = 0;
                for(var i = 0 ; i < categories.length; ++i) {
                    var color = _colors[i];
                    var n = catDist[categories[i]];
                    if(n>0) {
                        p += parseInt((n/markerCount)*100);
                        slices.push(color + " 0 " + p + "%");
                    }
                }
                
                var style = "background: conic-gradient("+slices.join(',')+");"
                return new L.DivIcon({ 
                    html: '<div style="'+style+'"><span>' + markerCount + '</span></div>', 
                    className: 'marker-cluster' + " marker-cluster-medium", 
                    iconSize: new L.Point(40, 40) 
                });
            }

            var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({
                iconCreateFunction : iconCreateFunction
            });

            
            mcgLayerSupportGroup.addTo(map);
            mcgLayerSupportGroup.checkIn(timeline); 
            timeline.addTo(map);

        }
        
    });
})(jQuery);