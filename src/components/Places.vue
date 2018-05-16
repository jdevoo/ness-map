<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12>
        <div class="display-1 text-xs-center">
          Select one from the markers for start
        </div>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <div id="mapContainer" style="width: 100%; height: 480px; background: grey"></div>
        </v-card>
      </v-flex>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 mt-2>
          <v-card v-if="selectedPlace">
            <v-card-text>
              <div class="subheading">{{selectedPlace.title}}</div>
              <div><b>Category:</b> {{selectedPlace.category.title}}</div>
              <div><b>Distance:</b> {{selectedPlace.distance}} m</div>
              <div><b>Average rating:</b> {{selectedPlace.averageRating}}</div>
              <div></div>
              <div></div>
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
      explore: null,
      placesGroup: null,
      selectedPlace: null
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
      this.map = new mapsjs.Map(document.getElementById('mapContainer'), this.maptypes.normal.map);

      this.explore = new H.places.Around(this.platform.getPlacesService());
      var mapEvents = new H.mapevents.MapEvents(this.map)
      var behavior = new H.mapevents.Behavior(mapEvents)
      this.ui = H.ui.UI.createDefault(this.map, this.maptypes)
      this.addMarkersToMap()
  },
  methods: {
    addMarkersToMap() {
      this.markersGroup = new H.map.Group()
      this.markersGroup.addEventListener('tap', function (evt) {
        // zoom to the position
        var position = evt.target.getPosition()
        this.map.setCenter({lng: position.lng, lat: position.lat})
        this.map.setZoom(15,true)

        // explore Places
        this.explore.request(
          {'cat': 'hotel, petrol-station, eat-drink', 'at': position.lat + ',' + position.lng},
          {},
          function(result){
            this.addPlacesToMap(result.results)
          }.bind(this),
          function(error){
            console.log(error)
          })
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
    addPlacesToMap(result){
      if (!this.placesGroup) {
          this.placesGroup = new H.map.Group()
          this.placesGroup.addEventListener('tap', function (evt) {
            this.selectedPlace = evt.target.getData()
          }.bind(this))
          this.map.addObject(this.placesGroup)
      }
      this.selectedPlace = null
      this.placesGroup.removeAll()
      this.placesGroup.addObjects(result.items.map(function (place) {
        var marker = new H.map.Marker({lat: place.position[0], lng: place.position[1]})
        marker.icon = new H.map.Icon(place.icon)
        marker.setData(place)
        return marker
      }))
    }
  }
}
</script>
