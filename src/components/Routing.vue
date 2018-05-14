<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12>
        <div class="display-1 text-xs-center">
          Please select starting point
        </div>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <div id="mapContainer" style="width: 100%; height: 480px; background: grey"></div>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-list two-line>
          <template v-for="(route, index) in routes">
            <v-list-tile @click="setMapBounds(route)">
              <v-list-tile-avatar>
                <v-icon :style="{color: route.color}">label</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title><b>From:</b> {{route.from}}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary"><b>To:</b> {{route.to}}</v-list-tile-sub-title>
                <v-list-tile-sub-title v-html="route.text"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
          </template>
        </v-list>
      </v-flex>
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
      routes: []
    }
  },
  computed: {
    headquarters () {
      return this.$store.getters.headquarters
    },
    headquartersCount () {
      return this.$store.getters.headquartersCount
    }
  },
  mounted: function () {
      // Initialize the platform object:
      this.platform = new H.service.Platform({
        'app_id': 'tOPDP4GqwPojCCApkMyA',
        'app_code': 'B31er-cbmC_bBOoupZ_O2g',
        'useCIT': true,
        'useHTTPS': true
      })

      // Configure panorama with platform credentials:
      this.platform.configure(H.map.render.panorama.RenderEngine)

      // Obtain the default map types from the platform object
      this.maptypes = this.platform.createDefaultLayers()

      // Instantiate (and display) a map object:
      this.map = new mapsjs.Map(document.getElementById('mapContainer'), this.maptypes.normal.map);

      //this.map = new H.Map(document.getElementById('mapContainer'), this.maptypes.normal.map)
      var mapEvents = new H.mapevents.MapEvents(this.map)
      var behavior = new H.mapevents.Behavior(mapEvents)
      this.ui = H.ui.UI.createDefault(this.map, this.maptypes)
      this.addMarkersToMap()
  },
  methods: {
    addMarkersToMap() {
      this.markersGroup = new H.map.Group()
      this.markersGroup.addEventListener('tap', function (evt) {
        this.calculateRoutes(evt.target)
      }.bind(this))
      this.map.addObject(this.markersGroup)

      this.headquarters.forEach(item => {
          item.items.forEach(headquarter => {
            var marker = new H.map.Marker({lat: headquarter.lat, lng: headquarter.lng})
            marker.label = headquarter.address
            this.markersGroup.addObject(marker)
          })
      })

      if (this.markersGroup.getBounds()) {
        this.map.setViewBounds(this.markersGroup.getBounds())
      }
    },
    calculateRoutes(startPoint) {
      var router = this.platform.getRoutingService()
      var startPosition = startPoint.getPosition()

      if (!this.routesGroup) {
        this.routesGroup = new H.map.Group()
        this.map.addObject(this.routesGroup)
      }
      this.routesGroup.removeAll()
      this.routes = []
      var routesProcessed = 0
      let loader = this.$loading.show()
      this.headquarters.forEach((item, itemIndex, itemArray) => {
        item.items.forEach((headquarter, headquarterIndex, headquarterArray) => {
          if(startPosition.lat !== headquarter.lat && startPosition.lng !== headquarter.lng) {
            var routingParameters = {
              // The routing mode:
              'mode': 'fastest;car',
              // The start point of the route:
              'waypoint0': 'geo!'+ startPosition.lat + ',' + startPosition.lng,
              // The end point of the route:
              'waypoint1': 'geo!'+ headquarter.lat + ',' + headquarter.lng,
              // To retrieve the shape of the route we choose the route
              // representation mode 'display'
              'representation': 'display',
              'routeattributes': 'waypoints,summary,shape,legs',
              'maneuverattributes': 'direction,action'
            }
            router.calculateRoute(routingParameters, function(result) {
              routesProcessed++
              var route, routeShape, linestring
              if(result.response && result.response.route) {
              // Pick the first route from the response:
              route = result.response.route[0];
              // Pick the route's shape:
              routeShape = route.shape;

              // Create a linestring to use as a point source for the route line
              linestring = new H.geo.LineString();

              // Push all the points in the shape into the linestring:
              routeShape.forEach(function(point) {
                var parts = point.split(',');
                linestring.pushLatLngAlt(parts[0], parts[1]);
              });

              var color = this.getRandomColor()

              // Create a polyline to display the route:
              var routeLine = new H.map.Polyline(linestring, {
                style: { lineWidth: 5,  strokeColor: color },
                arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }
              });

              this.routesGroup.addObject(routeLine)
              this.routes.push({
                from: startPoint.label,
                to: headquarter.address,
                text: route.summary.text,
                color: color,
                bounds: routeLine.getBounds()
              })
              }
              if (routesProcessed === this.headquartersCount-1) {
                loader.hide()
              }
            }.bind(this), function(error) {
              console.log(error)
            })
          }
        })
      })
    },
    getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    setMapBounds(route) {
      this.map.setViewBounds(route.bounds)
    }
  }
}
</script>
