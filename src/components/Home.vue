<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12>
        <v-layout row style="justify-content: center">
          <v-flex xs2 v-for="(item, i) in headquarters" :key="i">
            <v-checkbox :label=item.title v-model=item.visible @change="addMarkersToMap()"> </v-checkbox>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <div id="mapContainer" style="width: 100%; height: 480px; background: grey"></div>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card class="list-layout">
          <v-subheader>Ness Headquarters</v-subheader>
          <v-expansion-panel>
            <v-expansion-panel-content v-for="(item, i) in headquarters" :key="i">
              <div slot="header">{{item.title}} ({{item.items.length}})</div>
              <v-list two-line>
                <template v-for="(headquarter, index) in item.items">
                  <v-list-tile avatar @click="zoomToLocation(headquarter)">
                    <v-list-tile-avatar>
                      <img :src="headquarter.image" />
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="headquarter.location"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="headquarter.name"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider inset></v-divider>
                </template>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
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
      markersGroup: null,
      svgMarker: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <path d="M256,0C167.641,0,96,71.625,96,160c0,24.75,5.625,48.219,15.672,69.125C112.234,230.313,256,512,256,512l142.594-279.375   C409.719,210.844,416,186.156,416,160C416,71.625,344.375,0,256,0z M256,256c-53.016,0-96-43-96-96s42.984-96,96-96   c53,0,96,43,96,96S309,256,256,256z" fill="#D80027"/> </g> </svg>'
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
        this.markersGroup.addEventListener('pointerenter', function (evt) {
          if(!this.bubble){
            this.bubble = new H.ui.InfoBubble(evt.target.getPosition(), {content: evt.target.label})
            this.bubble.addClass('info-bubble')
            uiTemp.addBubble(this.bubble)
          }
            var address = evt.target.label
            this.bubble.setPosition(evt.target.getPosition())
            this.bubble.setContent(`
                  <div class="info-bubble-title">Address</div>
                  <div class="info-bubble-label">
                      ${address} <br />
                  </div>`)
            this.bubble.open()

        }, true)

        this.markersGroup.addEventListener('pointerleave', function (evt) {
          if(this.bubble){
            this.bubble.close()
          }
        }, true)
        this.map.addObject(this.markersGroup)
      }
      this.markersGroup.removeAll()

      this.headquarters.forEach(item => {
        if (item.visible) {
          item.items.forEach(headquarter => {
            var myIcon = new H.map.Icon(this.svgMarker)
            var marker = new H.map.Marker({lat: headquarter.lat, lng: headquarter.lng})
            marker.label = headquarter.address
            // marker.setIcon(myIcon)
            this.markersGroup.addObject(marker)
          })
        }
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
    }
  }
}
</script>
