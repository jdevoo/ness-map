<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12>
      </v-flex>
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
  /* .list-layout {
    max-height: 480px;
    overflow: auto;
  } */
  .info-bubble {
    opacity: 0.75;
    padding: 0 5px;
  }

  .info-bubble .info-bubble-title {
    font-size: 15px;
    margin-left: 2px;
  }

  .info-bubble .info-bubble-label {
    font-size: 10px;
    opacity: 0.7;
    margin-left: 2px;
  }
</style>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      bubble: null,
      platform: null,
      maptypes: null,
      map: null,
      ui: null,
      markersGroup: null
    }
  },
  computed: {
    headquarters () {
      return this.$store.getters.headquarters
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
      var uiTemp = this.ui
      if (!this.markersGroup){
        this.markersGroup = new H.map.Group()
        this.map.addObject(this.markersGroup)
      }
      this.markersGroup.removeAll()

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
    zoomToLocation(location) {
      var mapTemp = this.map
      H.map.render.panorama.RenderEngine.getClosestPanoramas({lat:location.lat , lng:location.lng}, function(panoramaData) {
        if (panoramaData.length) {
          mapTemp.setEngineType(H.Map.EngineType.PANORAMA)
          mapTemp.setCenter(panoramaData[0].position)
        } else {
          mapTemp.setEngineType(H.Map.EngineType.P2D)
          mapTemp.setCenter({lng:location.lng , lat:location.lat})
          mapTemp.setZoom(15, true)
        }
      })
    },
    calculateRoutes() {

    }
  }
}
</script>
