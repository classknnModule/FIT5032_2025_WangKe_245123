<template>
  <section class="map-container" role="region" aria-labelledby="map-heading">
    <header class="map-header">
      <h3 id="map-heading">🗺️ Location Services</h3>
      <div class="map-controls">
        <div class="search-container">
          <label for="search-input" class="sr-only">Search for places</label>
          <input 
            id="search-input"
            v-model="searchQuery" 
            @keyup.enter="searchPlaces"
            placeholder="Search places..."
            class="search-input"
            aria-describedby="search-help"
            autocomplete="off"
          />
          <div id="search-help" class="sr-only">
            Enter a place name and press Enter or click the search button to find locations
          </div>
          <button 
            @click="searchPlaces" 
            class="search-btn"
            aria-label="Search for places"
            :disabled="!searchQuery.trim()"
          >
            <span aria-hidden="true">🔍</span>
            <span class="sr-only">Search</span>
          </button>
        </div>
        <div class="navigation-container">
          <label for="destination-input" class="sr-only">Enter destination for navigation</label>
          <input 
            id="destination-input"
            v-model="destination" 
            @keyup.enter="getDirections"
            placeholder="Navigate to..."
            class="nav-input"
            aria-describedby="nav-help"
            autocomplete="off"
          />
          <div id="nav-help" class="sr-only">
            Enter a destination and press Enter or click the navigation button to get directions
          </div>
          <button 
            @click="getDirections" 
            class="nav-btn"
            aria-label="Get navigation directions"
            :disabled="!destination.trim() || !userLocation"
          >
            <span aria-hidden="true">🧭</span>
            <span class="sr-only">Navigate</span>
          </button>
        </div>
      </div>
    </header>
    
    <div 
      id="map" 
      class="map-display"
      role="application"
      aria-label="Interactive map showing search results and navigation routes"
      tabindex="0"
      @keydown="handleMapKeydown"
    ></div>
    
    <div 
      v-if="searchResults.length > 0" 
      class="search-results"
      role="region"
      aria-labelledby="search-results-heading"
    >
      <h4 id="search-results-heading">Search Results:</h4>
      <ul role="list">
        <li
          v-for="(place, index) in searchResults" 
          :key="index"
          role="listitem"
        >
          <button
            @click="selectPlace(place)"
            class="result-item"
            :aria-describedby="`result-${index}-details`"
          >
            <strong>{{ place.display_name.split(',')[0] }}</strong>
            <p id="`result-${index}-details`">{{ place.display_name }}</p>
            <span class="coordinates" aria-label="Coordinates">
              📍 {{ place.lat.toFixed(4) }}, {{ place.lon.toFixed(4) }}
            </span>
          </button>
        </li>
      </ul>
    </div>
    
    <div 
      v-if="routeInfo" 
      class="route-info"
      role="region"
      aria-labelledby="route-info-heading"
      aria-live="polite"
    >
      <h4 id="route-info-heading">🧭 Route Information:</h4>
      <dl>
        <dt>Distance:</dt>
        <dd>{{ routeInfo.distance }}</dd>
        <dt>Duration:</dt>
        <dd>{{ routeInfo.duration }}</dd>
      </dl>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AccessibilityUtils } from '@/utils/accessibility'

const searchQuery = ref('')
const destination = ref('')
const searchResults = ref([])
const routeInfo = ref(null)
const map = ref(null)
const userMarker = ref(null)
const searchMarkers = ref([])
const routeControl = ref(null)
const userLocation = ref(null)

const handleMapKeydown = (event) => {
  const { key } = event
  if (key === 'Enter' || key === ' ') {
    AccessibilityUtils.announceToScreenReader(
      'Map is interactive. Use search and navigation controls above to interact with the map.'
    )
  }
}

const initMap = () => {
  map.value = L.map('map').setView([-37.8136, 144.9631], 13)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map.value)
  
  getCurrentLocation()
}

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    AccessibilityUtils.announceToScreenReader('Getting your current location...')
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
        map.value.setView([userLocation.value.lat, userLocation.value.lng], 15)
        
        if (userMarker.value) {
          map.value.removeLayer(userMarker.value)
        }
        
        userMarker.value = L.marker([userLocation.value.lat, userLocation.value.lng])
          .addTo(map.value)
          .bindPopup('📍 Your Current Location')
          .openPopup()
        
        AccessibilityUtils.announceToScreenReader('Your location has been found and marked on the map')
      },
      (error) => {
        console.error('Geolocation error:', error)
        AccessibilityUtils.announceToScreenReader(
          'Unable to get your location. Please enable location services.',
          'assertive'
        )
      }
    )
  } else {
    AccessibilityUtils.announceToScreenReader(
      'Geolocation is not supported by this browser.',
      'assertive'
    )
  }
}

