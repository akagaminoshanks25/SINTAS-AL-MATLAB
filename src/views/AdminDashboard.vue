<template>
  <v-container fluid class="py-8">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Dashboard Admin</h2>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4">
          <v-icon size="36" class="mb-2" color="primary">mdi-account-multiple</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium">Total Santri</h3>
          <p class="text-h6 font-weight-bold">312</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4">
          <v-icon size="36" class="mb-2" color="secondary">mdi-school</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium">Data Akademik</h3>
          <p class="text-h6 font-weight-bold">Lengkap</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4">
          <v-icon size="36" class="mb-2" color="success">mdi-file-document</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium">Administrasi</h3>
          <p class="text-h6 font-weight-bold">Terkini</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AdminDashboard'
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
