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
      markersGroup: null,
      coordinates: []
    }
  },
  computed: {
    headquarters () {
      return this.$store.getters.headquarters
    },
    coords () {
      return this.$store.getters.coords
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

      const pixelRatio = devicePixelRatio > 1 ? 2 : 1;
      let defaultLayers = this.platform.createDefaultLayers({
          tileSize: 256 * pixelRatio
      })

      const layers = this.platform.createDefaultLayers({
        tileSize: 256 * pixelRatio,
        ppi: pixelRatio > 1 ? 320 : 72
      })

      let map = new H.Map(document.getElementById('mapContainer'), defaultLayers.normal.basenight,
        {
            pixelRatio,
            center: new H.geo.Point( 48.707884, 21.246421),
            zoom: 10
        }
      )

      // make the map interactive
      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
      let ui = H.ui.UI.createDefault(map, layers)
      ui.removeControl('mapsettings')
      ui.removeControl('panorama')

      // resize map on window resize
      window.addEventListener('resize', function() {
          map.getViewPort().resize();
      })

      let provider = new H.datalens.RawDataProvider({
      dataUrl: 'nothing',
      dataToFeatures: (data, helpers) => {
          console.log('zebu')
          let features = [];
          for (let i = 1; i < parsed.length; i++) {
              let row = parsed[i];
              let feature = {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [Number(row[5]), Number(row[6])]
                  },
                  "properties": {
                      "passenger_count": row[3]
                  }
              };
              features.push(feature);
          }
          return features;
      },
      featuresToRows: (features, x, y, z, tileSize, helpers) => {
          let counts = {};
          for (let i = 0; i < features.length; i++) {
              let feature = features[i];
              let coordinates = feature.geometry.coordinates;
              let lng = coordinates[0];
              let lat = coordinates[1];

              let p = helpers.latLngToPixel(lat, lng, z, tileSize);
              let px = p[0];
              let py = p[1];
              let tx = px % tileSize;
              let ty = py % tileSize;
              let key = tx + '-' + ty;

              if (counts[key]) {
                  counts[key] += 1;
              } else {
                  counts[key] = 1;
              }
          }

          let rows = [];
          for (let key in counts) {
              let t = key.split('-');
              let tx = Number(t[0]);
              let ty = Number(t[1]);
              let count = counts[key];
              rows.push({tx, ty, count, value: count});
          }
          return rows;
      }
  });
      // var marker = new H.map.Marker({lat: 48.707884, lng: 21.246421})
      // this.map.addObject(marker)
      // this.map.setCenter({lat: 48.707884, lng: 21.246421})
      // this.map.setZoom(10, true)
  },
  methods: {
    convertAddressesToCoordinates() {
      var coordinates = this.coordinates
      var addressesProcessed = 0
      var geocoder = this.platform.getGeocodingService()
      this.addresses.forEach((address, index, array) => {
        geocoder.geocode({
          searchText: address.street + ', ' + address.city
        }, function(result) {
          addressesProcessed++
          if (result.Response.View[0] === undefined) {
            console.log(address.city + ', ' + address.street)
          } else {
            var locations = result.Response.View[0].Result
            coordinates.push({lat: locations[0].Location.DisplayPosition.Latitude, lng:locations[0].Location.DisplayPosition.Longitude})
          }
          if (addressesProcessed === array.length){
            //JSON.stringify(coordinates, undefined, 2)
            console.log('DONE')
          }
        }, function(error){
          console.log(error)
        })
      })
    }
  }
}
</script>
