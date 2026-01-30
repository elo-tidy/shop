<script lang="ts" setup>
//https://tomickigrzegorz.github.io/react-leaflet-examples/#/simple-map
import { onMounted, ref, watch, computed, nextTick } from 'vue'
// Ui
import Button from '@/components/ui/button/Button.vue'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
// Types
import type { Pickup } from '@/types/pickup'
// Stores
import { usecheckoutStepper } from '@/store/OrderStepperStore'
// Services
import { getMarkersData } from '@/services/PickupMap'
// Leaflet
import L, { Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Data :  map
const markers = ref<Pickup[] | []>([])
const fullAddress = ref<string | null>('')
const leafletMarkers = ref<L.Marker[]>([])
// const userIsLocated = ref<boolean>(false)
type NominatimResult = {
  lat: string
  lon: string
  display_name: string
}

const locationFoundAccordingToInputSearch = ref<NominatimResult[] | null>(null)
const nearbyMarkersList = ref<{ marker: L.Marker; distance: number }[]>([])
const map = ref<L.Map | null>(null)

const initMap = async (map: L.Map) => {
  // Default view
  map.setView([46.4141241782643, 2.515141928997488], 6)
  // Init map
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 13,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)
  // Set view restriction
  map.setMaxBounds([
    [42.06820821844036, -4.866895262042819],
    [51.31493563187985, 8.204418278515574],
  ])
}
// Load markers - display popup and data on marker's click
const loadMapMarkers = async (map: L.Map) => {
  markers.value = await getMarkersData()
  for (const marker of markers.value) {
    const [lng, lat]: [number, number] = marker.geometry.coordinates

    const name = marker.properties.brand
      ? marker.properties.brand
      : marker.properties.operator
        ? marker.properties.operator
        : ''

    const markerInstance = L.marker([lat, lng], { alt: `${name}`, title: `${name}` })
    leafletMarkers.value.push(markerInstance)
    markerInstance.addTo(map)

    markerInstance.on('click', async function (this: L.Marker) {
      const data = await getAddress(lat, lng)
      const name = data.name ? `<strong>${data.name}</strong><br />` : null
      const road = data?.address?.road + '<br />'
      let city = data?.address.city
        ? data?.address.city
        : data?.address.town
          ? data?.address.town
          : data?.address.municipality
            ? data?.address.municipality
            : data?.address.village
              ? data?.address.village
              : null
      city = city + '<br />'
      const postcode = data?.address.postcode
      const country = data?.address.country
      const hours = `<p><strong>Horaires : </strong><br />${formatHours(marker.properties.opening_hours)}</p>`

      const popupContent = `<address>${name}${road}${postcode} - ${city}${country}</address>${hours}`

      this.bindPopup(popupContent).openPopup()
    })
  }
}
// Geolocalisation
const loading = ref<boolean>(false)
const geolocalisateMe = (map: L.Map | null) => {
  if (!map) return
  loading.value = true
  map.locate()
  isLocationFound(map)
}
const geolocalisateAccordingtoInput = async (map: L.Map | null) => {
  await findLngLat()

  const result = locationFoundAccordingToInputSearch.value?.[0]
  if (!result || !map) {
    toast('Ville introuvable')
    return
  }

  const lat = parseFloat(result.lat)
  const lng = parseFloat(result.lon)
  const currentLocation = L.latLng(lat, lng)

  loading.value = true

  // 1. Calculer les markers proches
  const nearbyMarkers = getNearbyMarkersFrom(currentLocation)
  nearbyMarkersList.value = nearbyMarkers

  // 2. Créer un marker "utilisateur"
  const currentMarker = L.icon({
    iconUrl: '/public/marker.svg',
    iconSize: [32, 32],
  })

  const userMarker = L.marker(currentLocation, { title: 'Votre position', icon: currentMarker })

  userMarker.addTo(map)

  // 3. Regrouper et ajuster la vue
  const markersOnly = nearbyMarkers.map((item) => item.marker) as unknown as L.Layer[]
  const group = L.featureGroup([...markersOnly, userMarker])
  map.fitBounds(group.getBounds(), { padding: [50, 50] })

  loading.value = false
}

