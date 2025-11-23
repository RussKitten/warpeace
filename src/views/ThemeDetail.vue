<template>
  <section v-if="th" class="theme-card card">
    <h2 class="section-title">{{ th.title }}</h2>
    <p class="theme-summary">{{ th.summary }}</p>

    <div v-if="th.heroes?.length" class="theme-section">
      <h3 class="theme-subtitle">Ключевые персонажи</h3>
      <div class="row heroes-row">
        <RouterLink
          v-for="pid in th.heroes"
          :key="pid"
          class="tag hero-tag"
          :to="`/heroes/${pid}`"
        >
          {{ heroesById[pid]?.name || pid }}
        </RouterLink>
      </div>
    </div>

    <div v-if="th.events?.length" class="theme-section">
      <h3 class="theme-subtitle">Примеры эпизодов</h3>
      <ul class="clean episodes-list">
        <li v-for="eid in th.events" :key="eid" class="episode-item">
          <RouterLink class="episode-link" :to="`/events/${eid}`">
            {{ eventsById[eid]?.title || eid }}
          </RouterLink>
          <span class="small mono episode-date" v-if="eventsById[eid]?.date">
            — {{ eventsById[eid]?.date }}
          </span>
        </li>
      </ul>
    </div>
  </section>
  <section v-else class="not-found small">Тема не найдена.</section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useData } from '../composables/useData.js'

const route = useRoute()
const { loadAll, themesById, heroesById, eventsById } = useData()

onMounted(loadAll)

const th = computed(() => themesById.value[route.params.id])
</script>

<style scoped>
.theme-card {
  padding: 20px;
  margin: 16px;
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: var(--card);
}

.section-title {
  font-size: 24px;
  color: var(--peach);
  margin: 0 0 16px;
  text-align: center;
}

.theme-summary {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 24px;
  text-align: justify;
}

.theme-section {
  margin: 24px 0;
}

.theme-subtitle {
  font-size: 20px;
  margin: 0 0 12px;
  color: var(--peach);
}

.heroes-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-tag {
  background: linear-gradient(180deg, rgba(187, 148, 87, 0.25), rgba(153, 88, 42, 0.25));
  border: 1px solid rgba(255, 230, 167, 0.35);
  color: var(--peach);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  text-decoration: none;
}

.hero-tag:hover {
  background: linear-gradient(180deg, rgba(187, 148, 87, 0.4), rgba(153, 88, 42, 0.4));
}

.episodes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.episode-item {
  margin: 8px 0;
  padding: 8px;
  border-radius: 8px;
  background: rgba(67, 40, 24, 0.2);
}

.episode-link {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
}

.episode-link:hover {
  text-decoration: underline;
}

.episode-date {
  margin-left: 8px;
  font-size: 14px;
}

.not-found {
  text-align: center;
  padding: 20px;
}

@media (min-width: 600px) {
  .theme-card {
    max-width: 800px;
    margin: 24px auto;
    padding: 24px;
  }

  .section-title {
    font-size: 28px;
    text-align: left;
  }

  .theme-summary {
    font-size: 18px;
    text-align: left;
  }

  .theme-subtitle {
    font-size: 22px;
  }

  .hero-tag {
    padding: 8px 16px;
    font-size: 16px;
  }
}

@media (min-width: 900px) {
  .theme-card {
    max-width: 900px;
  }

  .section-title {
    font-size: 32px;
  }

  .theme-subtitle {
    font-size: 24px;
  }
}
</style>
