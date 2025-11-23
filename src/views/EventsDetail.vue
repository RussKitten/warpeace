<template>
  <section v-if="ev" class="card event-card">
    <h2 class="section-title">{{ ev.title }}</h2>
    <p class="small mono event-meta">
      {{ ev.date }} • {{ loc?.name }} <span v-if="loc">({{ loc.type }})</span>
    </p>
    <p class="event-summary">{{ ev.summary }}</p>
    <div v-if="ev.participants?.length" class="participants-section">
      <h3>Участники</h3>
      <div class="row participants-row">
        <RouterLink v-for="pid in ev.participants" :key="pid" class="tag" :to="`/heroes/${pid}`">
          {{ heroesById[pid]?.name || pid }}
        </RouterLink>
      </div>
    </div>
  </section>
  <section v-else class="small not-found">Событие не найдено.</section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useData } from '../composables/useData.js'

const route = useRoute()
const { loadAll, eventsById, heroesById, locationsById } = useData()

onMounted(loadAll)

const ev = computed(() => eventsById.value[route.params.id])
const loc = computed(() => ev.value ? locationsById.value[ev.value.placeId] : null)
</script>

<style scoped>
.card {
  border: 1px solid var(--line);
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: var(--card);
  margin: 16px;
}

.event-card {
  max-width: 100%;
}

.section-title {
  margin: 0 0 8px;
  font-size: 24px;
  color: var(--peach);
}

.event-meta {
  margin: 0 0 12px;
  font-size: 14px;
}

.event-summary {
  margin: 0 0 16px;
  line-height: 1.5;
}

.participants-section {
  margin-top: 16px;
}

.participants-section h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.participants-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: linear-gradient(180deg, rgba(187, 148, 87, 0.25), rgba(153, 88, 42, 0.25));
  border: 1px solid rgba(255, 230, 167, 0.35);
  color: var(--peach);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
}

.tag:hover {
  background: linear-gradient(180deg, rgba(187, 148, 87, 0.4), rgba(153, 88, 42, 0.4));
}

.not-found {
  margin: 16px;
  text-align: center;
}

@media (min-width: 600px) {
  .card {
    margin: 24px auto;
    max-width: 800px;
  }

  .section-title {
    font-size: 28px;
  }

  .event-meta {
    font-size: 16px;
  }

  .event-summary {
    font-size: 16px;
  }
}

@media (min-width: 900px) {
  .card {
    max-width: 900px;
  }
}
</style>
