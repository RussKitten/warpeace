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
        
        <!-- Философские аспекты -->
        <div v-if="th.philosophical_aspects?.length" class="theme-aspects">
          <div class="aspects-label">Аспекты:</div>
          <div class="aspects-list">
            <span 
              v-for="aspect in th.philosophical_aspects.slice(0, 3)" 
              :key="aspect" 
              class="aspect-tag"
            >
              {{ aspect }}
            </span>
            <span v-if="th.philosophical_aspects.length > 3" class="aspect-more">
              +{{ th.philosophical_aspects.length - 3 }} ещё
            </span>
          </div>
        </div>
        
        <!-- Персонажи -->
        <div v-if="th.heroes?.length" class="theme-tags">
          <div class="tags-label">Персонажи:</div>
          <div class="row">
            <span 
              v-for="pid in th.heroes.slice(0, 4)" 
              :key="pid" 
              class="tag"
            >
              {{ heroesById[pid]?.name || pid }}
            </span>
            <span v-if="th.heroes.length > 4" class="tag-more">
              +{{ th.heroes.length - 4 }}
            </span>
          </div>
        </div>
        
        <!-- Количество аргументов -->
        <div v-if="th.arguments?.length" class="theme-stats">
          <span class="stat-item">
            <strong>{{ th.arguments.length }}</strong> вопросов для сочинения
          </span>
          <span class="stat-item">
            <strong>{{ getTotalQuotes(th) }}</strong> цитат
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useData } from '../composables/useData.js'

const { loadAll, loading, error, themes, heroesById } = useData()

onMounted(loadAll)

// Функция для подсчёта общего количества цитат
const getTotalQuotes = (theme) => {
  if (!theme.arguments) return 0
  return theme.arguments.reduce((total, argument) => total + (argument.quotes?.length || 0), 0)
}
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.theme-card {
  border: 1px solid var(--line);
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: var(--card);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.theme-title {
  margin: 0;
  font-size: 18px;
}

.theme-link {
  color: inherit;
  text-decoration: none;
}

.theme-link:hover {
  text-decoration: underline;
  color: var(--peach);
}

.theme-summary {
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  flex-grow: 1;
}

/* Стили для аспектов */
.theme-aspects {
  margin-top: 8px;
}

.aspects-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.aspects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.aspect-tag {
  background: rgba(67, 40, 24, 0.3);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  border-left: 2px solid var(--peach);
}

.aspect-more {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  align-self: center;
}

/* Стили для тегов персонажей */
.theme-tags {
  margin-top: 8px;
}

.tags-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: linear-gradient(180deg, rgba(187, 148, 87, 0.25), rgba(153, 88, 42, 0.25));
  border: 1px solid rgba(255, 230, 167, 0.35);
  color: var(--peach);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag-more {
  background: rgba(67, 40, 24, 0.3);
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

/* Стили для статистики */
.theme-stats {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.stat-item strong {
  color: var(--peach);
}

@media (min-width: 600px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  .section-title {
    font-size: 28px;
    text-align: left;
  }

  .theme-title {
    font-size: 20px;
  }

  .theme-summary {
    font-size: 15px;
  }

  .aspect-tag,
  .tag {
    font-size: 12px;
  }
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 24px;
  }

  .section-title {
    font-size: 32px;
  }

  .theme-title {
    font-size: 22px;
  }

  .theme-card {
    padding: 24px;
  }
}
</style>