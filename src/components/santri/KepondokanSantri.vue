<template>
  <v-card flat class="pa-6">
    <h3 class="text-h5 font-weight-bold mb-6 text-uppercase">INFORMASI KEPONDOKAN</h3>
    <v-divider class="mb-6"></v-divider>
    
    <v-row>
      <!-- Dormitory Information -->
      <v-col cols="12" md="6">
        <v-card outlined class="mb-4">
          <v-card-title class="text-h6 font-weight-bold primary--text">
            <v-icon left color="primary">mdi-home-group</v-icon>
            Informasi Asrama
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <tbody>
                <tr>
                  <td class="font-weight-medium">Nama Santri</td>
                  <td>{{ dataSantri['NAMA_SANTRI'] || 'Tidak tersedia' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Nomor Induk</td>
                  <td>{{ dataSantri['NOMOR_INDUK'] || 'Tidak tersedia' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Kelas</td>
                  <td>{{ dataSantri['KELAS'] || 'Tidak tersedia' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Jenis Kelamin</td>
                  <td>
                    <v-chip 
                      :color="dataSantri['GENDER'] === 'Laki-laki' ? 'blue' : 'pink'" 
                      text-color="white" 
                      small
                    >
                      {{ dataSantri['GENDER'] || 'Tidak tersedia' }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card outlined class="mb-4">
          <v-card-title class="text-h6 font-weight-bold secondary--text">
            <v-icon left color="secondary">mdi-calendar-clock</v-icon>
            Status Kepondokan
          </v-card-title>
          <v-card-text>
            <div class="text-center py-4">
              <v-chip 
                :color="getStatusColor(dataSantri['STATUS_SANTRI'])" 
                text-color="white" 
                large
                class="mb-3"
              >
                {{ dataSantri['STATUS_SANTRI'] || 'Tidak tersedia' }}
              </v-chip>
              <p class="text-body-2 grey--text">
                Status kepondokan santri saat ini
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Contact Information -->
      <v-col cols="12">
        <v-card outlined class="mb-4">
          <v-card-title class="text-h6 font-weight-bold success--text">
            <v-icon left color="success">mdi-phone-contact</v-icon>
            Kontak Darurat
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-simple-table>
                  <tbody>
                    <tr>
                      <td class="font-weight-medium">Nama Ayah</td>
                      <td>{{ dataSantri['NAMA_AYAH'] || 'Tidak tersedia' }}</td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium">HP Ayah</td>
                      <td>
                        <a :href="'tel:' + dataSantri['HP_AYAH']" v-if="dataSantri['HP_AYAH']">
                          {{ dataSantri['HP_AYAH'] }}
                        </a>
                        <span v-else>Tidak tersedia</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium">Pekerjaan Ayah</td>
                      <td>{{ dataSantri['PEKERJAAN AYAH'] || 'Tidak tersedia' }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <v-col cols="12" md="6">
                <v-simple-table>
                  <tbody>
                    <tr>
                      <td class="font-weight-medium">Nama Ibu</td>
                      <td>{{ dataSantri['NAMA_IBU'] || 'Tidak tersedia' }}</td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium">HP Ibu</td>
                      <td>
                        <a :href="'tel:' + dataSantri['HP_IBU']" v-if="dataSantri['HP_IBU']">
                          {{ dataSantri['HP_IBU'] }}
                        </a>
                        <span v-else>Tidak tersedia</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium">Pekerjaan Ibu</td>
                      <td>{{ dataSantri['PEKERJAAN_IBU'] || 'Tidak tersedia' }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Placeholder for future dormitory data -->
      <v-col cols="12">
        <v-card outlined>
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon left>mdi-bed</v-icon>
            Detail Kepondokan
          </v-card-title>
          <v-card-text>
            <v-alert 
              type="info" 
              outlined 
              class="mb-0"
            >
              <div class="d-flex align-center">
                <v-icon left>mdi-information</v-icon>
                <span>Data detail kepondokan (kamar, blok, dll) akan ditampilkan di sini setelah integrasi dengan sistem kepondokan.</span>
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

a {
  color: #1976d2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>