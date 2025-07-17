<template>
  <v-card flat class="pa-6">
    <h3 class="text-h5 font-weight-bold mb-6 text-uppercase">INFORMASI ADMINISTRASI</h3>
    <v-divider class="mb-6"></v-divider>
    
    <v-row>
      <!-- Administrative Status -->
      <v-col cols="12" md="6">
        <v-card outlined class="mb-4">
          <v-card-title class="text-h6 font-weight-bold primary--text">
            <v-icon left color="primary">mdi-file-document-check</v-icon>
            Status Administrasi
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <tbody>
                <tr>
                  <td class="font-weight-medium">Nomor Induk</td>
                  <td>{{ dataSantri['NOMOR_INDUK'] || 'Tidak tersedia' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Status Santri</td>
                  <td>
                    <v-chip 
                      :color="getStatusColor(dataSantri['STATUS_SANTRI'])" 
                      text-color="white" 
                      small
                    >
                      {{ dataSantri['STATUS_SANTRI'] || 'Tidak tersedia' }}
                    </v-chip>
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Tahun Masuk</td>
                  <td>{{ dataSantri['TAHUN_MASUK'] || dataSantri['TAHUN_MASUK'] || 'Tidak tersedia' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Tahun Keluar</td>
                  <td>{{ dataSantri['TAHUN_KELUAR'] || '-' }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card outlined class="mb-4">
          <v-card-title class="text-h6 font-weight-bold secondary--text">
            <v-icon left color="secondary">mdi-map-marker</v-icon>
            Informasi Domisili
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <tbody>
                <tr>
                  <td class="font-weight-medium">Alamat</td>
                  <td>{{ dataSantri['ALAMAT_SANTRI'] || dataSantri['ALAMAT'] || 'Tidak tersedia' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Kabupaten</td>
                  <td>{{ dataSantri['KABUPATEN'] || 'Tidak tersedia' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Provinsi</td>
                  <td>{{ dataSantri['PROVINSI'] || 'Tidak tersedia' }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Document Status -->
      <v-col cols="12">
        <v-card outlined class="mb-4">
          <v-card-title class="text-h6 font-weight-bold success--text">
            <v-icon left color="success">mdi-file-document-multiple</v-icon>
            Status Dokumen
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <div class="text-center pa-4">
                  <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
                  <h4 class="text-subtitle-1 font-weight-bold">Akta Kelahiran</h4>
                  <p class="text-body-2 success--text">Lengkap</p>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-center pa-4">
                  <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
                  <h4 class="text-subtitle-1 font-weight-bold">Kartu Keluarga</h4>
                  <p class="text-body-2 success--text">Lengkap</p>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-center pa-4">
                  <v-icon size="48" color="warning" class="mb-2">mdi-clock-alert</v-icon>
                  <h4 class="text-subtitle-1 font-weight-bold">Ijazah</h4>
                  <p class="text-body-2 warning--text">Pending</p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Financial Information -->
      <v-col cols="12">
        <v-card outlined>
          <v-card-title class="text-h6 font-weight-bold info--text">
            <v-icon left color="info">mdi-cash-multiple</v-icon>
            Informasi Keuangan
          </v-card-title>
          <v-card-text>
            <v-alert 
              type="info" 
              outlined 
              class="mb-0"
            >
              <div class="d-flex align-center">
                <v-icon left>mdi-information</v-icon>
                <span>Data administrasi keuangan akan ditampilkan di sini setelah integrasi dengan sistem keuangan.</span>
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