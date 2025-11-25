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
    <div v-if="th.arguments?.length" class="theme-section">
      <h3 class="theme-subtitle">Аргументы для сочинения</h3>
      <div class="arguments-container">
        <div 
          v-for="argument in th.arguments" 
          :key="argument.aspect" 
          class="argument-group"
        >
          <h4 class="argument-question clickable" @click="openArgumentModal(argument)">
            {{ argument.aspect }}
          </h4>
          
          <!-- Цитаты -->
          <div v-if="argument.quotes?.length" class="argument-quotes">
            <h5 class="argument-subtitle">Цитаты:</h5>
            <ul class="clean argument-list">
              <li 
                v-for="(quote, index) in argument.quotes" 
                :key="`quote-${index}`" 
                class="argument-item quote-item"
              >
                <span class="argument-quote">«{{ quote }}»</span>
              </li>
            </ul>
          </div>
          
          <!-- Примеры -->
          <div v-if="argument.examples?.length" class="argument-examples">
            <h5 class="argument-subtitle">Примеры из текста:</h5>
            <ul class="clean argument-list">
              <li 
                v-for="(example, index) in argument.examples" 
                :key="`example-${index}`" 
                class="argument-item example-item"
              >
                {{ example }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section v-else class="not-found small">Тема не найдена.</section>

  <!-- Модальное окно для аргумента -->
  <div v-if="showArgumentModal" class="modal-overlay" @click="closeArgumentModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeArgumentModal">×</button>
      <h3 class="modal-title">{{ selectedArgument?.aspect }}</h3>
      <div class="modal-body">
        <div class="argument-text" v-if="selectedArgument?.essay_argument">
          <h4>Пример аргумента для сочинения:</h4>
          <p>{{ selectedArgument.essay_argument }}</p>
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
const selectedArgument = ref(null)

onMounted(loadAll)

const th = computed(() => themesById.value[route.params.id])

// Функции для работы с модальным окном
const openArgumentModal = (argument) => {
  selectedArgument.value = argument
  showArgumentModal.value = true
  // УБРАЛИ блокировку прокрутки body
}

const closeArgumentModal = () => {
  showArgumentModal.value = false
  selectedArgument.value = null
  // УБРАЛИ восстановление прокрутки body
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
  gap: 20px;
}

.argument-group {
  padding: 16px;
  border-radius: 8px;
  background: rgba(67, 40, 24, 0.1);
  border-left: 3px solid var(--peach);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.argument-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.argument-question {
  font-size: 18px;
  color: var(--peach);
  margin: 0 0 16px;
  font-weight: 600;
}

.clickable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.clickable:hover {
  color: #ffb86c; /* Более светлый оттенок peach */
  text-decoration: underline;
}

.argument-subtitle {
  font-size: 16px;
  color: var(--peach);
  margin: 0 0 8px;
  font-weight: 500;
  opacity: 0.9;
}

.argument-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.argument-item {
  margin: 8px 0;
  padding: 10px;
  border-radius: 6px;
  line-height: 1.5;
}

.quote-item {
  background: rgba(187, 148, 87, 0.1);
  border: 1px solid rgba(187, 148, 87, 0.2);
}

.example-item {
  background: rgba(67, 40, 24, 0.15);
  border-left: 2px solid rgba(153, 88, 42, 0.5);
}

.argument-quote {
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
}

/* Стили для цитат */
.quotes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.quote-item {
  margin: 12px 0;
  padding: 12px;
  background: rgba(187, 148, 87, 0.1);
  border-radius: 8px;
  border-left: 3px solid var(--peach);
}

.quote-text {
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

/* Стили для ссылок на текст */
.text-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.text-link {
  background: rgba(67, 40, 24, 0.3);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.8);
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
  align-items: flex-start; /* Изменили на flex-start для возможности прокрутки */
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
  overflow-y: auto; /* Добавили прокрутку для оверлея */
}

.modal-content {
  background: var(--card);
  border-radius: 14px;
  padding: 24px;
  max-width: 700px;
  width: 100%;
  margin: 40px auto; /* Добавили отступ сверху и снизу */
  position: relative;
  border: 1px solid var(--line);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  /* УБРАЛИ фиксированную высоту и overflow-y: auto */
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
  z-index: 1001; /* Чтобы кнопка была поверх всего */
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
  gap: 20px;
}

.modal-body h4 {
  color: var(--peach);
  margin: 0 0 12px 0;
  font-size: 18px;
}

.argument-text p {
  line-height: 1.6;
  margin: 0;
  text-align: justify;
}

.modal-body ul.clean {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-body .quote-item {
  background: rgba(187, 148, 87, 0.1);
  padding: 10px;
  margin: 8px 0;
  border-radius: 6px;
  border-left: 3px solid var(--peach);
  font-style: italic;
}

.modal-body .example-item {
  background: rgba(67, 40, 24, 0.15);
  padding: 10px;
  margin: 8px 0;
  border-radius: 6px;
  border-left: 3px solid rgba(153, 88, 42, 0.5);
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
    font-size: 19px;
  }

  .argument-subtitle {
    font-size: 17px;
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
    gap: 24px;
  }

  .argument-group {
    padding: 20px;
  }

  .argument-question {
    font-size: 20px;
  }

  .modal-content {
    max-width: 800px;
  }
}

/* Медиа-запрос для очень высоких экранов */
@media (min-height: 800px) {
  .modal-overlay {
    align-items: center; /* На высоких экранах центрируем по вертикали */
  }
  
  .modal-content {
    margin: 20px auto; /* Уменьшаем отступы на высоких экранах */
  }
}
</style>