<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12>
        <div class="display-1">
          Select marker type and add it to the map
        </div>
      </v-flex>
      <v-flex xs12>
        <v-btn-toggle v-model="markerType">
          <v-btn color="primary" value="start">Start</v-btn>
          <v-btn color="warning" value="waypoint">Waypoint</v-btn>
          <v-btn color="success" value="end">End</v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <div id="mapContainer" style="width: 100%; height: 480px; background: grey"></div>
        </v-card>
      </v-flex>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 mt-2>
          <v-card v-if="route">
            <v-card-title>
              <div v-html="route.summary.text" class="headline"></div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div><b>Instructions:</b></div>
              <v-list>
                <template v-for="(step, index) in route.leg[0].maneuver">
                <v-list-tile avatar>
                  <v-list-tile-avatar>{{index+1}}</v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="step.instruction"></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      platform: null,
      maptypes: null,
      map: null,
      ui: null,
      markersGroup: null,
      routesGroup: null,
      router: null,
      markerType: 'start',
      startIcon: '<svg width="48" height="24" ' +
        'xmlns="http://www.w3.org/2000/svg">' +
        '<rect stroke="white" fill="#1b468d" x="1" y="1" width="44" ' +
        'height="22" /><text x="22" y="18" font-size="12pt" ' +
        'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
        'fill="white">Start</text></svg>',
      endIcon: '<svg width="54" height="24" ' +
        'xmlns="http://www.w3.org/2000/svg">' +
        '<rect stroke="white" fill="#1b468d" x="1" y="1" width="52" ' +
        'height="22" /><text x="26" y="18" font-size="12pt" ' +
        'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
        'fill="white">Finish</text></svg>',
        route: null
    }
  },
  computed: {
  },
  mounted: function () {
      // Initialize the platform object:
      this.platform = new H.service.Platform({
        'app_id': this.$app_id,
        'app_code': this.$app_code,
        'useCIT': true,
        'useHTTPS': true
      })

      // Configure panorama with platform credentials:
      this.platform.configure(H.map.render.panorama.RenderEngine)

      // Obtain the default map types from the platform object
      this.maptypes = this.platform.createDefaultLayers()

      // Instantiate (and display) a map object:
      this.map = new mapsjs.Map(document.getElementById('mapContainer'), this.maptypes.normal.map)
      this.map.setCenter({lat: 48.707884, lng: 21.246421})
      this.map.setZoom(10)

      // disable the default draggability of the underlying map
      // when starting to drag a marker object:
      this.map.addEventListener('dragstart', function(ev) {
        var target = ev.target;
        if (target instanceof H.map.Marker) {
          behavior.disable();
        }
      }, false);


      // re-enable the default draggability of the underlying map
      // when dragging has completed
      this.map.addEventListener('dragend', function(ev) {
        var target = ev.target;
        if (target instanceof mapsjs.map.Marker) {
          behavior.enable();
          this.calculateRoute()
        }
      }.bind(this), false);

      // Listen to the drag event and move the position of the marker
      // as necessary
      this.map.addEventListener('drag', function(ev) {
        var target = ev.target,
            pointer = ev.currentPointer;
        if (target instanceof mapsjs.map.Marker) {
          target.setPosition(this.map.screenToGeo(pointer.viewportX, pointer.viewportY));
        }
      }.bind(this), false);

      // create group for markers and add it to the map
      this.markersGroup = new H.map.Group()
      this.map.addObject(this.markersGroup)

      this.routesGroup = new H.map.Group()
      this.map.addObject(this.routesGroup)

      this.router = this.platform.getRoutingService()

      this.map.addEventListener('tap', function (evt){
        if(this.markerType) {
          var position = this.map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY)
          this.addMarkerToMap(this.markerType, position)
        }
      }.bind(this))

      //this.map = new H.Map(document.getElementById('mapContainer'), this.maptypes.normal.map)
      var mapEvents = new H.mapevents.MapEvents(this.map)
      var behavior = new H.mapevents.Behavior(mapEvents)
      this.ui = H.ui.UI.createDefault(this.map, this.maptypes)
  },
  methods: {
    addMarkerToMap(markerType, position) {
      let existingMarker
      var marker = new H.map.Marker(position)
      marker.draggable = true
      marker.label = markerType
      switch(markerType){
          case 'waypoint':
            this.markersGroup.addObject(marker)
          break
          case 'start':
            if(existingMarker = this.findStartOrEndMarker(markerType)){
                existingMarker.setPosition(position)
            } else {
              marker.icon = new H.map.Icon(this.startIcon)
              this.markersGroup.addObject(marker)
            }
            break
          case 'end':
            if(existingMarker = this.findStartOrEndMarker(markerType)){
                existingMarker.setPosition(position)
            } else {
              marker.icon = new H.map.Icon(this.endIcon)
              this.markersGroup.addObject(marker)
            }
            break
      }

      this.calculateRoute()
    },
    findStartOrEndMarker(markerType) {
      var marker = null
      this.markersGroup.forEach(item => {
        if(item.label === markerType){
          marker = item
        }
      })
      return marker
    },
    calculateRoute() {
      var startMarker = null
      var endMarker = null
      var waypoints = []

      this.markersGroup.forEach(marker => {
        switch(marker.label) {
          case 'waypoint':
            waypoints.push(marker)
            break
          case 'start':
            startMarker = marker
            break
          case 'end':
            endMarker = marker
            break
        }
      })

      if(startMarker !== null && endMarker !== null) {
        this.routesGroup.removeAll()
        let loader = this.$loading.show()
        var routingParameters = {
          'mode': 'fastest;car',
          'waypoint0': 'geo!'+ startMarker.getPosition().lat + ',' + startMarker.getPosition().lng,
          'representation': 'display',
          'routeattributes': 'waypoints,summary,shape,legs',
          'maneuverattributes': 'direction,action'
        }
        var waypointIndex = 1
        waypoints.forEach(waypoint => {
          routingParameters['waypoint' + waypointIndex] = 'geo!'+ waypoint.getPosition().lat + ',' + waypoint.getPosition().lng
          waypointIndex++
        })
        routingParameters['waypoint' + waypointIndex] = 'geo!'+ endMarker.getPosition().lat + ',' + endMarker.getPosition().lng

        this.router.calculateRoute(routingParameters, function(result) {
          var routeShape, linestring
          if(result.response && result.response.route) {
            this.route = result.response.route[0];
            routeShape = this.route.shape;
            linestring = new H.geo.LineString();

            routeShape.forEach(function(point) {
              var parts = point.split(',');
              linestring.pushLatLngAlt(parts[0], parts[1]);
            });

            // Create a polyline to display the route:
            var routeLine = new H.map.Polyline(linestring, {
              style: { lineWidth: 5 },
              arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }
            });

            this.routesGroup.addObject(routeLine)
          }
          loader.hide()
        }.bind(this), function(error) {
          console.log(error)
        })
      }
    },
    setMapBounds(route) {
      this.map.setViewBounds(route.bounds)
    }
  }
}
</script>
