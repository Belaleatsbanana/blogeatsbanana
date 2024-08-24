<script setup lang="ts">
import { computed } from 'vue';
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router';
import BlogHeader from './components/BlogHeader.vue';

const route = useRoute();

const showNavBar = computed(() => route.meta.showNav);
const showBlogHeader = computed(() => route.meta.showHeader);
</script>

<template>
  <main :class="{ 'with-navbar': showNavBar }" class="display-flex">
    <nav v-if="showNavBar">
      <NavBar />
    </nav>
    <section class="RouterView">
      <BlogHeader v-if="showBlogHeader" />
      <RouterView />
    </section>
  </main>
</template>

<style scoped>
.display-flex {
  display: flex;
  flex-direction: row;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 180px;
  height: 100%;
  background-color: var(--color-background-1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.RouterView {
  flex: 1;
}

.with-navbar .RouterView {
  margin-left: 180px;
}
</style>