const searchPlaces = async () => {
  if (!searchQuery.value.trim()) return
  
  AccessibilityUtils.announceToScreenReader(`Searching for ${searchQuery.value}...`)
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&limit=5`
    )
    const data = await response.json()
    
    searchResults.value = data.map(place => ({
      ...place,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon)
    }))
    
    clearSearchMarkers()
    
    searchResults.value.forEach((place, index) => {
      const marker = L.marker([place.lat, place.lon])
        .addTo(map.value)
        .bindPopup(`
          <div>
            <h4>${place.display_name.split(',')[0]}</h4>
            <p>${place.display_name}</p>
            <p>Coordinates: ${place.lat.toFixed(4)}, ${place.lon.toFixed(4)}</p>
          </div>
        `)
      
      searchMarkers.value.push(marker)
    })
    
    if (searchResults.value.length > 0) {
      const firstResult = searchResults.value[0]
      map.value.setView([firstResult.lat, firstResult.lon], 15)
      
      AccessibilityUtils.announceToScreenReader(
        `Found ${searchResults.value.length} results for ${searchQuery.value}. Results are displayed below the map.`
      )
    } else {
      AccessibilityUtils.announceToScreenReader(
        `No results found for ${searchQuery.value}. Please try a different search term.`,
        'assertive'
      )
    }
  } catch (error) {
    console.error('Search error:', error)
    AccessibilityUtils.announceToScreenReader(
      'Search failed. Please check your internet connection and try again.',
      'assertive'
    )
  }
}

const selectPlace = (place) => {
  map.value.setView([place.lat, place.lon], 17)
  
  const marker = searchMarkers.value.find(m => 
    m.getLatLng().lat === place.lat && m.getLatLng().lng === place.lon
  )
  if (marker) {
    marker.openPopup()
  }
  
  AccessibilityUtils.announceToScreenReader(
    `Selected ${place.display_name.split(',')[0]}. Map view updated to show this location.`
  )
}

const getDirections = async () => {
  if (!destination.value.trim() || !userLocation.value) {
    AccessibilityUtils.announceToScreenReader(
      'Please enter a destination and ensure location access is enabled',
      'assertive'
    )
    return
  }
  
  AccessibilityUtils.announceToScreenReader(`Getting directions to ${destination.value}...`)
  
  try {
    const destResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination.value)}&limit=1`
    )
    const destData = await destResponse.json()
    
    if (destData.length === 0) {
      AccessibilityUtils.announceToScreenReader(
        'Destination not found. Please try a different location.',
        'assertive'
      )
      return
    }
    
    const destCoords = {
      lat: parseFloat(destData[0].lat),
      lng: parseFloat(destData[0].lon)
    }
    
    const routeResponse = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${userLocation.value.lng},${userLocation.value.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson`
    )
    const routeData = await routeResponse.json()
    
    if (routeData.routes && routeData.routes.length > 0) {
      const route = routeData.routes[0]
      
      if (routeControl.value) {
        map.value.removeLayer(routeControl.value)
      }
      
      routeControl.value = L.geoJSON(route.geometry, {
        style: {
          color: '#6366f1',
          weight: 5,
          opacity: 0.8
        }
      }).addTo(map.value)
      
      L.marker([destCoords.lat, destCoords.lng])
        .addTo(map.value)
        .bindPopup(`🎯 Destination: ${destData[0].display_name}`)
      
      routeInfo.value = {
        distance: `${(route.distance / 1000).toFixed(2)} km`,
        duration: `${Math.round(route.duration / 60)} minutes`
      }
      
      const bounds = L.latLngBounds([
        [userLocation.value.lat, userLocation.value.lng],
        [destCoords.lat, destCoords.lng]
      ])
      map.value.fitBounds(bounds, { padding: [20, 20] })
      
      AccessibilityUtils.announceToScreenReader(
        `Route found. Distance: ${routeInfo.value.distance}, Duration: ${routeInfo.value.duration}. Route information is displayed below the map.`
      )
    }
  } catch (error) {
    console.error('Directions error:', error)
    AccessibilityUtils.announceToScreenReader(
      'Failed to get directions. Please check your internet connection and try again.',
      'assertive'
    )
  }
}

const clearSearchMarkers = () => {
  searchMarkers.value.forEach(marker => {
    map.value.removeLayer(marker)
  })
  searchMarkers.value = []
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.map-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.map-header h3 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-weight: 700;
}

.map-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-container,
.navigation-container {
  display: flex;
  gap: 0.5rem;
}

.search-input,
.nav-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus,
.nav-input:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.search-btn,
.nav-btn {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-width: 44px;
  min-height: 44px;
}

.search-btn:hover:not(:disabled),
.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.search-btn:focus,
.nav-btn:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.search-btn:disabled,
.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.map-display {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
}

.map-display:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.search-results,
.route-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.search-results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-results h4,
.route-info h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.result-item {
  display: block;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  text-align: left;
  min-height: 44px;
}

.result-item:hover {
  background: #f3f4f6;
  border-color: #6366f1;
  transform: translateY(-1px);
}

.result-item:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  background: #f3f4f6;
  border-color: #6366f1;
}

.result-item strong {
  color: #1f2937;
  display: block;
  margin-bottom: 0.25rem;
}

.result-item p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.coordinates {
  color: #9ca3af;
  font-size: 0.8rem;
  float: right;
}

.route-info dl {
  margin: 0;
}

.route-info dt {
  font-weight: bold;
  color: #374151;
  margin-top: 0.5rem;
}

.route-info dd {
  margin: 0.25rem 0 0.5rem 0;
  color: #6b7280;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .map-controls {
    grid-template-columns: 1fr;
  }
  
  .map-display {
    height: 300px;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

@media (prefers-high-contrast: high) {
  .search-btn,
  .nav-btn {
    background: #000;
    border: 2px solid #fff;
  }
  
  .result-item:focus {
    outline: 3px solid #fff;
    background: #000;
    color: #fff;
  }
}
</style>
