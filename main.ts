import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useVehiclesStore, VEHICLES_STORAGE_KEY } from './stores/vehicles'
import { useMaintenanceStore, MAINTENANCE_STORAGE_KEY } from './stores/maintenance'

const pinia = createPinia()
const vehicleStore = useVehiclesStore(pinia)
const maintenanceStore = useMaintenanceStore(pinia)
vehicleStore.$subscribe((_mutation, state) => {
	localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(state.vehicles))
})
maintenanceStore.$subscribe((_mutation, state) => {
	localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(state.records))
})

createApp(App).use(pinia).use(router).mount('#app')

if (import.meta.env.PROD && 'serviceWorker' in navigator) window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'))
