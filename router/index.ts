import { createRouter, createWebHistory } from 'vue-router'
import GarageView from '../views/GarageView.vue';
import VehicleView from '../views/VehicleView.vue';
import HomeView from '../views/HomeView.vue';

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
    }
  ]
})

export default router