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
  name: 'AdminLayout',
  components: {
    AppSidebar,
    MainContent
  }
};
</script>

<style scoped>
.main-content-area {
  /* Hapus margin-left yang hardcode. Vuetify akan mengelola ini secara otomatis */
  margin-left: 280px !important; 
  height: 100vh;
  overflow-y: auto;
  padding: 0 !important;
}

@media (max-width: 1264px) {
  .main-content-area {
    /* Ini tetap relevan untuk breakpoint mobile jika sidebar disembunyikan */
    margin-left: 0 !important;
  }
}
</style>
