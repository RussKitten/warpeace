<template>
  <section class="card hero">
    <div class="hero-content">
      <h1>Путеводитель по «Войне и миру»</h1>
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
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--peach);
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  transition: transform 0.06s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-ghost {
  border-color: transparent;
  background: rgba(67, 40, 24, 0.35);
}

.btn-ghost:hover {
  background: rgba(67, 40, 24, 0.55);
}

.small {
  color: var(--muted);
  font-size: 14px;
  text-align: center;
}

.sep {
  border: none;
  border-top: 1px dashed var(--line);
  margin: 14px 0;
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
}

.caption {
  margin-top: 6px;
  color: var(--muted);
  font-size: 12px;
  text-align: center;
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
}
</style>
