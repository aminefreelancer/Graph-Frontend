import Vue from 'vue'
import VueRouter from 'vue-router'
import GraphsList from '../components/Graphs.vue'
import Graph from '../components/Graph.vue'
import Edit from '../components/Edit.vue'
import Statistics from '../components/Statistics.vue'
Vue.use(VueRouter)
  
  const routes = [
  {
    path: '/',
    name: 'Graphs',
    component: GraphsList
  },
  {
    path: '/graphs/:id',
    name: 'Graph',
    component: Graph
  },
  {
    path: '/graphs/:id/edit',
    name: 'Edit',
    component: Edit
  },
  {
    path: '/graphs/:id/statistics',
    name: 'Statistics',
    component: Statistics
  }
  
]

const router = new VueRouter({ 
  mode: 'history',
  routes
})

export default router
