<template>
  <div class="text-fragment-page">
    <div class="page-header">
      <button class="back-btn" @click="router.back()">← Назад</button>
      <h1 class="fragment-title">{{ fragment?.title }}</h1>
      <p class="fragment-meta">
        <span class="volume">Том {{ fragment?.volume }}</span> • 
        <span class="chapter">Глава {{ fragment?.chapter }}</span> • 
        <span class="section">Раздел {{ fragment?.section }}</span>
        <span v-if="fragment?.page" class="page"> • Страница {{ fragment.page }}</span>
      </p>
    </div>

    <div class="fragment-content">
      <div class="text-container">
        <p class="fragment-text">{{ fragment?.text }}</p>
      </div>

      <div class="fragment-connections">
        <!-- Связанное событие -->
        <section v-if="relatedEvent" class="connection-section">
          <h3>📅 Связанное событие</h3>
          <RouterLink :to="`/events/${relatedEvent.id}`" class="event-link">
            <div class="event-info">
              <h4>{{ relatedEvent.title }}</h4>
              <p class="event-date">{{ formatEventDate(relatedEvent.date) }}</p>
              <p class="event-summary">{{ relatedEvent.summary }}</p>
              <div class="event-participants">
                <span class="participants-label">Участники:</span>
                <div class="participants-list">
                  <span 
                    v-for="participantId in relatedEvent.participants?.slice(0, 3)" 
                    :key="participantId"
                    class="participant-tag"
                  >
                    {{ getHeroName(participantId) }}
                  </span>
                  <span v-if="relatedEvent.participants?.length > 3" class="more-participants">
                    +{{ relatedEvent.participants.length - 3 }}
                  </span>
                </div>
              </div>
            </div>
          </RouterLink>
        </section>

        <!-- Связанные персонажи -->
        <section v-if="relatedHeroes.length" class="connection-section">
          <h3>👥 Участники фрагмента</h3>
          <div class="heroes-grid">
            <div
              v-for="hero in relatedHeroes"
              :key="hero.id"
              class="hero-card"
              @click="navigateToHero(hero.id)"
            >
              <img 
                :src="`/img/heroes/${hero.id}.jpg`" 
                :alt="hero.name"
                class="hero-avatar"
                @error="onImgError"
              />
              <div class="hero-info">
                <h4>{{ hero.name }}</h4>
                <p class="hero-family">{{ hero.family }}</p>
                <p class="hero-sm-bio">{{ hero.smbio }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Другие фрагменты этого события -->
        <section v-if="eventOtherFragments.length > 1" class="connection-section">
          <h3>📖 Другие фрагменты этого события</h3>
          <div class="fragments-list">
            <RouterLink 
              v-for="otherFragment in eventOtherFragments"
              :key="otherFragment.id"
              :to="`/text/${otherFragment.id}`"
              class="fragment-link"
              :class="{ active: otherFragment.id === fragment?.id }"
            >
              <span class="fragment-ref">{{ otherFragment.id }}</span>
              <span class="fragment-title-small">{{ otherFragment.title }}</span>
            </RouterLink>
          </div>
        </section>

        <!-- Навигация по фрагментам -->
        <section class="navigation-section">
          <h3>📚 Навигация по тексту</h3>
          <div class="fragment-navigation">
            <RouterLink 
              v-if="previousFragment"
              :to="`/text/${previousFragment.id}`"
              class="nav-link prev-link"
            >
              ← {{ previousFragment.title }}
            </RouterLink>
            <RouterLink 
              v-if="nextFragment"
              :to="`/text/${nextFragment.id}`"
              class="nav-link next-link"
            >
              {{ nextFragment.title }} →
            </RouterLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useData } from '../composables/useData.js'

const route = useRoute()
const router = useRouter()
const { loadAll, loading, error, eventsById, heroesById, heroes, textFragments } = useData()

const fragmentId = computed(() => route.params.id)
const fragment = computed(() => 
  textFragments.value?.find(f => f.id === fragmentId.value)
)

// Связанное событие
const relatedEvent = computed(() => {
  if (!fragment.value?.eventId || !eventsById.value) return null
  return eventsById.value[fragment.value.eventId]
})

// Связанные персонажи (из фрагмента)
const relatedHeroes = computed(() => {
  if (!fragment.value?.heroes || !heroes.value) return []
  return fragment.value.heroes
    .map(heroId => heroes.value.find(h => h.id === heroId))
    .filter(Boolean)
})

// Другие фрагменты этого же события
const eventOtherFragments = computed(() => {
  if (!fragment.value?.eventId || !textFragments.value) return []
  return textFragments.value
    .filter(f => f.eventId === fragment.value.eventId)
    .sort((a, b) => a.id.localeCompare(b.id))
})

