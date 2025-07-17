<template>
  <v-container fluid class="py-8">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Dashboard Santri</h2>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4">
          <v-icon size="36" class="mb-2" color="primary">mdi-book</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium">Mata Pelajaran</h3>
          <p class="text-h6 font-weight-bold">8</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4">
          <v-icon size="36" class="mb-2" color="secondary">mdi-calendar-check</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium">Kehadiran</h3>
          <p class="text-h6 font-weight-bold">95%</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4">
          <v-icon size="36" class="mb-2" color="success">mdi-trophy</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium">Prestasi</h3>
          <p class="text-h6 font-weight-bold">Baik</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'StudentDashboard'
};
</script>

<style scoped>
h2 {
  color: #333;
}

v-card {
  transition: all 0.3s ease;
}
</style>