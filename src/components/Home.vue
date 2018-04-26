<template>
  <v-container fluid>
    <v-layout row>
      <v-flex d-flex xs4 mr-3>
        <v-card class="list-layout">
          <v-subheader>Ness Headquarters</v-subheader>
          <v-expansion-panel>
            <v-expansion-panel-content v-for="(item, i) in headquarters" :key="i">
              <div slot="header">{{item.title}} ({{item.items.length}})</div>
              <v-list two-line>
                <template v-for="(headquarter, index) in item.items">
                  <v-list-tile avatar @click="">
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
      bubble: null,
      headquarters: [
        {
          title: 'North America',
          items: [
            {
              location: 'Teaneck, NJ (USA)',
              name: 'Corporate Headquarters',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/teaneck-663x663.jpg',
              address: '300 Frank W. Burr Boulevard, 7th Floor, Teaneck, NJ 07666',
              lat: 40.873016,
              lng:-74.005091
            }, {
              location: 'San Jose, CA (USA)',
              name: 'Office',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/sanjose.jpg',
              address: '2001 Gateway Place, Suite 480W San Jose, CA 95110',
              lat: 37.369834,
              lng: -121.922722
            }, {
              location: 'Pittsburgh, PA (USA)',
              name: 'Technology Innovation Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/pittsburgh2.jpg',
              address: '1000 Town Center Way, Suite 210 Canonsburg, PA 15317',
              lat: 40.274433,
              lng:  -80.162593
            }, {
              location: 'Ontario, Canada',
              name: 'Ness Canada, Inc.',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/ontario.jpg',
              address: '2 Robert Speck Parkway, Suite 750, Mississauga, Ontario, Canada L4Z 1H8',
              lat: 43.596528,
              lng: -79.636561
            }
          ]
        },
        {
          title:'Europe',
          items: [
            {
              location: 'Muenchen, Germany',
              name: 'NESS Deutschland GmbH',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/germany.jpg',
              address: 'Sonnenstr. 23, 80331, Muenchen, Germany',
              lat: 48.136017,
              lng: 11.566671
            },
            {
              location: 'Iasi, Romania',
              name: 'Technology Innovation Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/laci.jpg',
              address: 'United Business Center 2, Strada Palas 5B, Palas, Iași, Romania',
              lat: 47.154895,
              lng: 27.587880
            },
            {
              location: 'Timisoara, Romania',
              name: 'Technology Innovation Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/04/timisoara.jpg',
              address: 'United Business Center 2 Timisoara, 6th floor, Str. Aristide Demetriade 1, 300088 Timisoara, Romania',
              lat: 45.767073,
              lng: 21.229094
            },
            {
              location: 'Košice, Slovakia',
              name: 'Technology Innovation Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/kosice2.jpg',
              address: 'NESS KDC, Moldavská cesta 10/B, 040 11 Košice',
              lat: 48.707879,
              lng: 21.246389
            },
            {
              location: 'London, United Kingdom',
              name: 'Innovation and Design Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/london2.jpg',
              address: '198 High Holborn, London, WC1V 7BD, United Kingdom',
              lat: 51.517120,
              lng: -0.122410
            }
          ]
        },
        {
          title: 'India',
          items: [
            {
              location: 'Bangalore, India',
              name: 'Technology Innovation Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/bangalore2.jpg',
              address: 'No. 33, 6th Block, 17th H Main Road, Koramangala, Bangalore, Karnataka, 560095',
              lat: 12.937769,
              lng: 77.621606
            },
            {
              location: 'Mumbai SEZ, India',
              name: 'Technology Innovation Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/mumbaisez2.jpg',
              address: 'Unit No.1/2, Building 5 & 6, Serene Properties, SEZ, Thane Belapur Road, Airoli, Navi Mumbai 400 708',
              lat: 19.163153,
              lng: 73.003589
            },
            {
              location: 'Hyderabad, India',
              name: 'Innovation and Design Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/hyderabad2.jpg',
              address: '1st & 2nd Floor, 2A Maximus Building, K.Raheja IT Park, Mind space, Madhapur, Hyderabad – 500081',
              lat: 17.414590,
              lng: 78.438267
            }
          ]
        },
        {
          title: 'Middle East',
          items: [
            {
              location: 'Tel Aviv, Israel',
              name: 'Technology Innovation Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/telaviv2.jpg',
              address: 'Atidim Industrial Park Bld. 10, Ramat Hachayal, Tel Aviv',
              lat: 32.085306,
              lng: 34.781778
            }
          ]
        },
        {
          title: 'East Asia',
          items: [
            {
              location: 'Singapore',
              name: 'Technology Innovation Center',
              image: 'https://www.ness.com/wp-content/uploads/2016/01/singapore.jpg',
              address: 'Ness Global Services Pte Ltd., #23, 2 Changi Business Park Avenue 1, (Level 2 Park Avenue Hotel) Singapore 486015',
              lat: 1.335867,
              lng: 103.963100
            }
          ]
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

      this.addMarkersToMap(map, this.headquarters, ui)
  },
  methods: {
    addMarkersToMap(map, locations, ui) {
      var group = new H.map.Group()
      locations.forEach(item => {
        item.items.forEach(headquarter => {
          var marker = new H.map.Marker({lat: headquarter.lat, lng: headquarter.lng})
          marker.label = headquarter.address
          group.addObject(marker)
        })
      })

      group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getPosition())
        if(!this.bubble){
          this.bubble = new H.ui.InfoBubble(evt.target.getPosition(), {content: evt.target.label})
          ui.addBubble(this.bubble)
        } else {
          this.bubble.setPosition(evt.target.getPosition())
          this.bubble.setContent(evt.target.label)
          this.bubble.open()
        }
      }, false)

      map.addObject(group)
      map.setViewBounds(group.getBounds())
    }
  }
}
</script>
