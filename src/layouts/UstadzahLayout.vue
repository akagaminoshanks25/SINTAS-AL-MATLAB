<template>
  <v-app>
    <AppSidebar />
    <v-main class="main-content-area">
      <MainContent />
    </v-main>
  </v-app>
</template>

<script>
import AppSidebar from '@/components/AppSidebar.vue';
import MainContent from '@/components/MainContent.vue';

export default {
  name: 'UstadzahLayout',
  components: {
    AppSidebar,
    MainContent
  }
};
</script>

<style scoped>
.main-content-area {
  margin-left: 280px !important; /* Sidebar width */
  height: 100vh;
  overflow-y: auto;
  padding: 0 !important;
}

@media (max-width: 1264px) {
  .main-content-area {
    margin-left: 0 !important;
  }
}
</style>