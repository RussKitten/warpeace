<template>
  <section>
    <h2 class="section-title">Герои</h2>
    <SearchBox v-model="q" placeholder="Поиск по героям…" />
    <hr class="sep" />
    <div v-if="loading">Загрузка…</div>
    <div v-else-if="error" class="small">Ошибка: {{ error }}</div>
    <div class="grid" v-else>
      <article
        v-for="ch in filtered"
        :key="ch.id"
        :ref="el => { if (el) cardRefs[ch.id] = el }"
        :class="['card', { expanded: expandedIds.has(ch.id) }]"
      >
        <h3>
          <a href="#" @click.prevent="toggle(ch.id)">{{ ch.name }}</a>
        </h3>
        <p class="small mono">{{ ch.family }}</p>
        <p>{{ ch.smbio }}</p>
        <div class="row" v-if="ch.aliases?.length">
          <span class="tag" v-for="a in ch.aliases" :key="a">Также: {{ a }}</span>
        </div>
        <div v-if="expandedIds.has(ch.id)" class="expanded-content">
          <img class="portrait" :src="`/img/heroes/${ch.id}.jpg`" :alt="ch.name" @error="onImgError" />
          <div class="details">
            <p class="bio">{{ ch.bio }}</p>
            <div v-if="ch.links?.relatives?.length" class="row wrap">
              <span class="label">Родственники:</span>
              <a
                v-for="rid in ch.links.relatives"
                :key="rid"
                class="tag"
                href="#"
                @click.prevent="toggle(rid)"
              >
                {{ idToName[rid] || rid }}
              </a>
            </div>
            <div v-if="ch.links?.events?.length" class="row wrap">
              <span class="label">События:</span>
              <RouterLink v-for="eid in ch.links.events" :key="eid" class="tag" :to="`/events/${eid}`">
                {{ eventsById[eid]?.title || eid }}
              </RouterLink>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useData } from '../composables/useData.js'
import SearchBox from '../components/SearchBox.vue'

const { loadAll, loading, error, heroes, eventsById } = useData()
const route = useRoute()
const router = useRouter()
const q = ref('')
const expandedIds = reactive(new Set())
const cardRefs = reactive({})

const toggle = async (id) => {
  if (expandedIds.has(id)) {
    expandedIds.delete(id)
    return
  }
  
  expandedIds.add(id)
  if (expandedIds.size > 3) {
    const first = expandedIds.values().next().value
    expandedIds.delete(first)
  }
  
  await nextTick()
  const el = cardRefs[id]
  if (el && typeof el.scrollIntoView === 'function') {
    // Прокручиваем к элементу с отступом от верха
    el.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    })
  }
}

const idToName = computed(() => {
  const m = {}
  for (const h of heroes.value) m[h.id] = h.name
  return m
})

const onImgError = (e) => {
  e.target.src = '/img/tolstoy.jpg'
}

onMounted(() => {
  loadAll().then(() => {
    // После загрузки данных проверяем heroId из query параметров
    if (route.query.heroId) {
      const heroId = route.query.heroId
      if (heroes.value.some(hero => hero.id === heroId)) {
        expandedIds.add(heroId)
        nextTick(() => {
          const el = cardRefs[heroId]
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            })
          }
        })
      }
    }
  })
})

// Watch for changes in the route query to expand the appropriate hero
watch(
  () => route.query.heroId,
  (heroId) => {
    if (heroId && heroes.value) {
      const heroExists = heroes.value.some(hero => hero.id === heroId)
      if (heroExists) {
        expandedIds.add(heroId)
        nextTick(() => {
          const el = cardRefs[heroId]
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            })
          }
        })
      }
    }
  }
)

const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  if (!t) return heroes.value
  return heroes.value.filter(h =>
    [h.name, h.family, h.bio, ...(h.aliases || [])]
      .join(' ')
      .toLowerCase()
      .includes(t)
  )
})
</script>

<style scoped>
.back-button-container {
  margin-bottom: 16px;
}

.back-button {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: var(--peach);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(187, 148, 87, 0.2);
  transform: translateY(-1px);
}

.card {
  border: 1px solid var(--line);
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: var(--card);
  margin-bottom: 12px;
  scroll-margin-top: 20px; /* Добавляем отступ для прокрутки */
}
.card h3 {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 0 0 8px;
}
.card h3 a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.card h3 a:hover {
  text-decoration: underline;
}
.card.expanded {
  grid-column: 1 / -1;
}
.expanded-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 12px;
  align-items: start;
}
.portrait {
  width: 100%;
  max-width: 150px;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 8px;
  background: #f1f1f1;
}
.details .row.wrap {
  flex-wrap: wrap;
  gap: 8px;
}
.label {
  font-weight: 600;
  margin-right: 8px;
}
.tag {
  margin-top: 4px;
  cursor: pointer;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}
@media (min-width: 600px) {
  .expanded-content {
    grid-template-columns: 150px 1fr;
  }
  .portrait {
    max-width: 150px;
  }
}
</style>