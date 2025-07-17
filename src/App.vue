<template>
  <v-app class="app-container">
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  overflow: hidden; /* Prevent body scroll */
}

.app-container {
  height: 100vh;
  overflow: hidden;
}

/* Global scroll styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>