<template>
  <v-container fluid>
    <v-layout row>
      <v-flex d-flex xs4 mr-3>
        <v-card class="list-layout">
          <v-subheader>Ness Headquarters</v-subheader>
          <v-list two-line>
            <template v-for="(item, index) in headquarters">
              <v-list-tile avatar @click="">
                <v-list-tile-avatar>
                  <img :src="item.image" />
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.location"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.name"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider inset></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs8>
        <v-card>
          <div id="mapContainer" style="width: 100%; height: 480px; background: grey"></div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .list-layout {
      max-height: 480px;
      overflow: auto;
    }
</style>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      headquarters: [
        {
          location: 'Teaneck, NJ (USA)',
          name: 'Corporate Headquarters',
          image: 'https://www.ness.com/wp-content/uploads/2016/01/teaneck-663x663.jpg',
          address: '300 Frank W. Burr Boulevard, 7th Floor, Teaneck, NJ 07666'
        }, {
          location: 'San Jose, CA (USA)',
          name: 'Office',
          image: 'https://www.ness.com/wp-content/uploads/2016/01/sanjose.jpg',
          address: '2001 Gateway Place, Suite 480W San Jose, CA 95110'
        }, {
          location: 'Pittsburgh, PA (USA)',
          name: 'Technology Innovation Center',
          image: 'https://www.ness.com/wp-content/uploads/2016/01/pittsburgh2.jpg',
          address: '1000 Town Center Way, Suite 210 Canonsburg, PA 15317'
        }, {
          location: 'Ontario, Canada',
          name: 'Ness Canada, Inc.',
          image: 'https://www.ness.com/wp-content/uploads/2016/01/ontario.jpg',
          address: '2 Robert Speck Parkway, Suite 750, Mississauga, Ontario, Canada L4Z 1H8'
        },
        {
          location: 'Teaneck, NJ (USA)',
          name: 'Corporate Headquarters',
          image: 'https://www.ness.com/wp-content/uploads/2016/01/teaneck-663x663.jpg',
          address: '300 Frank W. Burr Boulevard, 7th Floor, Teaneck, NJ 07666'
        }, {
          location: 'San Jose, CA (USA)',
          name: 'Office',
          image: 'https://www.ness.com/wp-content/uploads/2016/01/sanjose.jpg',
          address: '2001 Gateway Place, Suite 480W San Jose, CA 95110'
        }, {
          location: 'Pittsburgh, PA (USA)',
          name: 'Technology Innovation Center',
          image: 'https://www.ness.com/wp-content/uploads/2016/01/pittsburgh2.jpg',
          address: '1000 Town Center Way, Suite 210 Canonsburg, PA 15317'
        }, {
          location: 'Ontario, Canada',
          name: 'Ness Canada, Inc.',
          image: 'https://www.ness.com/wp-content/uploads/2016/01/ontario.jpg',
          address: '2 Robert Speck Parkway, Suite 750, Mississauga, Ontario, Canada L4Z 1H8'
        }
      ]
    }
  },
  mounted: function () {
      // Initialize the platform object:
      var platform = new H.service.Platform({
        'app_id': 'tOPDP4GqwPojCCApkMyA',
        'app_code': 'B31er-cbmC_bBOoupZ_O2g',
        'useCIT': true,
        'useHTTPS': true
      })

      // Obtain the default map types from the platform object
      var maptypes = platform.createDefaultLayers()

      // Instantiate (and display) a map object:
      var map = new H.Map(document.getElementById('mapContainer'), maptypes.normal.map,
        {
          zoom: 10,
          center: { lng: 13.4, lat: 52.51 }
        })
      var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
      var ui = H.ui.UI.createDefault(map, maptypes)
  }
}
</script>
