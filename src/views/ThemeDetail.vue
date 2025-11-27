<template>
  <h1 @click="() => $router.go(-1)" class="back-card">Назад</h1>
  <section v-if="th" class="theme-card card">
    <h2 class="section-title">{{ th.title }}</h2>
    <p class="theme-summary">{{ th.summary }}</p>

    <!-- Полное описание темы -->
    <div v-if="th.description" class="theme-section">
      <h3 class="theme-subtitle">Подробное описание</h3>
      <p class="theme-description">{{ th.description }}</p>
    </div>

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

    <!-- Блок аргументов для сочинения -->
    <div v-if="groupedArguments?.length" class="theme-section">
      <h3 class="theme-subtitle">Аргументы для сочинения</h3>
      <div class="arguments-container">
        <div 
          v-for="group in groupedArguments" 
          :key="group.aspect" 
          class="argument-group"
        >
          <h4 
            class="argument-question clickable"
            @click="openArgumentModal(group)"
          >
            {{ group.aspect }}
          </h4>
        </div>
      </div>
    </div>
  </section>
  <section v-else class="not-found small">Тема не найдена.</section>

  <!-- Модальное окно для аргументов группы -->
  <div v-if="showArgumentModal" class="modal-overlay" @click="closeArgumentModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeArgumentModal">×</button>
      <h3 class="modal-title">{{ selectedGroup?.aspect }}</h3>
      <div class="modal-body">
        <div 
          v-for="(argument, index) in selectedGroup?.arguments" 
          :key="index"
          class="argument-item"
        >
          <div v-if="argument.examples?.length" class="argument-section">
            <h4>Аргумент {{ index + 1 }}:</h4>
            <div class="argument-examples">
              <p v-for="(example, exampleIndex) in argument.examples" :key="exampleIndex" class="example-item">
                {{ example }}
              </p>
            </div>
          </div>
          <div v-if="argument.quotes?.length" class="argument-section">
            <h4>Цитаты:</h4>
            <div class="argument-quotes">
              <div v-for="(quote, quoteIndex) in argument.quotes" :key="quoteIndex" class="quote-item">
                "{{ quote }}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useData } from '../composables/useData.js'

const route = useRoute()
const { loadAll, themesById, heroesById, eventsById } = useData()

// Состояние для модального окна
const showArgumentModal = ref(false)
const selectedGroup = ref(null)

onMounted(loadAll)

const th = computed(() => themesById.value[route.params.id])

// Группируем аргументы по вопросам (aspect)
const groupedArguments = computed(() => {
  if (!th.value?.arguments) return []
  
  const groups = {}
  
  th.value.arguments.forEach(argument => {
    if (!groups[argument.aspect]) {
      groups[argument.aspect] = {
        aspect: argument.aspect,
        arguments: []
      }
    }
    groups[argument.aspect].arguments.push(argument)
  })
  
  return Object.values(groups)
})

// Функции для работы с модальным окном
const openArgumentModal = (group) => {
  selectedGroup.value = group
  showArgumentModal.value = true
}

const closeArgumentModal = () => {
  showArgumentModal.value = false
  selectedGroup.value = null
}

// Закрытие модального окна по ESC
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeArgumentModal()
  }
}

// Добавляем обработчик клавиш
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

// Убираем обработчик при уничтожении компонента
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.back-card {
  cursor: pointer;
  text-align: center;
  margin: 16px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: var(--card);
}

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

.theme-description {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  text-align: justify;
  color: rgba(255, 255, 255, 0.9);
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
  transition: all 0.3s ease;
}

.hero-tag:hover {
  background: linear-gradient(180deg, rgba(187, 148, 87, 0.4), rgba(153, 88, 42, 0.4));
  transform: translateY(-2px);
}

.episodes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.episode-item {
  margin: 8px 0;
  padding: 12px;
  border-radius: 8px;
  background: rgba(67, 40, 24, 0.2);
  transition: background 0.3s ease;
}

.episode-item:hover {
  background: rgba(67, 40, 24, 0.3);
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
  color: rgba(255, 255, 255, 0.7);
}

/* Стили для блока аргументов */
.arguments-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.argument-group {
  padding: 20px;
  border-radius: 12px;
  background: rgba(67, 40, 24, 0.1);
  border-left: 4px solid var(--peach);
  transition: all 0.3s ease;
}

.argument-group:hover {
  background: rgba(67, 40, 24, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.argument-question {
  font-size: 20px;
  color: var(--peach);
  margin: 0;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.argument-question:hover {
  color: #ffb86c;
  text-decoration: underline;
}

.clickable {
  cursor: pointer;
}

.not-found {
  text-align: center;
  padding: 20px;
}

/* Стили для модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
  overflow-y: auto;
}

.modal-content {
  background: var(--card);
  border-radius: 14px;
  padding: 24px;
  max-width: 700px;
  width: 100%;
  margin: 40px auto;
  position: relative;
  border: 1px solid var(--line);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 28px;
  color: var(--peach);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;
  z-index: 1001;
}

.modal-close:hover {
  background: rgba(187, 148, 87, 0.1);
}

.modal-title {
  font-size: 24px;
  color: var(--peach);
  margin: 0 0 20px 0;
  padding-right: 40px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.argument-item {
  padding: 20px;
  border-radius: 8px;
  background: rgba(67, 40, 24, 0.1);
  border: 1px solid rgba(187, 148, 87, 0.2);
}

.argument-section h4 {
  color: var(--peach);
  margin: 0 0 12px 0;
  font-size: 18px;
  border-bottom: 1px solid rgba(187, 148, 87, 0.3);
  padding-bottom: 8px;
}

.argument-examples p {
  line-height: 1.6;
  margin: 12px 0;
  text-align: justify;
}

.example-item {
  background: rgba(67, 40, 24, 0.15);
  padding: 12px;
  margin: 8px 0;
  border-radius: 6px;
  border-left: 3px solid rgba(153, 88, 42, 0.5);
}

.argument-quotes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quote-item {
  background: rgba(187, 148, 87, 0.1);
  padding: 12px;
  margin: 8px 0;
  border-radius: 6px;
  border-left: 3px solid var(--peach);
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
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
  }

  .theme-description {
    font-size: 16px;
  }

  .theme-subtitle {
    font-size: 22px;
  }

  .hero-tag {
    padding: 8px 16px;
    font-size: 16px;
  }

  .argument-question {
    font-size: 22px;
  }

  .modal-content {
    padding: 32px;
  }

  .modal-title {
    font-size: 26px;
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

  .arguments-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .argument-group {
    padding: 24px;
  }

  .argument-question {
    font-size: 24px;
  }

  .modal-content {
    max-width: 800px;
  }
}

/* Медиа-запрос для очень высоких экранов */
@media (min-height: 800px) {
  .modal-overlay {
    align-items: center;
  }
  
  .modal-content {
    margin: 20px auto;
  }
}
</style>