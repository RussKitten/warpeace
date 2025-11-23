<template>
  <section class="themes-section">
    <h2 class="section-title">Темы</h2>
    <div v-if="loading" class="loading-message">Загрузка…</div>
    <div v-else-if="error" class="error-message small">Ошибка: {{ error }}</div>
    <div class="grid" v-else>
      <article v-for="th in themes" :key="th.id" class="card theme-card">
        <h3 class="theme-title">
          <RouterLink class="theme-link" :to="`/themes/${th.id}`">{{ th.title }}</RouterLink>
        </h3>
        <p class="theme-summary">{{ th.summary }}</p>
        <div class="row theme-tags">
          <span class="tag" v-for="pid in (th.heroes || [])" :key="pid">
            {{ heroesById[pid]?.name || pid }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useData } from '../composables/useData.js'

const { loadAll, loading, error, themes, heroesById } = useData()

onMounted(loadAll)
</script>

<style scoped>
.themes-section {
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.theme-card {
  border: 1px solid var(--line);
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: var(--card);
}

.theme-title {
  margin: 0 0 12px;
  font-size: 18px;
}

.theme-link {
  color: inherit;
  text-decoration: none;
}

.theme-link:hover {
  text-decoration: underline;
}

.theme-summary {
  margin: 0 0 12px;
  line-height: 1.5;
  font-size: 14px;
}

.theme-tags {
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
  }

  .section-title {
    font-size: 28px;
    text-align: left;
  }

  .theme-title {
    font-size: 20px;
  }

  .theme-summary {
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

  .theme-title {
    font-size: 22px;
  }
}
</style>
