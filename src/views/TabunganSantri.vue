<template>
  <v-container fluid class="py-8">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Tabungan Santri</h2>
        <p class="text-subtitle-1 grey--text mb-6">Update dan monitoring pelanggaran santri</p>
        
        <v-card>
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="grey lighten-1">mdi-alert-circle</v-icon>
            <h3 class="text-h6 mt-4 mb-2">Fitur Pelanggaran Santri</h3>
            <p class="text-body-2 grey--text">
              Halaman ini akan berisi data pelanggaran santri
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TabunganSantri'
};
</script>