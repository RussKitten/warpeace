<template>
  <section class="timeline-section">
    <h2 class="section-title">Таймлайн</h2>
    <div v-if="loading" class="loading-message">Загрузка…</div>
    <div v-else-if="error" class="error-message small">Ошибка: {{ error }}</div>
    <div v-else class="timeline-container">
      <ul class="clean timeline-list">
        <li v-for="ev in sorted" :key="ev.id" class="timeline-card card">
          <div class="event-date small mono">{{ ev.date }}</div>
          <h3 class="event-title">
            <RouterLink class="event-link" :to="`/events/${ev.id}`">{{ ev.title }}</RouterLink>
          </h3>
          <div class="event-location small">
            {{ locationsById[ev.placeId]?.name || '—' }}
          </div>
          <p class="event-summary">{{ ev.summary }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useData } from '../composables/useData.js'

const { loadAll, loading, error, events, locationsById } = useData()

onMounted(loadAll)

const sorted = computed(() =>
  [...events.value].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
)
</script>

<style scoped>
.timeline-section {
  padding: 16px;
}

.section-title {
  font-size: 24px;
  color: var(--peach);
  margin: 0 0 16px;
  text-align: center;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 20px;
}

.timeline-container {
  max-width: 100%;
  margin: 0 auto;
}

.timeline-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-card {
  border: 1px solid var(--line);
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: var(--card);
}

.event-date {
  font-size: 14px;
  margin: 0 0 8px;
}

.event-title {
  margin: 0 0 8px;
  font-size: 18px;
}

.event-link {
  color: inherit;
  text-decoration: none;
}

.event-link:hover {
  text-decoration: underline;
}

.event-location {
  font-size: 14px;
  margin: 0 0 8px;
  color: var(--muted);
}

.event-summary {
  margin: 0;
  line-height: 1.5;
}

@media (min-width: 600px) {
  .section-title {
    font-size: 28px;
    text-align: left;
  }

  .event-date {
    font-size: 16px;
  }

  .event-title {
    font-size: 20px;
  }

  .event-location {
    font-size: 16px;
  }

  .event-summary {
    font-size: 16px;
  }
}

@media (min-width: 900px) {
  .timeline-section {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
  }

  .section-title {
    font-size: 32px;
  }

  .timeline-card {
    padding: 20px;
  }
}
</style>
