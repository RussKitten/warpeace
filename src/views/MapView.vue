<template>
  <section class="locations-section">
    <h2 class="section-title">Карта локаций</h2>
    <p class="section-description small">Нажмите на ссылку, чтобы открыть локацию в OpenStreetMap.</p>
    <div v-if="loading" class="loading-message">Загрузка…</div>
    <div v-else-if="error" class="error-message small">Ошибка: {{ error }}</div>
    <div class="grid" v-else>
      <article v-for="loc in locations" :key="loc.id" class="card location-card">
        <h3 class="location-name">{{ loc.name }}</h3>
        <p class="small mono location-meta">
          {{ loc.type }} • {{ loc.lat }}, {{ loc.lng }}
        </p>
        <p class="map-link-container">
          <a :href="mapUrl(loc)" target="_blank" rel="noopener" class="map-link">Открыть на карте</a>
        </p>
        <div v-if="eventsAt(loc.id)?.length" class="related-events">
          <h4 class="related-events-title">Связанные события</h4>
          <ul class="clean small events-list">
            <li v-for="ev in eventsAt(loc.id)" :key="ev.id" class="event-item">
              <RouterLink :to="`/events/${ev.id}`" class="event-link">{{ ev.title }}</RouterLink> — {{ ev.date }}
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useData } from '../composables/useData.js'

const { loadAll, loading, error, locations, events } = useData()

onMounted(loadAll)

function mapUrl(loc) {
  const z = 9
  return `https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=${z}/${loc.lat}/${loc.lng}`
}

function eventsAt(placeId) {
  return events.value.filter(e => e.placeId === placeId)
}
</script>

<style scoped>
.locations-section {
  padding: 16px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 24px;
  color: var(--peach);
  text-align: center;
}

.section-description {
  text-align: center;
  margin: 0 0 16px;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.location-card {
  border: 1px solid var(--line);
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: var(--card);
}

.location-name {
  margin: 0 0 8px;
  font-size: 18px;
}

.location-meta {
  margin: 0 0 12px;
  font-size: 14px;
}

.map-link-container {
  margin: 0 0 12px;
}

.map-link {
  color: var(--accent);
  text-decoration: none;
}

.map-link:hover {
  text-decoration: underline;
}

.related-events {
  margin-top: 12px;
}

.related-events-title {
  margin: 0 0 8px;
  font-size: 16px;
}

.events-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.event-item {
  margin: 6px 0;
}

.event-link {
  color: inherit;
  text-decoration: none;
}

.event-link:hover {
  text-decoration: underline;
}

@media (min-width: 600px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .section-title {
    font-size: 28px;
  }

  .location-name {
    font-size: 20px;
  }

  .location-meta {
    font-size: 16px;
  }
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }

  .section-title {
    font-size: 32px;
  }
}
</style>
