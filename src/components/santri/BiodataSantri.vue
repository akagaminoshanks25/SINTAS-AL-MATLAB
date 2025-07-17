<template>
  <v-row class="px-4 py-6" align="start" justify="space-between">
    <!-- Kolom Foto dan Status -->
    <v-col cols="12" md="3">
      <v-card class="mb-4">
        <v-img
          src="https://via.placeholder.com/300x400.png?text=Foto+Santri"
          aspect-ratio="3/4"
          cover
        />
      </v-card>

      <v-card class="mb-2" color=#F8E8EE dark>
        <v-card-text class="text-center">
          <div class="text-caption">STATUS SANTRI</div>
          <div class="text-h6 font-weight-bold">
            {{ data.STATUS || '-' }}
          </div>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text class="text-center">
          <div class="text-caption">TAHUN KELUAR</div>
          <div class="text-subtitle-1 font-weight-bold">
            {{ data['TAHUN_KELUAR'] || '-' }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Kolom Data -->
    <v-col cols="12" md="9">
      <v-table dense class="elevation-1">
        <tbody>
          <tr v-for="(label, key) in biodataFields" :key="key" style="height: 48px;">
            <td class="font-weight-bold" style="width: 320px;">{{ label }}</td>
            <td>{{ data[key] || '-' }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'BiodataSantri',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    biodataFields() {
      return {
        'NAMA_SANTRI': 'Nama Lengkap',
        'NOMOR_INDUK': 'Nomor Induk',
        'KELAS': 'Kelas',
        'TAHUN_MASUK': 'Tahun Masuk',
        'JENJANG_MASUK': 'Jenjang Masuk',
        'TTL_SANTRI': 'Tempat Tanggal Lahir',
        'GENDER': 'Jenis Kelamin',
        'NAMA_AYAH': 'Nama Ayah',
        'NAMA_IBU': 'Nama Ibu',
        'HP_AYAH': 'Nomor HP Ayah',
        'HP_IBU': 'Nomor HP Ibu',
        'PEKERJAAN_AYAH': 'Pekerjaan Ayah',
        'PEKERJAAN_IBU': 'Pekerjaan Ibu',
        'ALAMAT_SANTRI': 'Alamat',
        'KABUPATEN': 'Kabupaten',
        'PROVINSI': 'Provinsi',
        'KODE_POS': 'Kode Pos'
      };
    }
  }
};
</script>

<style scoped>
.v-table {
  width: 100%;
  font-size: 14px;
}
td {
  padding: 8px 16px !important;
  vertical-align: middle;
}
</style>
