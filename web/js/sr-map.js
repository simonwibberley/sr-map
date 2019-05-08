var app = {}

app.MapView = Backbone.View.extend({
    template: _.template($('#map-template').html()),
    render: function () {

      var DATE_FORMAT = 'YYYY-MM-DD';

      var start = moment("1971-01-01");
      var end = moment("1971-01-01");

      this.$el.html(this.template());
      
      var map = L.map(this.$('#map')[0]).setView ([55, -4.5], 6.3);
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(map);
      

      var timelineControl = L.timelineSliderControl({
          steps: 1000,
          start : start.toDate().getTime(),
          end: end.toDate().getTime(),
          // duration : daysCovered * $ctrl.timelineDuration,
  //                enableKeyboardControls: true,
          formatOutput: function(date){
              return moment(date).format(DATE_FORMAT);
          }
      });
      var timeline = L.timeline(null, {
          start : start.toDate().getTime(),
          end: end.toDate().getTime(),
          // getInterval: getInterval,
          drawOnSetTime: false,
          pointToLayer: function(data, latlng) {
              var colour = colours[idx];

              return L.circleMarker(latlng, {radius:5, color:colour}).bindPopup(function(l) {
                  return "<ul>" +
                  "<li>Match: " + data.metadata.with[0].match + "</li>"+
                  // "<li>Original: " + data.metadata.spanned + "</li>"+
                  "<li>Lat: " + latlng.lat + "</li>"+
                  "<li>Lng: " + latlng.lng+ "</li>"+
                  // "<li>Date: " + data.metadata.date + "</li>"+
                  // "<li>Trial: " + data.metadata.trialId + "</li>"+
                  "</ul>";
              });
          }
      });

      timelineControl.addTo(map);
      timelineControl.addTimelines(timeline);
      timeline.addTo(map);

      this.map = map;

      return this;
    }
  });
  
  var mapView = new app.MapView();
  $('#container').html(mapView.render().el);

  mapView.map.invalidateSize();
