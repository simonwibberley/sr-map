/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

var _colors2 = {"pink-0" : "#8B2E5F",   /* Main Primary color */
"pink-1" : "#F70082",
"pink-2" : "#BF0667",
"pink-3" : "#BC528A",
"pink-4" : "#E889BB",

"orange-0" : "#AA7039", /* Main Secondary color (1) */
"orange-1" : "#FF7C00",
"orange-2" : "#EA7607",
"orange-3" : "#E6A464",
"orange-4" : "#FFC996",

"blue-0" : "#255E69",   /* Main Secondary color (2) */
"blue-1" : "#00C9EE",
"blue-2" : "#087B90",
"blue-3" : "#40828E",
"blue-4" : "#7CC2CF",

"green-0" : "#789E35",  /* Main Complement color */
"green-1" : "#A2FC00",
"green-2" : "#8ED907",
"green-3" : "#ABD65D",
"green-4" : "#D2F691"};


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


            var categoryIcons = {
                'CAMPAIGNS' : {
                    icon: 'bell',
                    color: 'pink-1'
                },
                'SERVICES-THERAPY': {
                    icon: 'bath',
                    color: 'blue-1'
                },
                'ARTS-ENTERTAINMENT': {
                    icon: 'guitar',
                    color: 'green-0'
                }, 
                'TRAVEL': {
                    icon: 'hiking',
                    color: 'green-1'
                },
                'BOOKS-PUBS': {
                    icon: 'book-open',
                    color: 'orange-0'
                },
                "BUSINESS": {
                    icon: 'business-time',
                    color: 'blue-3'
                },
                "CONFERENCES": {
                    icon: 'compress-arrows-alt',
                    color: 'green-4'
                },
                "TALKS":  {
                    icon: 'comment',
                    color: 'pink-4'
                },
                "GROUPS": {
                    icon: 'coffee',
                    color: 'orange-1'
                },
                "MEETINGS": {
                    icon: 'chair',
                    color: 'blue-0'
                },
                // Business-health - could use capsules
                "EDUCATIONAL": {
                    icon: 'chalkboard-teacher',
                    color: 'blue-4'
                },
                "ACCOM": {
                    icon: 'bed',
                    color: 'orange-3'
                },
                'PERSONAL': {
                    icon: 'address-book',
                    color: 'pink-3'
                },
                "DEMO": {
                    icon: 'broadcast-tower',
                    color: 'pink-2'
                },
                // Workshops - 'pen-square'
                "FAIRS-FESTIVALS": {
                    icon: 'music',
                    color: 'blue-3'
                },
                "SELF DEV": {
                    icon: 'people-carry',
                    color: 'green-2'
                }
            };


            var getCategories = (features) => {
                var categories = new Map();
                for(var i = 0; i < features.features.length; ++i) {
                    var feature = features.features[i];
                    var cat = feature.properties.data.categories[0];
                    if(categories.has(cat)) {
                        var feats = categories.get(cat);
                        feats.push(feature);
                        categories.set(cat, feats);
                    } else {
                        categories.set(cat, [feature]);
                    }
                }
                // categories = Array.from(categories);
                // categories.sort();
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

            var map = this.map =  L.map(this.$el.attr('id'), {
                "zoomDelta": 0.2,
                "maxZoom" : 10,
                "zoomSnap" : 0.2,
                "wheelPxPerZoomLevel" : 100
                }).setView(options['startCentre'], options['startZoom'])
                .addLayer(L.tileLayer(options['layerUrl']));
            
            var features = app.listings.toJSON();

            var categoriesFeatures = getCategories(features);
            var categories = Array.from(categoriesFeatures.keys());
            categories.sort();
            console.log(categories);





            var makeTimeline = (features) => {
                var timeline = L.timeline(features, {
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
                        var cat1 = data.properties.data.categories[0];
                        
                        var icon = categoryIcons[cat1] || {icon:'leaf', color:'green-0'};

                        var options = {
                            icon: icon.icon,
                            iconShape: 'marker',
                            borderColor : _colors2[icon.color],
                            textColor: _colors2[icon.color]
                        };

                        var tags =  data.properties.data.categories;
                        if( data.properties.data.concerns_race) {
                            tags = tags.concat(["RACE"]);
                        }
                        if( data.properties.data.concerns_sexuality) {
                            tags = tags.concat(["SEXUALITY"]);
                        }
                        return L.marker(latlng, {
                            icon : L.BeautifyIcon.icon(options),
                            tags : tags
                        }).bindPopup(function(l) {
                            return "<ul>" +
                            "<li>Info: " + data.properties.data['info'] || data.properties.data['subject'] + "</li>"+
                            "</ul>";
                        });
                    }
                });
                return timeline;
            }
                


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
                    // var color = _colors[i];
                    var cat = categories[i];

                    var color = _colors2[ (categoryIcons[cat] ? categoryIcons[cat].color: 'green-0') ];
                    var n = catDist[cat];
                    if(n>0) {
                        p += parseInt((n/markerCount)*100);
                        slices.push(color + " 0 " + p + "%");
                    }
                }
                
                var style = "background: conic-gradient("+slices.join(',')+");"
                return new L.DivIcon({ 
                    html: '<div  class="marker-cluster-sr-outer" style="'+style+'"><div class="marker-cluster-sr-inner"><span>' + markerCount + '</span></div></div>', 
                    className: 'marker-cluster-sr', 
                    iconSize: new L.Point(50, 50) 
                });
            }

            var clusterLayer = L.markerClusterGroup.layerSupport({
                iconCreateFunction : iconCreateFunction,
                maxClusterRadius : 50,
                helpingCircles : true,
                elementsPlacementStrategy : 'default',
                spiderLegPolylineOptions : {weight: 1},
                spiderfyDistanceMultiplier: 1.1,
                zoomToBoundsOnClick : false,
                spiderfyOnMaxZoom : false
            });

            clusterLayer.on('clusterclick', function(e){
                var cluster = e.layer;
                cluster.spiderfy();
            });

            // var control = L.control.layers(null, null);
                    
            var timeline = makeTimeline(features);
            timelineControl.addTimelines(timeline);
            timeline.addTo(clusterLayer);
            clusterLayer.checkIn(timeline);

            // var timelines = {};
            // for(var i = 0; i < categories.length; ++i) {
            //     var category = categories[i];
            //     var categoryFeatures = new app.Features(categoriesFeatures.get(category));
            //     if(categoryFeatures.length > 0) {

            //         var timeline = makeTimeline(categoryFeatures.toJSON());
            //         timelines[category] = timeline;
            //         timelineControl.addTimelines(timeline);
    
            //         timeline.addTo(map);
            //         var subGroup = L.featureGroup.subGroup(clusterLayer);
            //         timeline.addTo(subGroup);
            //         clusterLayer.checkIn(subGroup);
            //         subGroup.addTo(map);
            //     }
            // }

            var categoryFilter = L.control.tagFilterButton({
                data: categories,
                filterOnEveryClick: true,
            //   icon: '<i class="fa fa-suitcase"></i>',
                clearText: 'clear'
            }).addTo(map);

            categoryFilter.enableMCG(clusterLayer);

            var raceSexualityFilter = L.control.tagFilterButton({
                data: ["RACE", "SEXUALITY"],
                filterOnEveryClick: true,
            //   icon: '<i class="fa fa-suitcase"></i>',
                clearText: 'clear'
            }).addTo(map);

            raceSexualityFilter.enableMCG(clusterLayer);

            timeline.on("change", function() {
                raceSexualityFilter.resetCaches(true);
                categoryFilter.resetCaches(true);
            });

            clusterLayer.addTo(map);

            L.DomUtil.toFront(categoryFilter._container);
            // control.addTo(map);
        }
        
    });
})(jQuery);