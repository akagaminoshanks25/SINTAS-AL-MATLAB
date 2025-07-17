<template>
  <v-card flat class="pa-6">
    <h3 class="text-h5 font-weight-bold mb-6 text-uppercase">INFORMASI AKADEMIK</h3>
    <v-divider class="mb-6"></v-divider>
    
    <v-row>
      <!-- Academic Information Cards -->
      <v-col cols="12" md="6">
        <v-card outlined class="mb-4">
          <v-card-title class="text-h6 font-weight-bold primary--text">
            <v-icon left color="primary">mdi-school</v-icon>
            Informasi Kelas
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <tbody>
                <tr>
                  <td class="font-weight-medium">Kelas Saat Ini</td>
                  <td>{{ dataSantri['KELAS'] || 'Tidak tersedia' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Tahun Masuk</td>
                  <td>{{ dataSantri['TAHUN IN'] || dataSantri['TAHUN MASUK'] || 'Tidak tersedia' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Jenjang Masuk</td>
                  <td>{{ dataSantri['JENJANG MASUK'] || 'Tidak tersedia' }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card outlined class="mb-4">
          <v-card-title class="text-h6 font-weight-bold secondary--text">
            <v-icon left color="secondary">mdi-chart-line</v-icon>
            Status Akademik
          </v-card-title>
          <v-card-text>
            <div class="text-center py-4">
              <v-chip 
                :color="getStatusColor(dataSantri['STATUS SANTRI'])" 
                text-color="white" 
                large
                class="mb-3"
              >
                {{ dataSantri['STATUS SANTRI'] || 'Tidak tersedia' }}
              </v-chip>
              <p class="text-body-2 grey--text">
                Status akademik santri saat ini
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Placeholder for future academic data -->
      <v-col cols="12">
        <v-card outlined>
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon left>mdi-book-open-page-variant</v-icon>
            Riwayat Akademik
          </v-card-title>
          <v-card-text>
            <v-alert 
              type="info" 
              outlined 
              class="mb-0"
            >
              <div class="d-flex align-center">
                <v-icon left>mdi-information</v-icon>
                <span>Data riwayat akademik akan ditampilkan di sini setelah integrasi dengan sistem akademik.</span>
              </div>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  dataSantri: {
    type: Object,
    default: () => ({})
  }
});

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'aktif':
      return 'success';
    case 'lulus':
      return 'primary';
    case 'keluar':
      return 'warning';
    case 'pindah':
      return 'info';
    default:
      return 'grey';
  }
};
</script>

<style scoped>
.v-simple-table tbody tr:nth-child(odd) {
  background-color: #fafafa;
}

.v-simple-table td {
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
  padding: 12px 16px;
}
</style>