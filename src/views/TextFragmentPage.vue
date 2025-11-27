<template>
  <div class="text-fragment-page">
    <div class="page-header">
      <button class="back-btn" @click="router.back()">← Назад</button>
      <div class="title-section">
        <input 
          v-if="isEditing"
          v-model="editableFragment.title"
          class="edit-title"
          placeholder="Название фрагмента"
        >
        <h1 v-else class="fragment-title">{{ fragment?.title }}</h1>
        
        <div class="edit-controls">
          <button 
            v-if="!isEditing"
            @click="startEditing"
            class="edit-btn"
            title="Редактировать фрагмент"
          >
            ✏️ Редактировать
          </button>
          <div v-else class="edit-actions">
            <button 
              @click="saveFragment"
              class="save-btn"
              :disabled="!hasChanges || isSaving"
            >
              {{ isSaving ? 'Сохранение...' : '💾 Сохранить' }}
            </button>
            <button 
              @click="cancelEditing"
              class="cancel-btn"
              :disabled="isSaving"
            >
              ❌ Отмена
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="isEditing" class="edit-meta">
        <div class="meta-fields">
          <div class="meta-field">
            <label>Том:</label>
            <input 
              v-model.number="editableFragment.volume"
              type="number"
              min="1"
              class="meta-input"
            >
          </div>
          <div class="meta-field">
            <label>Глава:</label>
            <input 
              v-model.number="editableFragment.chapter"
              type="number"
              min="1"
              class="meta-input"
            >
          </div>
        </div>
      </div>
    </div>

    <div class="fragment-content">
      <div class="text-container">
        <textarea 
          v-if="isEditing"
          v-model="editableFragment.text"
          class="edit-textarea"
          placeholder="Текст фрагмента..."
          rows="15"
        ></textarea>
        <p v-else class="fragment-text">{{ fragment?.text }}</p>
      </div>

      <!-- Редактирование связанных персонажей -->
      <section v-if="isEditing" class="connection-section">
        <h3>👥 Управление участниками фрагмента</h3>
        <div class="heroes-management">
          <div class="available-heroes">
            <h4>Доступные персонажи:</h4>
            <div class="heroes-select-list">
              <div
                v-for="hero in allHeroes"
                :key="hero.id"
                class="hero-select-item"
                :class="{ selected: isHeroSelected(hero.id) }"
                @click="toggleHeroSelection(hero.id)"
              >
                <img 
                  :src="`/img/heroes/${hero.id}.jpg`" 
                  :alt="hero.name"
                  class="hero-avatar-small"
                  @error="onImgError"
                />
                <span class="hero-name">{{ hero.name }}</span>
                <span class="hero-family">{{ hero.family }}</span>
              </div>
            </div>
          </div>
          
          <div class="selected-heroes">
            <h4>Выбранные персонажи ({{ editableFragment.heroes.length }}):</h4>
            <div class="selected-list">
              <div
                v-for="heroId in editableFragment.heroes"
                :key="heroId"
                class="selected-hero-item"
              >
                <span>{{ getHeroName(heroId) }}</span>
                <button 
                  @click="removeHero(heroId)"
                  class="remove-hero-btn"
                  title="Удалить персонажа"
                >
                  ×
                </button>
              </div>
              <div v-if="!editableFragment.heroes.length" class="no-heroes">
                Персонажи не выбраны
              </div>
            </div>
          </div>
        </div>
      </section>

      <div v-else class="fragment-connections">
        <!-- Остальные секции (связанное событие, персонажи, другие фрагменты, навигация) -->
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

    <!-- Уведомление об успешном сохранении -->
    <div v-if="showSaveNotification" class="save-notification">
      ✅ Фрагмент успешно сохранен!
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useData } from '../composables/useData.js'

const route = useRoute()
const router = useRouter()
const { loadAll, loading, error, eventsById, heroesById, heroes, textFragments, updateFragment, exportUpdatedJson } = useData()

const fragmentId = computed(() => route.params.id)
const fragment = computed(() => 
  textFragments.value?.find(f => f.id === fragmentId.value)
)

// Состояние редактирования
const isEditing = ref(false)
const isSaving = ref(false)
const showSaveNotification = ref(false)
const editableFragment = ref({})
const originalFragment = ref({})

// Состояния для управления персонажами
const allHeroes = computed(() => heroes.value || [])

// Вычисляемые свойства
const relatedEvent = computed(() => {
  if (!fragment.value?.eventId || !eventsById.value) return null
  return eventsById.value[fragment.value.eventId]
})

const relatedHeroes = computed(() => {
  if (!fragment.value?.heroes || !heroes.value) return []
  return fragment.value.heroes
    .map(heroId => heroes.value.find(h => h.id === heroId))
    .filter(Boolean)
})

