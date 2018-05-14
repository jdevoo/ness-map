import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Routing from '@/components/Routing'
import HeatMap from '@/components/HeatMap'
import Places from '@/components/Places'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/routing',
      name: 'Routing',
      component: Routing
    },
    {
      path: '/heatmap',
      name: 'HeatMap',
      component: HeatMap
    },
    {
      path: '/places',
      name: 'Places',
      component: Places
    }
  ]
})
