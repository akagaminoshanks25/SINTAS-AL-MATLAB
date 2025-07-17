<template>
  <v-container fluid class="py-8">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Dashboard Keuangan</h2>
        <p class="text-subtitle-1 grey--text">Pengelolaan keuangan pondok pesantren</p>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4" color="success" dark>
          <v-icon size="36" class="mb-2">mdi-cash-multiple</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium">Total Pembayaran SPP</h3>
          <p class="text-h6 font-weight-bold">Rp 125.000.000</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4" color="info" dark>
          <v-icon size="36" class="mb-2">mdi-piggy-bank</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium">Total Tabungan</h3>
          <p class="text-h6 font-weight-bold">Rp 45.000.000</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4" color="warning" dark>
          <v-icon size="36" class="mb-2">mdi-alert-circle</v-icon>
          <h3 class="text-subtitle-1 font-weight-medium">Tunggakan SPP</h3>
          <p class="text-h6 font-weight-bold">Rp 8.500.000</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mt-6">
      <v-col cols="12">
        <h3 class="text-h6 font-weight-bold mb-4">Aksi Cepat</h3>
      </v-col>
      
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="1" class="pa-4 text-center" hover @click="$router.push('/keuangan/pembayaran-spp')">
          <v-icon size="48" color="primary" class="mb-2">mdi-cash-register</v-icon>
          <h4 class="text-subtitle-1 font-weight-medium">Pembayaran SPP</h4>
          <p class="text-body-2 grey--text">Kelola pembayaran SPP santri</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card elevation="1" class="pa-4 text-center" hover @click="$router.push('/keuangan/tabungan-santri')">
          <v-icon size="48" color="secondary" class="mb-2">mdi-piggy-bank</v-icon>
          <h4 class="text-subtitle-1 font-weight-medium">Tabungan Santri</h4>
          <p class="text-body-2 grey--text">Kelola tabungan santri</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card elevation="1" class="pa-4 text-center" hover @click="$router.push('/keuangan/laporan-keuangan')">
          <v-icon size="48" color="success" class="mb-2">mdi-chart-line</v-icon>
          <h4 class="text-subtitle-1 font-weight-medium">Laporan Keuangan</h4>
          <p class="text-body-2 grey--text">Lihat laporan keuangan</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'KeuanganDashboard'
};
</script>

<style scoped>
h2 {
  color: #333;
}

.v-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>