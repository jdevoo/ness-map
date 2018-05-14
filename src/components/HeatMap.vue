<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12>
        <v-switch
          label="Map Labels"
          v-model="mapLabels"
          @click="changeMapLayer()"
        ></v-switch>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <div id="mapContainer" style="width: 100%; height: 720px; background: grey"></div>
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
export default {
  data () {
    return {
      platform: null,
      defaultLayers: null,
      map: null,
      coordinates: [],
      mapLabels: false
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
      this.defaultLayers = this.platform.createDefaultLayers({tileSize: 256 * pixelRatio})

      const layers = this.platform.createDefaultLayers({
        tileSize: 256 * pixelRatio,
        ppi: pixelRatio > 1 ? 320 : 72
      })

      this.map = new H.Map(document.getElementById('mapContainer'), this.defaultLayers.normal.basenight,
        {
            pixelRatio,
            center: new H.geo.Point( 48.707884, 21.246421),
            zoom: 10
        }
      )

      // make the map interactive
      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map))
      let ui = H.ui.UI.createDefault(this.map, layers)
      ui.removeControl('mapsettings')
      ui.removeControl('panorama')

      // resize map on window resize
      window.addEventListener('resize', function() {
          this.map.getViewPort().resize();
      })

      var provider = new H.datalens.RawDataProvider({
         dataUrl: 'static/coords.json',
         dataToFeatures: (data, helpers) => {
              let parsed = JSON.parse(data);
              let features = [];
              for (let i = 1; i < parsed.length; i++) {
                  let row = parsed[i];
                  let feature = {
                      "type": "Feature",
                      "geometry": {
                          "type": "Point",
                          "coordinates": [row.lng, row.lat]
                      },
                      "properties": {}
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

      let baseCount = 10000;
      let nonLinearity = 2;

      // heatmap layer
      let layer = new H.datalens.HeatmapLayer(provider, {
          rowToTilePoint: row => {
              return {
                  x: row.tx,
                  y: row.ty,
                  count: row.count,
                  value: row.count
              };
          },
          bandwidth: [{
              value: 1,
              zoom: 9
          }, {
              value: 10,
              zoom: 16
          }],
          valueRange:  z => [0,baseCount/Math.pow(z,2 * nonLinearity)],
          countRange: [0, 0],
          opacity: 1,
          colorScale: this.scaleColor,
          aggregation: H.datalens.HeatmapLayer.Aggregation.SUM,
          inputScale: H.datalens.HeatmapLayer.InputScale.LINEAR
      });

      // add layer to map
      this.map.addLayer(layer);
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
    },
    convertCoordinatesToGeoJson() {
      let features = []
      for (let i = 0; i < this.coords.length; i++) {
        let item = this.coords[i]
        let feature = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [item.lng, item.lat]
          },
          "properties": {}
        }
        features.push(feature)
      }
      var a = document.createElement("a");
      var file = new Blob([JSON.stringify(features, undefined, 2)], {type: 'application/json'});
      a.href = URL.createObjectURL(file);
      a.download = 'features.json';
      a.click();
    },
    scaleColor(t) {
      let c = d3.color(d3.interpolateReds(t));
      c.opacity = d3.scaleLinear().domain([0, 0.05, 1]).range([0, 1, 1])(t);
      return c + '';
    },
    changeMapLayer() {
      if(!this.mapLabels) {
        this.map.setBaseLayer(this.defaultLayers.normal.mapnight)
      } else {
        this.map.setBaseLayer(this.defaultLayers.normal.basenight)
      }
    }
  }
}
</script>
