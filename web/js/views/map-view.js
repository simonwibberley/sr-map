/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

var _colors3 = {
"dull-green" : "#A8D08D",
"pale-green" : "#A8D08D",
"bright-green" : "#00FA00",
"dark-green" : "#009051",
"brown" : "#AB7942",
"blue" : "#00B0F0",
"pale-red" : "#FF7E79",
"birght-orange" : "#FFC000",
"bright-pink" : "#FF40FF",
"green" : "#ED7D31",
"orange" : "#FFC000",
"turquoise" : "#00FDFF",
"pale-blue" : "#76D6FF",
"pale-orange" : "#F7CAAC",
"purple" : "#7030A0",
"pale-purple" : "#D883FF",
"pale-pink" : "#FF8AD8",
"dark-blue" : "#2F5496",
"bright-pink" : "#FF40FF"
};


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


	//don't populate input with selected item, and don't clear results
	var customSearchControl_createTip = function(text, val) {//val is object in recordCache, usually is Latlng
			var tip;

			if(this.options.buildTip)
			{
				tip = this.options.buildTip.call(this, text, val); //custom tip node or html string
				if(typeof tip === 'string')
				{
					var tmpNode = L.DomUtil.create('div');
					tmpNode.innerHTML = tip;
					tip = tmpNode.firstChild;
				}
			}
			else
			{
				tip = L.DomUtil.create('li', '');
				tip.innerHTML = text;
			}

			L.DomUtil.addClass(tip, 'search-tip');
			tip._text = text; //value replaced in this._input and used by _autoType

			if(this.options.tipAutoSubmit)
				L.DomEvent
					.disableClickPropagation(tip)
					.on(tip, 'click', L.DomEvent.stop, this)
					.on(tip, 'click', function(e) {
						// this._input.value = text;
						this._inputValue = text;
						this._handleAutoresize();
						this._input.focus();
						// this._hideTooltip();
						this._handleSubmit();
					}, this);

			return tip;
		};

		//on case 13 'enter' _fillRecordsCache instead of _handleSubmit
	var customSearchControl_handleKeypress = function (e) {	//run _input keyup event
			var self = this;

			switch(e.keyCode)
			{
				case 27://Esc
					this.collapse();
				break;
				case 13://Enter
					// if(this._countertips == 1 || (this.options.firstTipSubmit && this._countertips > 0)) {
	        //   			if(this._tooltip.currentSelection == -1) {
					// 		this._handleArrowSelect(1);
	        //   			}
					// }
					// this._handleSubmit();	//do search
					this.fire("search:cancel");
					this._input.value = this._input.value.trim();
	        self._fillRecordsCache();
				break;
				case 38://Up
					this._handleArrowSelect(-1);
				break;
				case 40://Down
					this._handleArrowSelect(1);
				break;
				case  8://Backspace
				case 45://Insert
				case 46://Delete
					this._autoTypeTmp = false;//disable temporarily autoType
				break;
				case 37://Left
				case 39://Right
				case 16://Shift
				case 17://Ctrl
				case 35://End
				case 36://Home
				break;
				default://All keys
					if(this._input.value.length)
						this._cancel.style.display = 'block';
					else
						this._cancel.style.display = 'none';

					if(this._input.value.length >= this.options.minLength)
					{
						clearTimeout(this.timerKeypress);	//cancel last search request while type in
						this.timerKeypress = setTimeout(function() {	//delay before request, for limit jsonp/ajax request

							this._input.value = this._input.value.trim();
							self._fillRecordsCache();

						}, this.options.delayType);
					}
					else
						this._hideTooltip();
			}

			this._handleAutoresize();
		};

		var customSearchControl_handleSubmit =  function() {	//button and tooltip click and enter submit

			// this._hideAutoType();

			this.hideAlert();
			// this._hideTooltip();

			if(this._input.style.display == 'none')	//on first click show _input only
				this.expand();
			else
			{
				if(this._input.value === '')	//hide _input only
					this.collapse();
				else
				{
					var loc = this._getLocation(this._inputValue);
					// var loc = this._getLocation(this._input.value);

					if(loc===false) {
						this._input.value = this._input.value.trim();
						this._fillRecordsCache();
					} else {
						this.showLocation(loc, this._input.value);
						this.fire('search:locationfound', {
								latlng: loc,
								text: this._input.value,
								layer: loc.layer ? loc.layer : null
							});
					}
				}
			}
		};


		//don't collapse if input present
		var customSearchControl_collapse = function() {
			if(this._input.value) {
				return this;
			} else {
				this._hideTooltip();
				this.cancel();
				this._alert.style.display = 'none';
				this._input.blur();
				if(this.options.collapsed)
				{
					this._input.style.display = 'none';
					this._cancel.style.display = 'none';
					L.DomUtil.removeClass(this._container, 'search-exp');
					if (this.options.hideMarkerOnCollapse) {
						this._map.removeLayer(this._markerSearch);
					}
					this._map.off('dragstart click', this.collapse, this);
				}
				this.fire('search:collapsed');
				return this;
			}

		}

		// _createButton: function (title, className) {
		// 	var button = L.DomUtil.create('a', className, this._container);
		// 	button.href = '#';
		// 	button.title = title;
		//
		// 	L.DomEvent
		// 		.on(button, 'click', L.DomEvent.stop, this)
		// 		.on(button, 'click', this._handleSubmit, this)
		// 		.on(button, 'focus', this.collapseDelayedStop, this)
		// 		.on(button, 'blur', this.collapseDelayed, this);
		//
		// 	return button;
		// },

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
                    var color = _colors3[ colorName ];
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
								'Arts & Culture' : {
										icon: 'theater-masks',
										color: 'dull-green'
								},
								"Books & Publications": {
								    icon: 'book-open',
								    color: 'brown'
								},
								'Business & Finance': {
								    icon: 'pound-sign',
								    color: 'dark-blue'
								},
								"Discrimination & Violence" : {
								    icon: "exclamation-triangle",
								    color: "pale-red"
								},
								"Education, Training & Research": {
								    icon: 'feather-alt',
								    color: 'bright-pink'
								},
								'Events & Meetings': {
								    icon: 'bullhorn',
								    color: 'turquoise'
								},
								'Groups, Networks & Centres' : {
								    icon: 'coffee',
								    color: 'pale-blue'
								},
								"Health, Sex & Therapy":  {
								    icon: 'female',
								    color: 'dark-green'
								},
								"International":  {
										icon: 'home',
										color: 'orange'
								},
								"Housing & Accommodation":  {
								    icon: 'home',
								    color: 'orange'
								},
								'Lifestyle & Leisure': {
								    icon: 'balance-scale-right',
								    color: 'purple'
								},
								'Relationships & Family': {
								    icon: 'hand-holding-heart',
								    color: 'pale-pink'
								},
								'SR': {
								    icon: 'pen',
								    color: 'pale-purple'
								},
								"WLM & Campaigns": {
								    icon: 'fist-raised',
								    color: 'bright-green'
								},
								"Work": {
								    icon: 'cog',
								    color: 'blue'
								}
};

            var mapOptions = {
                zoomDelta: 0.2,
                maxZoom : 12,
                zoomSnap : 0.2,
                wheelPxPerZoomLevel : 100,
								// zoomControl: false
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

						var makePopupCatList = function(cats) {
								var list ='<ul class="fa-ul cat-list">';
								for( var i in cats) {
										var cat = cats[i].trim();
										var icon = categoryIcons[cat].icon;
										var colour =  _colors3[categoryIcons[cat].color];
										var entry = `<li><i class="fa-li fa fa-${icon}" style="color:${colour};"></i>&nbsp;${cat}</li>`;
										list += entry;
								}
								list += "</ul>";

								return list;
						};

            var pointToLayer = function(entry, latlng) {
                var data = entry.properties.data;
                var cats = data.categories;
								cats = cats.filter( (cat) => {
									return cat && cat.length > 0;
								});
                var cat1 = cats[0];
                var type = data['type'];
                var icon = categoryIcons[cat1] || {icon:'leaf', color:'green-0'};
								var textColor, borderColor;
								textColor = borderColor = cats.length > 1 ? categoryIcons[cats[1]].color : icon.color;
								if(cats.length > 2 ) {
									borderColor = categoryIcons[cats[2]].color;
								}

								// var innerIconStyle = iconStyle;
                var options = {
                    icon: icon.icon,
                    iconShape: 'marker',
                    borderColor : _colors3[borderColor],
                    textColor: _colors3[textColor],
										// iconStyle : iconStyle,
										// innerIconStyle : innerIconStyle,
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

										var catList = makePopupCatList(cats);

										return "<div><b><u>" + type + "</u></b> " + date + " #" + data["issue"] + " p." + data['page'] + "</div>"+
                    "<div><b>" + data1  + "</b></div>"+
                    "<div>" + data2  + "</div>" +
										"<div><em>" + data['location']  + "</em></div>" +
                    "<div>" + catList + "</div>" ;
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
							minLength : 999,
							firstTipSubmit : false,
							// tipAutoSubmit : false,
							autoCollapse : false,
							textErr : 'No entries found',
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

						var monkeyPatchSearchControl = function(searchControl) {
								searchControl._handleKeypress = customSearchControl_handleKeypress;
								searchControl._handleSubmit = customSearchControl_handleSubmit;
								searchControl._createTip = customSearchControl_createTip;
								searchControl.collapse = customSearchControl_collapse;

						};

						monkeyPatchSearchControl(searchControl);

						// searchControl.on('search:expanded', function(e) {
						// 	clusterLayer.addLayers(remove);
						// 	remove = [];
						// });

						searchControl.on('search:cancel', function(e) {
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
							isCaseSensitive : true,
							threshold : 0.01,
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


						var makeLegend = function( ) {
							var legendData = [{
									'category': 'Arts & Culture',
									'description': 'Comprises listings and letters related to theatre, music, film, visual art and the arts more generally, including art exhibitions. Literature and other writing including poetry is categorized under Books & Publications.'
								},{
									'category': 'Books & Publications',
									'description': "A vigorous publishing output – of books, newsletters, pamphlets, conference proceedings, magazines, zines, polemics – was a defining feature of the Women's Liberation Movement. So was the flourishing of feminist and feminist-friendly bookshops. This is a wide-ranging section covering all letters, news, services, events and announcements relating to print and to bookshops, literature, poetry and creative writing. It also includes the numerous events generated by the Feminist Book Fortnight (1984-1988), a yearly festival celebrating women's writing. References to the media, which tend to refer to instances of sexism or discrimination in the media, can be found under ‘Discrimination & Violence’."
								},{
									'category': 'Business & Finance',
									'description': 'Covers letters and listings relating to personal finance (including tax affairs, pensions and benefits), activist businesses (including booksellers, therapists, feminist merchandise, collectives and cooperatives) and sources of support for feminist ventures (e.g. SR revenue, sources of funding for women’s centres). Mainly listings advertising small businesses (often through job advertisements, also categorised under ‘Work’), demonstrating the existence and wide geographical distribution of a feminist economic base. '
								},{
									'category': 'Discrimination & Violence',
									'description': 'Mainly letters calling out various forms of discrimination (sexism, racism, classism, ableism) at work, at play within other infrastructures, and in the media; as well as letters and listings relating to domestic violence, racial violence, sexual violence and other forms of abuse. There are many references to discrimination in the media which fall under this category.'
								},{
									'category': 'Education, Training & Research',
									'description': 'Covers listings and letters related to schools, educational courses, training and workshops, as well as broadly intellectual and research-related listings and letters relating to talks, seminars, classes, research projects and courses.'
								},{
									'category': 'Events & Meetings',
									'description': 'Covers both political events and recreational: political conferences, demonstrations and marches, fairs and festivals, and smaller meetings (these could range from Spare Rib reader meetings to local government and smaller-scale gatherings to discuss a local or ideological issue, or to mobilise). Educational talks, workshops, seminars and courses are categorized under ‘Education, Training & Research’, and art exhibitions and concerts under ‘Arts & Culture’.'
								},{
									'category': 'Groups, Networks & Centres',
									'description': 'Covers consciousness raising (a substantial section in the listings, in which women either sought members for existing groups, sought information on local groups they could join, or sought co-founders for a new group); networks (Spare Rib readers and reader-activists worked through, or set up, a wide range of networks designed for collective action or for support, particularly in professional and health-related domains); and women’s centres (Spare Rib was a crucial forum for movement news, including the announcement of new centres, and updates and calls for help and support with existing/flailing ones).'
								},{
									'category': 'Health, Sex & Therapy',
									'description': "Indicates listings and letters related to women's ill health, physical wellbeing and issues of mental health, as well as a wide range of material relating to sexual experience, reproductive health and physical self-exploration. Spare Rib saw a growing commercial offering of therapists and therapeutic services advertising in the listings, but also more therapy and mental-health-oriented grassroots support meetings, activity and research. The section also includes self-development - assertiveness training, astrology, and meditation."
								},{
									'category': 'Housing & Accommodation',
									'description': 'Largely based on listings from women looking for lodgers or living arrangements and those seeking same. This section also covers letters or listings that address the politics of housing, but not holiday homes.'
								},{
									'category': 'Lifestyle & Leisure',
									'description': 'Spans leisure (hotels, travel, holiday, shopping, lesbian clubs and nightlife) and lifestyle choices (communal living, hobbies, fashion), as well as holiday homes.'
								},{
									'category': 'Relationships & Family',
									'description': 'Comprised largely of personal adverts/lonely hearts (largely lesbian) in the listings section, and letters relating to marriage, friendships, and romance, but also to motherhood, parenting and familial issues.'
								},{
									'category': 'SR',
									'description': 'Mostly letters relating to Spare Rib, with complaints, corrections, suggestions or approval.'
								},{
									'category': 'WLM & Campaigns',
									'description': "Listings and letters related to the Women's Liberation Movement (its development, perceived problems, strengths and suggested areas of improvement), campaigns conducted under its aegis, from abortion to health to employment-related, and to related social movements."
								},{
									'category': 'Work',
									'description': 'Letters and listings related to workplace experience, recruitment, volunteering, labour conditions and trade unions. There is some overlap with the ‘Business and Finance’ category as feminist businesses frequently advertise in SR, but a large proportion of job advertisements are in the public sector (social work, local government).'
								}
							];

							var legendElements = [];

							for(var i = 0; i < legendData.length; ++i) {
									var label = legendData[i].category;
									var description = legendData[i].description;
									if(!(label in categoryIcons) ) {
										console.log(label);
									}
									if(!(label in categoryIcons) ) {
										console.log(label)

									}
									var color = _colors3[categoryIcons[label].color];
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
						};


						if(_full) {
							makeLegend();
						}

        }


    });
})(jQuery);
