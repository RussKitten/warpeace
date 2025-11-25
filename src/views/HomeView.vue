<template>
  <section class="card hero">
    <div class="hero-content">
      <h1>Путеводитель по «Войне и миру»</h1>
      <p class="podpis">Проект выполнен Давыдовым Антоном 11Г</p>
      <p class="lead">
        "Война и мир" — это не только исторический роман, но и философское размышление о жизни, смерти, любви и поиске смысла. Ключевые события романа показывают, как герои через страдания и разочарования приходят к духовному перерождению. Толстой утверждает, что истинное счастье возможно только через преодоление эгоизма и принятие жизни во всей её сложности.
      </p>
      <div class="row buttons-row">
        <a
          class="btn btn-ghost"
          href="https://ru.wikisource.org/wiki/%D0%92%D0%BE%D0%B9%D0%BD%D0%B0_%D0%B8_%D0%BC%D0%B8%D1%80_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)"
          target="_blank" rel="noopener"
        >
          Читать роман (Викиисточник)
        </a>
        <a
          class="btn btn-ghost"
          href="https://www.culture.ru/live/movies/467/voina-i-mir"
          target="_blank" rel="noopener"
        >
          Смотреть фильм по роману
        </a>
      </div>
      <hr class="sep" />
      <ul class="clean features-list">
        <li>• Герои: краткие биографии, связи и эпизоды</li>
        <li>• События: даты, участники, места</li>
        <li>• Темы: идеи, мотивы, примеры глав</li>
        <li>• Таймлайн: хронология ключевых эпизодов</li>
        <li>• Карта: локации и маршруты</li>
      </ul>
    </div>
    <div class="hero-image-container">
      <img
        class="hero-img"
        alt="Портрет Л. Н. Толстого (Ге Николай, 1884)"
        src="/img/tolstoy.jpg"
      />
      <div class="caption">
        Портрет Л. Н. Толстого (Ге Николай, 1884). Источник:
        <a
          href="https://my.tretyakov.ru/app/masterpiece/8454"
          target="_blank" rel="noopener"
        >
          Сайт Третьяковской Галереи
        </a>,
        общественное достояние.
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
  background: var(--card);
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.hero-content {
  flex: 1;
}

.hero-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.hero-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid rgba(255, 230, 167, 0.35);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

h1 {
  font-size: 24px;
  color: var(--peach);
  margin: 0 0 12px;
  text-align: center;
}

.lead {
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  margin: 0 0 16px;
  font-style: italic;
}

.buttons-row {
  justify-content: center;
  margin: 14px 0 10px;
  gap: 12px;
}

/* Исправленные стили для кнопок */
a.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--peach);
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  font-family: 'Crimson Text', serif;
  letter-spacing: 0.5px;
}

a.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

a.btn:hover::before {
  left: 100%;
}

a.btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  text-decoration: none;
}

a.btn:active {
  transform: translateY(-1px) scale(1);
  transition-duration: 0.1s;
}

a.btn-ghost {
  border-color: rgba(255, 230, 167, 0.45);
  background: rgba(255, 230, 167, 0.08);
}

a.btn-ghost:hover {
  background: rgba(255, 230, 167, 0.15);
  border-color: rgba(255, 230, 167, 0.6);
  box-shadow: 
    0 12px 30px rgba(187, 148, 87, 0.3),
    0 0 0 1px rgba(255, 230, 167, 0.3);
}

.small {
  color: var(--muted);
  font-size: 14px;
  text-align: center;
}

.sep {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--line) 20%, 
    var(--gold) 50%, 
    var(--line) 80%, 
    transparent);
  margin: 24px 0;
  position: relative;
}

.sep::before {
  content: '⚜️';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card);
  padding: 0 12px;
  font-size: 14px;
  color: var(--gold);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.features-list li {
  margin: 8px 0;
  font-size: 14px;
  position: relative;
  padding-left: 8px;
}

.features-list li::before {
  content: '❖';
  position: absolute;
  left: -16px;
  color: var(--gold);
  opacity: 0.7;
}

.caption {
  margin-top: 6px;
  color: var(--muted);
  font-size: 12px;
  text-align: center;
}

.caption a {
  color: var(--peach);
  text-decoration: none;
  transition: all 0.3s ease;
}

.caption a:hover {
  color: var(--gold);
  text-decoration: underline;
}

.podpis{
  margin-top: 6px;
  color: var(--muted);
  font-size: 12px;
  text-align: left;
}

@media (min-width: 600px) {
  .hero {
    flex-direction: row;
    align-items: center;
    gap: 32px;
    padding: 24px;
  }

  .hero-content {
    flex: 2;
  }

  .hero-image-container {
    flex: 1;
  }

  h1 {
    font-size: 32px;
    text-align: left;
  }

  .lead {
    font-size: 18px;
    text-align: left;
  }

  .buttons-row {
    justify-content: flex-start;
  }

  .small {
    text-align: left;
  }

  .features-list {
    text-align: left;
  }

  .hero-img {
    max-width: 300px;
  }
}

@media (min-width: 900px) {
  h1 {
    font-size: 36px;
  }

  .lead {
    font-size: 20px;
  }

  .hero-img {
    max-width: 350px;
  }
  
  a.btn {
    padding: 14px 24px;
    font-size: 16px;
  }
}
</style>