const eventOtherFragments = computed(() => {
  if (!fragment.value?.eventId || !textFragments.value) return []
  return textFragments.value
    .filter(f => f.eventId === fragment.value.eventId)
    .sort((a, b) => a.id.localeCompare(b.id))
})

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

// Проверка изменений
const hasChanges = computed(() => {
  return JSON.stringify(editableFragment.value) !== JSON.stringify(originalFragment.value)
})

// Функции редактирования
const startEditing = () => {
  if (!fragment.value) return
  
  originalFragment.value = { ...fragment.value }
  editableFragment.value = { 
    ...fragment.value,
    heroes: [...(fragment.value.heroes || [])]
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editableFragment.value = {}
  originalFragment.value = {}
}

const saveFragment = async () => {
  if (!hasChanges.value || !fragment.value) return
  
  isSaving.value = true
  try {
    await updateFragment(fragment.value.id, editableFragment.value)
    
    // После сохранения экспортируем обновленный JSON и скачиваем его
    exportUpdatedJson()
    
    // Показываем уведомление
    showSaveNotification.value = true
    setTimeout(() => {
      showSaveNotification.value = false
    }, 3000)
    
    isEditing.value = false
  } catch (err) {
    console.error('Ошибка при сохранении фрагмента:', err)
    alert('Произошла ошибка при сохранении')
  } finally {
    isSaving.value = false
  }
}

// Функции управления персонажами
const isHeroSelected = (heroId) => {
  return editableFragment.value.heroes?.includes(heroId)
}

const toggleHeroSelection = (heroId) => {
  if (!editableFragment.value.heroes) {
    editableFragment.value.heroes = []
  }
  
  const index = editableFragment.value.heroes.indexOf(heroId)
  if (index > -1) {
    editableFragment.value.heroes.splice(index, 1)
  } else {
    editableFragment.value.heroes.push(heroId)
  }
}

const removeHero = (heroId) => {
  const index = editableFragment.value.heroes.indexOf(heroId)
  if (index > -1) {
    editableFragment.value.heroes.splice(index, 1)
  }
}

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

// Следим за изменением фрагмента
watch(fragment, (newFragment) => {
  if (newFragment && !isEditing.value) {
    editableFragment.value = {}
    originalFragment.value = {}
  }
})

onMounted(async () => {
  await loadAll()
})
</script>

<style scoped>
.text-fragment-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
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

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
}

.edit-title {
  flex: 1;
  font-size: 2.2em;
  font-weight: bold;
  color: var(--peach);
  border: 2px solid var(--line);
  border-radius: 8px;
  padding: 8px 12px;
  background: var(--card);
  font-family: inherit;
}

.fragment-title {
  color: var(--peach);
  font-size: 2.2em;
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.edit-controls {
  flex-shrink: 0;
}

.edit-btn, .save-btn, .cancel-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;
  margin-left: 8px;
}

.edit-btn {
  background: var(--peach);
  color: white;
}

.edit-btn:hover {
  background: #a67c52;
}

.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #218838;
}

.save-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background: #c82333;
}

.edit-meta {
  margin-bottom: 20px;
}

.meta-fields {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.meta-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-field label {
  font-size: 0.9em;
  color: var(--text-secondary);
  text-align: center;
}

.meta-input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--card);
  text-align: center;
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

.edit-textarea {
  width: 100%;
  border: none;
  background: none;
  resize: vertical;
  font-size: 1.2em;
  line-height: 1.8;
  font-family: inherit;
  color: var(--text);
  min-height: 300px;
}

.edit-textarea:focus {
  outline: none;
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
/* Стили для управления персонажами */
.heroes-management {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.event-link:hover {
  border-color: var(--peach);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.available-heroes, .selected-heroes {
  background: var(--card);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--line);
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
.available-heroes h4, .selected-heroes h4 {
  margin: 0 0 16px;

  color: var(--peach);
  font-size: 1.1em;
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
.heroes-select-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.hero-select-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.hero-select-item:hover {
  background: rgba(187, 148, 87, 0.1);
}

.hero-select-item.selected {
  background: rgba(187, 148, 87, 0.2);
  border-color: var(--peach);
}

.hero-avatar-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.hero-name {
  font-weight: 500;
  flex: 1;
}

.hero-family {
  font-size: 0.8em;
  color: var(--text-secondary);
}

.selected-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selected-hero-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(187, 148, 87, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(187, 148, 87, 0.3);
}

.remove-hero-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-hero-btn:hover {
  background: #dc3545;
  color: white;
  border-radius: 50%;
}

.no-heroes {
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
  padding: 20px;
}

/* Уведомление о сохранении */
.save-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .text-fragment-page {
    padding: 16px;
  }
  
  .title-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .edit-title {
    font-size: 1.8em;
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
  
  .heroes-management {
    grid-template-columns: 1fr;
  }
  
  .meta-fields {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .edit-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .edit-btn, .save-btn, .cancel-btn {
    margin-left: 0;
    width: 100%;
  }
}
</style>