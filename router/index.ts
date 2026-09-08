import { createRouter, createWebHistory } from 'vue-router'
import GarageView from '../views/GarageView.vue';
import VehicleView from '../views/VehicleView.vue';
import HomeView from '../views/HomeView.vue';
import ManualCoolingView from '../views/ManualCoolingView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: '/garage'
    },
    {
      path: "/garage",
      component: GarageView
    },
    {
      path: "/vehicles/:vehicleId",
      component: VehicleView,
      props: true,
    },
    {
      path: "/manuals/honda-civic-2001-2005",
      component: ManualCoolingView,
    }
  ]
})

export default router