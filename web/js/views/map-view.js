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
            function getURLParameter(name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
            }

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
                    var colorName = categoryIcons[cat] ? categoryIcons[cat].color: 'green-0';
                    var color = _colors2[ colorName ];
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
                    iconSize: new L.Point(20, 20)
                });
            };

            var categoryIcons = {
								'Educational' : {
										icon: 'feather-alt',
										color: 'pink-1'
								},
                "Groups & Meetings": {
                    icon: 'mug-hot',
                    color: 'orange-1'
                },
                'Arts-entertainment & Media': {
                    icon: 'guitar',
                    color: 'green-0'
                },
                'Therapy & Self-dev': {
                    icon: 'bath',
                    color: 'blue-1'
                },
                "Health & Bodies" : {
                    icon: "female",
                    color: "pink-4"
                },
                "Accom": {
                    icon: 'home',
                    color: 'orange-3'
                },
                'Books & pubs': {
                    icon: 'book-open',
                    color: 'orange-0'
                },
                'WLM & Campaigns' : {
                    icon: 'bullhorn',
                    color: 'pink-1'
                },
                "Events":  {
                    icon: 'concierge-bell',
                    color: 'pink-4'
                },
                "Relationships":  {
                    icon: 'hand-holding-heart',
                    color: 'pink-4'
                },
                'Life': {
                    icon: 'balance-scale-left',
                    color: 'pink-3'
                },
                'Sex': {
                    icon: 'burn',
                    color: 'pink-3'
                },
                'Sexism': {
                    icon: 'broom',
                    color: 'pink-3'
                },
                'SR': {
                    icon: 'pen',
                    color: 'green-3'
                },
                "Work": {
                    icon: 'cog',
                    color: 'blue-3'
                },
                "International": {
                    icon: 'fist-raised',
                    color: 'green-2'
                },
                "?" : {
                    icon: "question",
                    color: "blue-2"
                }
            };

            var mapOptions = {
                zoomDelta: 0.2,
                maxZoom : 12,
                zoomSnap : 0.2,
                wheelPxPerZoomLevel : 100
            };

            var markerClusterOptions = {
                iconCreateFunction : iconCreateFunction,
                maxClusterRadius : 30,
                helpingCircles : true,
                elementsPlacementStrategy : 'default',
                spiderLegPolylineOptions : {weight: 1},
                spiderfyDistanceMultiplier: 1.1,
                zoomToBoundsOnClick : false,
                spiderfyOnMaxZoom : false,
                singleMarkerMode : false
            };


            var getCategories = (features) => {
                var categories = new Map();
                for(var i = 0; i < features.features.length; ++i) {
                    var feature = features.features[i];
                    var cats = feature.properties.data.categories;
                    for(var j = 0; j < cats.length; ++j) {
                        var cat = cats[j];
												if(cat == "") {
													continue;
												}
                        if(categories.has(cat)) {
                            var feats = categories.get(cat);
                            feats.push(feature);
                            categories.set(cat, feats);
                        } else {
                            categories.set(cat, [feature]);
                        }
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

            var map = this.map = L.map(this.$el.attr('id'), mapOptions).setView(options['startCentre'], options['startZoom'])
                .addLayer(L.tileLayer(options['layerUrl']));

            var master = app.master;
						var masterJSON = master.toJSON();

            var categoriesFeatures = getCategories(masterJSON);
            var categories = Array.from(categoriesFeatures.keys());
            //categories = categories.concat(["RACE", "SEXUALITY"])
            categories.sort();
            console.log(categories);

            var features = masterJSON;

            var pointToLayer = function(entry, latlng) {
                var data = entry.properties.data;
                var cats = data.categories;
								cats = cats.filter( (cat) => {
									return cat && cat.length > 0;
								});
                var cat1 = cats[0];
                var type = data['type'];
                var icon = categoryIcons[cat1] || {icon:'leaf', color:'green-0'};

                var options = {
                    icon: icon.icon,
                    iconShape: 'marker',
                    borderColor : _colors2[icon.color],
                    textColor: _colors2[icon.color],
                    // iconSize: L.point(15,15),
                    // iconAnchor : L.point(7,15),
                    // innerIconAnchor : L.point(0,3),
                    // innerIconStyle: "font-size:6px"
                };

                var tags =  data.categories.concat([data.type]);
                // if( data.race) {
                //     tags = tags.concat(["RACE"]);
                // }
                // if( data.sexuality) {
                //     tags = tags.concat(["SEXUALITY"]);
                // }


                var date = moment(entry.properties.date).format("MMM, YYYY");
								var marker = L.marker(latlng, {
                    icon : L.BeautifyIcon.icon(options),
                    tags : tags,
										data : data
                });
								marker.bindPopup(function(l) {
										var data1 = data['title'] || data['theme'];
										var data2 = data['desc'];

										return" <div><b><u>" + type + "</u></b> " + date + " p." + data['page'] + "</div>"+
                    "<div><b>" + data1  + "</b></div>"+
                    "<div>" + data2  + "</div>" +
                    "<div><em>" + data['location']  + "</em></div>" +
                    "<div><em>" + cats.join(",") + "</em></div>" ;
                });
                return marker;
            };


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
                    pointToLayer: pointToLayer
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


            var clusterLayer = L.markerClusterGroup.layerSupport(markerClusterOptions);

            clusterLayer.on('clusterclick', function(e){
                var cluster = e.layer;
                cluster.spiderfy();
            });

            var disableTimeline = getURLParameter("timeline") == "false";
            var timeline;
            if(disableTimeline) {
                timeline = L.geoJson(features, {pointToLayer: pointToLayer});
            } else {
                timeline = makeTimeline(features);
                timelineControl.addTo(map);
                timelineControl.addTimelines(timeline);
            }
            timeline.addTo(clusterLayer);
            clusterLayer.checkIn(timeline);

            var categoryFilter = L.control.tagFilterButton({
                data: categories,
                filterOnEveryClick: true,
            //   icon: '<i class="fa fa-suitcase"></i>',
                clearText: 'clear'
            }).addTo(map);

            categoryFilter.enableMCG(clusterLayer);

            // var raceSexualityFilter = L.control.tagFilterButton({
            //     data: ["RACE", "SEXUALITY"],
            //     filterOnEveryClick: true,
            // //   icon: '<i class="fa fa-suitcase"></i>',
            //     clearText: 'clear'
            // }).addTo(map);

            // raceSexualityFilter.enableMCG(clusterLayer);

            var letterListingFilter = L.control.tagFilterButton({
                data: ["letter", "listing"],
                filterOnEveryClick: true,
            //   icon: '<i class="fa fa-suitcase"></i>',
                clearText: 'clear'
            }).addTo(map);

            letterListingFilter.enableMCG(clusterLayer);
						var remove = [];
						var searchControl = new L.Control.Search({
							layer: clusterLayer,
							marker: false,
							autoType: false,
							position : 'topright',
							propertyName: 'data.str_id',
							filterData: function(text, records) {
								clusterLayer.addLayers(remove);
								remove = [];
								var jsons = fuse.search(text);
								var ret = {};

								var key;

								for(var i in jsons) {
									key = jsons[i].properties.data.str_id;
									if(key in records) {
										ret[ key ]= records[key];
									}
								}

								for(var i in records) {
										if(!(i in ret) ) {
											remove.push(records[i].layer);
										}
								}

								//clusterLayer.clearLayers();
								clusterLayer.removeLayers(remove);

								//clusterLayer.rem
								//console.log(jsons,ret);
								return ret;
							}
						});
						searchControl.on('search:expanded', function(e) {
							clusterLayer.addLayers(remove);
							remove = [];
						});


						searchControl.on('search:locationfound', function(e) {

							//console.log('search:locationfound', );

							//map.removeLayer(this._markerSearch)
							var marker = e.layer;
							var cluster = clusterLayer.getVisibleParent(marker);
							if(cluster.zoomToBounds) {
								cluster.zoomToBounds({
									padding: [20, 20]
								});
							}



							setTimeout(function() {
								var p = clusterLayer.getVisibleParent(marker);
								if (p.spiderfy) {
										p.spiderfy();
								}
								marker.openPopup();
							}, 1000);

							//visibleOne.spiderfy();
							//
						});

						map.addControl( searchControl );

						var fuse = new Fuse(features.features, {
							keys: [
								'properties.data.title',
								'properties.data.theme',
								'properties.data.subject',
								'properties.data.location',
								'properties.data.desc'
								//'properties.operator'
							],
							threshold : 0.1,
							tokenize: true,
						  matchAllTokens: true
						});


            timeline.on("change", function() {
                letterListingFilter.resetCaches(true);
                // raceSexualityFilter.resetCaches(true);
                categoryFilter.resetCaches(true);
            });

            clusterLayer.addTo(map);

            L.DomUtil.toFront(categoryFilter._container);
            // control.addTo(map);


						//
						//
						//
						//

						var legendData = [{
								'category': 'Educational',
								'description': 'Covers listings and letters related to the strictly educational, such as courses and workshops, as well as broadly intellectual and research-related listings and letters relating to talks, research projects and conferences.'
							},{
								'category': 'Groups & Meetings',
								'description': 'This category covers consciousness raising (a substantial section in the Classifieds, in which women either sought members for existing groups, sought information on local groups they could join, or sought co-founders for a new group); meetings (these could range from Spare Rib reader meetings to local government and smaller-scale gatherings to discuss a local or ideological issue, or to mobilise); networks (Spare Rib readers and reader-activists worked through, or set up, a wide range of networks designed for collective action or for support, particularly in professional and health-related domains); and centres (Spare Rib was a crucial forum for movement news, including the announcement of new centres, and updates and calls for help and support with existing/flailing ones).'
							},{
								'category': 'Arts-entertainment & Media',
								'description': 'Comprises listings and letters related to theatre, music, visual art and the arts more generally, as well as the media broadly understood. NB: Media often attracted attention for the way it represented women, so there may be some overlap with the section "sexism"'
							},{
								'category': 'Therapy & Self-dev',
								'description': 'Spare Rib saw a growing commercial offering of therapists and therapeutic services advertising in the Classifieds, but also more therapy and mental-health-oriented grassroots support meetings, activity and research. The section also includes self-development - assertiveness training, astrology, and meditation.'
							},{
								'category': 'Health & Bodies',
								'description': 'Indicates listings and letters related to women\'s ill health, physical wellbeing and severer issues of mental health, as well as a wide range of material relating to reproductive health, and physical self-exploration.'
							},{
								'category': 'Accom',
								'description': 'This is largely based on listings from women looking for lodgers or living arrangements and those seeking same.'
							},{
								'category': 'Books & pubs',
								'description': 'A vigorous publishing output – of books, newsletters, pamphlets, conference proceedings, magazines, zines, polemics – was a defining feature of the Women\'s Liberation Movement. So was the flourishing of feminist and feminist-friendly bookshops. This is a wide-ranging section covering all news, services, events and announcements relating to print and to bookshops. It also includes the numerous events generated by Feminist Book Fortnight (1984-1988), a yearly festival celebrating women\'s writing.'
							},{
								'category': 'WLM & Campaigns',
								'description': 'Listings and letters related to the Women\'s Liberation Movement - its development, perceived problems, strengths and suggested areas of improvement – and to campaigns conducted under its aegis, from abortion to health to employment-related.'
							},{
								'category': 'Events',
								'description': 'These cover both political events and recreational: demos and marches, and fairs and festivals.'
							},{
								'category': 'Relationships',
								'description': 'Comprised largely of personal ads in the Listings section (exclusively lesbian), and letters relating to marriage, friendships, and romance.'
							},{
								'category': 'Life',
								'description': 'A large category spanning leisure (hotels, travel, holiday, shopping) and the politics of daily life, including sexism at home, burdens of housework, motherhood, institutional sexism in areas such as benefits, tax and finance more generally. Includes letters and listings relating to domestic violence.'
							},{
								'category': 'Sex',
								'description': 'Letters and listings related to observations, questions about and experiences of sexual experience (separate from contraceptive and reproductive issues which are covered in Health & Bodies).'
							},{
								'category': 'Sexism',
								'description': 'Mostly letters calling out sexism at work, at play in other infrastructures, and in the media.'
							},{
								'category': 'SR',
								'description': '(Spare Rib) Mostly letters relating to Spare Rib, with complaints, suggestions or approval.'
							},{
								'category': 'Work',
								'description': 'Letters and listings related to workplace experience and labour conditions and politics.'
							},{
								'category': 'International',
								'description': 'Letters and listings concerned with developing world struggles, particularly Ireland, Palestine and South Africa.'
							}
						];

						var legendElements = [];

						for(var i = 0; i < legendData.length; ++i) {
								var label = legendData[i].category;
								var description = legendData[i].description;
								if(!(label in categoryIcons) ) {
									console.log(label);
								}
								var color = _colors2[categoryIcons[label].color];
								var icon = categoryIcons[label].icon;
								legendElements.push({
										label: label,
										html: '<span class="fa fa-'+icon+'">',
										style: {
												'color': color
										}
								});
								legendElements.push({
										label: '',
										html: description
								});
						}

						var legend = L.control.htmllegend({
				        position: 'bottomright',
				        legends: [{
				            name: 'Categories',
				            layer: clusterLayer,
				            elements: legendElements
				        }],
				        collapseSimple: true,
				        detectStretched: true,
				        collapsedOnInit: true,
								disableVisibilityControls: true
				    })
				    map.addControl(legend)

        }


    });
})(jQuery);
