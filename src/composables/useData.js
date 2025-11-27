// useData.js (обновленный файл)
import { ref, computed } from 'vue'

const loaded = ref(false)
const loading = ref(false)
const error = ref(null)

const heroes = ref([])
const events = ref([])
const themes = ref([])
const locations = ref([])
const textFragments = ref([])

// Загружаем сохраненные фрагменты из localStorage
function loadSavedFragments() {
  try {
    const saved = localStorage.getItem('editedFragments')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (err) {
    console.error('Error loading saved fragments:', err)
  }
  return {}
}

// Сохраняем фрагменты в localStorage
function saveFragmentsToStorage(editedFragments) {
  try {
    localStorage.setItem('editedFragments', JSON.stringify(editedFragments))
  } catch (err) {
    console.error('Error saving fragments to storage:', err)
  }
}

// Объединяем оригинальные данные с сохраненными изменениями
function mergeWithSavedFragments(originalFragments) {
  const savedFragments = loadSavedFragments()
  if (Object.keys(savedFragments).length === 0) {
    return originalFragments
  }

  return originalFragments.map(fragment => {
    const savedFragment = savedFragments[fragment.id]
    if (savedFragment) {
      return {
        ...fragment,
        ...savedFragment,
        // Сохраняем оригинальный ID, чтобы не перезаписать его
        id: fragment.id
      }
    }
    return fragment
  })
}

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
    
    // Объединяем с сохраненными изменениями
    textFragments.value = mergeWithSavedFragments(txt)
    
    loaded.value = true
  } catch (err) {
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

// Функция для обновления фрагмента
async function updateFragment(fragmentId, updatedData) {
  try {
    // Находим индекс фрагмента
    const index = textFragments.value.findIndex(f => f.id === fragmentId)
    if (index === -1) {
      throw new Error(`Fragment with id ${fragmentId} not found`)
    }

    // Сохраняем оригинальный ID и создаем обновленный объект
    const updatedFragment = {
      ...textFragments.value[index],
      ...updatedData,
      id: fragmentId // Гарантируем, что ID не изменится
    }

    // Обновляем в основном массиве
    textFragments.value[index] = updatedFragment

    // Загружаем текущие сохраненные фрагменты
    const savedFragments = loadSavedFragments()
    
    // Обновляем сохраненную версию
    savedFragments[fragmentId] = updatedData
    
    // Сохраняем обратно в localStorage
    saveFragmentsToStorage(savedFragments)

    console.log(`Fragment ${fragmentId} updated successfully`)
    return updatedFragment

  } catch (err) {
    console.error('Error updating fragment:', err)
    error.value = err?.message || String(err)
    throw err
  }
}

// Новая функция для экспорта обновленного JSON и скачивания файла
function exportUpdatedJson() {
  try {
    const updatedJson = JSON.stringify(textFragments.value, null, 2)
    const blob = new Blob([updatedJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    // Создаем ссылку для скачивания
    const a = document.createElement('a')
    a.href = url
    a.download = 'text-fragments-updated.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('Updated JSON exported and downloaded successfully')
  } catch (err) {
    console.error('Error exporting JSON:', err)
    alert('Ошибка при экспорте JSON файла')
  }
}

// Функция для сброса изменений фрагмента
function resetFragment(fragmentId) {
  try {
    // Загружаем текущие сохраненные фрагменты
    const savedFragments = loadSavedFragments()
    
    // Удаляем фрагмент из сохраненных
    if (savedFragments[fragmentId]) {
      delete savedFragments[fragmentId]
      saveFragmentsToStorage(savedFragments)
    }

    // Перезагружаем данные, чтобы восстановить оригинальную версию
    loadAll()

    console.log(`Fragment ${fragmentId} reset to original`)
    return true

  } catch (err) {
    console.error('Error resetting fragment:', err)
    error.value = err?.message || String(err)
    return false
  }
}

// Функция для получения оригинального фрагмента (без сохраненных изменений)
async function getOriginalFragment(fragmentId) {
  try {
    const response = await fetch('/data/text-fragments.json')
    const allFragments = await response.json()
    return allFragments.find(f => f.id === fragmentId)
  } catch (err) {
    console.error('Error loading original fragment:', err)
    return null
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
    updateFragment,
    resetFragment,
    getOriginalFragment,
    exportUpdatedJson  // Добавляем новую функцию в экспорт
  }
}