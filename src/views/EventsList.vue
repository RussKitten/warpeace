<template>
  <section>
    <h2 class="section-title">События</h2>
    <SearchBox v-model="q" placeholder="Поиск по событиям…" />
    <hr class="sep" />
    <div v-if="loading" class="loading-message">Загрузка…</div>
    <div v-else-if="error" class="error-message small">Ошибка: {{ error }}</div>
    <div class="grid" v-else>
      <article v-for="ev in filtered" :key="ev.id" class="card">
        <h3><RouterLink :to="`/events/${ev.id}`" class="event-title">{{ ev.title }}</RouterLink></h3>
        <p class="small mono event-meta">
          {{ ev.date }} • {{ locationsById[ev.placeId]?.name || '—' }}
        </p>
        <p class="event-summary">{{ ev.summary }}</p>
        <div class="row participants">
          <span class="tag" v-for="pid in ev.participants" :key="pid">
            {{ heroesById[pid]?.name || pid }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useData } from '../composables/useData.js'
import SearchBox from '../components/SearchBox.vue'

const { loadAll, loading, error, events, heroesById, locationsById } = useData()
const q = ref('')

onMounted(loadAll)

const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  if (!t) return sorted(events.value)
  return sorted(events.value).filter(e =>
    [e.title, e.summary, e.date, (locationsById.value[e.placeId]?.name || '')]
      .join(' ')
      .toLowerCase()
      .includes(t)
  )
})

function sorted(arr) {
  return [...arr].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
}
</script>

<style scoped>
.section-title {
  margin: 0 0 16px;
  font-size: 24px;
  color: var(--peach);
  text-align: center;
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
  padding: 0 16px;
}

.card {
  border: 1px solid var(--line);
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: var(--card);
}

.event-title {
  color: inherit;
  text-decoration: none;
  font-size: 18px;
  margin: 0 0 8px;
  display: block;
}

.event-title:hover {
  text-decoration: underline;
}

.event-meta {
  margin: 0 0 12px;
  font-size: 14px;
}

.event-summary {
  margin: 0 0 12px;
  line-height: 1.5;
}

.participants {
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
}

@media (min-width: 600px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    padding: 0 24px;
  }

  .section-title {
    font-size: 28px;
  }

  .event-title {
    font-size: 20px;
  }

  .event-meta {
    font-size: 16px;
  }
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    padding: 0 32px;
  }
}
</style>
