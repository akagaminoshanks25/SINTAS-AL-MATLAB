<template>
  <v-app>
    <AppSidebar />
    <AppHeader />
    <v-main class="main-content-area">
      <MainContent />
    </v-main>
  </v-app>
</template>

<script>
import AppSidebar from '@/components/AppSidebar.vue';
import AppHeader from '@/components/AppHeader.vue';
import MainContent from '@/components/MainContent.vue';

export default {
  name: 'LayoutDashboard',
  components: {
    AppSidebar,
    AppHeader,
    MainContent
  }
};
</script>

<style scoped>
.main-content-area {
  overflow-y: auto;
  height: 100vh;
}
</style>