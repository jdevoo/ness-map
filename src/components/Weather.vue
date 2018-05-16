<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12>
        <v-card>
          <div id="mapContainer" style="width: 100%; height: 480px; background: grey"></div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>

<script>
/* eslint-disable */
import axios from 'axios'
export default {
  data () {
    return {
      platform: null,
      maptypes: null,
      map: null,
      ui: null,
      weatherGroup: null
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

      this.weatherGroup = new H.map.Group()
      this.map.addObject(this.weatherGroup)

      var mapEvents = new H.mapevents.MapEvents(this.map)
      var behavior = new H.mapevents.Behavior(mapEvents)
      this.ui = H.ui.UI.createDefault(this.map, this.maptypes)
      this.loadWeather()
  },
  methods: {
    loadWeather() {
      var url = 'https://weather.cit.api.here.com/weather/1.0/report.json?app_id=' + this.$app_id + '&app_code=' + this.$app_code + '&product=observation&name=Berlin-Tegel'
      console.log(url);
      axios.get(url)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script>
