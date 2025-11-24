import { ref, computed } from 'vue'

const loaded = ref(false)
const loading = ref(false)
const error = ref(null)

const heroes = ref([])
const events = ref([])
const themes = ref([])
const locations = ref([])
const textFragments = ref([])

async function loadAll() {
  if (loaded.value || loading.value) return
  loading.value = true
  error.value = null
  try {
    const [h, e, t, l, txt] = await Promise.all([
      fetch('/data/heroes.json').then(r => r.json()),
      fetch('/data/events.json').then(r => r.json()),
      fetch('/data/themes.json').then(r => r.json()),
      fetch('/data/locations.json').then(r => r.json()),
      fetch('/data/text-fragments.json').then(r => r.json()),
    ])

    heroes.value = h
    events.value = e
    themes.value = t
    locations.value = l
    textFragments.value = txt// Извлекаем массив fragments из JSON
    loaded.value = true
  } catch (err) {
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

const heroesById = computed(() => Object.fromEntries(heroes.value.map(x => [x.id, x])))
const eventsById = computed(() => Object.fromEntries(events.value.map(x => [x.id, x])))
const themesById = computed(() => Object.fromEntries(themes.value.map(x => [x.id, x])))
const locationsById = computed(() => Object.fromEntries(locations.value.map(x => [x.id, x])))
const textFragmentsById = computed(() => Object.fromEntries(textFragments.value.map(x => [x.id, x])))

export function useData() {
  return {
    loadAll, loaded, loading, error,
    heroes, events, themes, locations, textFragments,
    heroesById, eventsById, themesById, locationsById, textFragmentsById,
  }
}