function getNearbyMarkersFrom(latlng: L.LatLng, radius = 110000) {
  return leafletMarkers.value
    .map((marker) => {
      const distance = marker.getLatLng().distanceTo(latlng)
      return { marker, distance }
    })
    .filter((item) => item.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
}

const isLocationFound = (map: L.Map) => {
  map.on('locationfound', function (ev) {
    const currentLocation = ev.latlng
    loading.value = false

    nearbyMarkersList.value = getNearbyMarkersFrom(currentLocation)

    const currentMarker = L.icon({
      iconUrl: '/public/marker.svg',
      iconSize: [32, 32],
    })

    const userMarker = L.marker(currentLocation, { title: 'Votre position', icon: currentMarker })

    userMarker.addTo(map)

    const markersOnly = nearbyMarkersList.value.map((item) => item.marker) as unknown as L.Layer[]
    const group = L.featureGroup([...markersOnly, userMarker])
    map.fitBounds(group.getBounds(), { padding: [50, 50] })
  })

  map.on('locationerror', function (ev) {
    toast('locationerror')
  })
}
// City Search
const ville = defineModel<string>({ default: '' })
const findLngLat = async () => {
  const url = `https://nominatim.openstreetmap.org/search?city=${ville.value}&country=France&format=jsonv2&limit=1`
  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'fr',
      },
    })
    const data = await res.json()
    locationFoundAccordingToInputSearch.value = data
    return data
  } catch (error) {
    toast('Erreur lors de la récupération de la ville')
  }
  // isLocationFound(map)
}
// Get address
const getAddress = async (lat: number, lng: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`

  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'fr',
      },
    })
    const data = await res.json()
    fullAddress.value = data
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération de l’adresse :', error)
  }
}

// Format hours
const dayMap = {
  Mo: 'Lun',
  Tu: 'Mar',
  We: 'Mer',
  Th: 'Jeu',
  Fr: 'Ven',
  Sa: 'Sam',
  Su: 'Dim',
}
function formatHours(openingHoursStr: string | undefined | null) {
  if (!openingHoursStr) return 'Horaires non disponibles'

  return openingHoursStr
    .split(';')
    .map((group) => {
      let [daysPart, hoursPart] = group.trim().split(' ')

      daysPart = daysPart
        .split('-')
        .map((d) => dayMap[d as keyof typeof dayMap] || d)
        .join('-')

      if (!hoursPart) {
        return `${daysPart} : Fermé`
      }

      const hours = hoursPart
        .split(',')
        .map((h) =>
          h.replace(/(\d{2}):(\d{2})/g, (_, h, m) => `${parseInt(h)}h${m === '00' ? '' : m}`),
        )
        .join(' et ')

      return `${daysPart} : ${hours}`
    })
    .join('\n')
}
const loadMap = async () => {
  await nextTick()
  const leafletMap = L.map('map')
  map.value = leafletMap
  initMap(leafletMap)
  loadMapMarkers(leafletMap)
}
const props = defineProps<{
  mapComponentIsLoaded: boolean
  activeTab: string
}>()

const emit = defineEmits(['isMapVisible'])
const stepStore = usecheckoutStepper()
const displayMap = () => {
  if (
    stepStore.getLivraisonDetails?.deliveryModeId === 'pickup_point' &&
    props.mapComponentIsLoaded
  )
    return true
  return false
}
watch(
  [() => displayMap(), () => props.activeTab],
  async ([display, tab]) => {
    emit('isMapVisible', true)
    if (display && tab === 'pickup_point') {
      await nextTick()
      loadMap()
    }
  },
  { immediate: true },
)
</script>
<template>
  <div class="mt-10 grid grid-cols-[auto_auto_1fr] gap-2 items-center" v-if="displayMap()">
    <Button
      type="button"
      v-if="map instanceof L.Map"
      @click="geolocalisateMe(map)"
      class="max-w-[120px]"
      >Me géolocaliser</Button
    >
    <p class="text-center px-4">Ou</p>
    <Form v-if="map instanceof L.Map" @submit="geolocalisateAccordingtoInput(map)" class="relative">
      <fieldset>
        <legend class="sr-only">Recherche par ville</legend>
        <FormField name="ville">
          <FormItem>
            <FormLabel class="sr-only">Adresse mail</FormLabel>
            <FormControl>
              <Input
                class="inputField"
                required
                type="text"
                placeholder="Tapez ici votre ville"
                v-model="ville"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormItem class="absolute top-0 right-0">
          <!-- :disabled="loading"
          :value="loading ? 'En cours' : 'Envoyer un lien de connexion'" -->
          <input type="submit"
        /></FormItem>
      </fieldset>
    </Form>
    <!-- <input
    v-model="searchCity"
    @input="filterMarkersByCity"
    placeholder="Filtrer par ville..."
    type="text"
  /> -->
    <p class="mb-3 col-span-3">Choisissez un point dans la carte</p>
    <div :class="['map-container relative col-span-3 isolate', { isLoading: loading }]">
      <div id="map" class="h-[500px] w-[500px] z-0"></div>
      <div
        v-if="loading"
        class="loader absolute top-[calc(50%-25px)] left-[calc(50%-25px)] z-1"
      ></div>
    </div>
  </div>
</template>
