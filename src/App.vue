<template>
  <header @click="toggleMenu">
    <nav class="nav" :class="{ 'nav--open': isMenuOpen }">
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/heroes">Герои</RouterLink>
      <RouterLink to="/events">События</RouterLink>
      <RouterLink to="/themes">Темы</RouterLink>
      <RouterLink to="/timeline">Таймлайн</RouterLink>
      <RouterLink to="/map">Карта</RouterLink>
    </nav>
  </header>
  <main class="container my-3">
    <RouterView />
  </main>
</template>

<script setup>
  import { ref } from 'vue';
  const isMenuOpen = ref(false);
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
</script>