// Навигация по фрагментам
const fragmentIndex = computed(() => 
  textFragments.value?.findIndex(f => f.id === fragmentId.value) ?? -1
)

const previousFragment = computed(() => 
  fragmentIndex.value > 0 ? textFragments.value[fragmentIndex.value - 1] : null
)

const nextFragment = computed(() => 
  fragmentIndex.value < textFragments.value.length - 1 && fragmentIndex.value !== -1 ? 
  textFragments.value[fragmentIndex.value + 1] : null
)

// Вспомогательные функции
const getHeroName = (heroId) => {
  return heroesById.value?.[heroId]?.name || heroId
}

const formatEventDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const onImgError = (e) => {
  e.target.src = '/img/tolstoy.jpg'
}

const navigateToHero = (heroId) => {
  router.push({
    path: '/heroes',
    query: { heroId }
  })
}

onMounted(async () => {
  await loadAll()
})
</script>

<style scoped>
.text-fragment-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 40px;
  text-align: center;
}

.back-btn {
  background: none;
  border: 1px solid var(--peach);
  color: var(--peach);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: var(--peach);
  color: white;
}

.fragment-title {
  color: var(--peach);
  font-size: 2.2em;
  margin: 0 0 16px;
  line-height: 1.3;
}

.fragment-meta {
  color: var(--text-secondary);
  font-size: 1.1em;
  margin: 0;
}

.fragment-content {
  display: grid;
  gap: 40px;
}

.text-container {
  background: var(--card);
  padding: 40px;
  border-radius: 16px;
  border: 2px solid var(--line);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.fragment-text {
  font-size: 1.2em;
  line-height: 1.8;
  margin: 0;
  text-align: justify;
  color: var(--text);
}

.fragment-connections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.connection-section h3 {
  color: var(--peach);
  margin-bottom: 20px;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Стили для связанного события */
.event-link {
  display: block;
  padding: 20px;
  background: var(--card);
  border-radius: 12px;
  border: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.event-link:hover {
  border-color: var(--peach);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.event-info h4 {
  margin: 0 0 8px;
  color: var(--peach);
  font-size: 1.2em;
}

.event-date {
  color: var(--text-secondary);
  margin: 0 0 12px;
  font-size: 0.9em;
}

.event-summary {
  margin: 0 0 16px;
  line-height: 1.5;
  color: var(--text);
}

.event-participants {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.participants-label {
  font-size: 0.9em;
  color: var(--text-secondary);
}

.participants-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.participant-tag {
  background: rgba(187, 148, 87, 0.1);
  color: var(--peach);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8em;
  border: 1px solid rgba(187, 148, 87, 0.3);
}

.more-participants {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8em;
}

/* Стили для связанных персонажей */
.heroes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.hero-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--card);
  border-radius: 12px;
  border: 1px solid var(--line);
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-card:hover {
  border-color: var(--peach);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hero-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.hero-info {
  flex: 1;
  min-width: 0;
}

.hero-info h4 {
  margin: 0 0 4px;
  font-size: 1em;
  color: var(--peach);
}

.hero-family {
  margin: 0 0 4px;
  font-size: 0.9em;
  color: var(--text-secondary);
}

.hero-sm-bio {
  margin: 0;
  font-size: 0.8em;
  color: var(--text);
  line-height: 1.4;
}

/* Стили для других фрагментов события */
.fragments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fragment-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--card);
  border-radius: 8px;
  border: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.fragment-link:hover {
  border-color: var(--peach);
  transform: translateX(4px);
  text-decoration: none;
}

.fragment-link.active {
  border-color: var(--peach);
  background: rgba(187, 148, 87, 0.1);
}

.fragment-ref {
  background: var(--peach);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
}

.fragment-title-small {
  flex: 1;
  font-size: 0.9em;
  line-height: 1.4;
}

/* Навигация по фрагментам */
.fragment-navigation {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.nav-link {
  padding: 16px;
  background: var(--card);
  border-radius: 12px;
  border: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  text-align: center;
}

.nav-link:hover {
  border-color: var(--peach);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.prev-link {
  text-align: left;
}

.next-link {
  text-align: right;
}

@media (max-width: 768px) {
  .text-fragment-page {
    padding: 16px;
  }
  
  .fragment-title {
    font-size: 1.8em;
  }
  
  .text-container {
    padding: 24px;
  }
  
  .fragment-text {
    font-size: 1.1em;
  }
  
  .fragment-navigation {
    grid-template-columns: 1fr;
  }
  
  .heroes-grid {
    grid-template-columns: 1fr;
  }
  
  .event-participants {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .participants-list {
    margin-top: 4px;
  }
}

@media (max-width: 480px) {
  .fragment-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .fragment-ref {
    align-self: flex-start;
  }
}
</style>