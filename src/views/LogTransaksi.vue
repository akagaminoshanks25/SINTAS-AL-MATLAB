<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h2 class="text-h5 font-weight-bold mb-2">Log Transaksi Keuangan</h2>
            <p class="text-subtitle-1 grey--text">
              Melihat riwayat audit semua transaksi keuangan.
            </p>
            <v-chip color="primary" text-color="white" small class="mr-2">
              Total Log: {{ filteredLogs.length }}
            </v-chip>
          </div>
          <v-btn color="primary" @click="loadLogs" :loading="loading" icon>
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filter Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filter.userIdSantri"
          label="Cari User ID Santri"
          prepend-inner-icon="mdi-account-search"
          variant="outlined"
          density="compact"
          clearable
          @update:model-value="applyFilters"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filter.nomorTransaksi"
          label="Cari Nomor Transaksi"
          prepend-inner-icon="mdi-receipt"
          variant="outlined"
          density="compact"
          clearable
          @update:model-value="applyFilters"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="filter.jenisAksi"
          :items="jenisAksiOptions"
          label="Filter Jenis Aksi"
          prepend-inner-icon="mdi-filter"
          variant="outlined"
          density="compact"
          clearable
          @update:model-value="applyFilters"
        />
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading && allLogsData.length === 0">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4 text-subtitle-1">Memuat log transaksi...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent border="left" class="mb-4">
          <v-row align="center">
            <v-col class="grow">
              <div class="title">Gagal memuat log</div>
              <div>{{ error }}</div>
            </v-col>
            <v-col class="shrink">
              <v-btn color="error" @click="loadLogs"> Coba Lagi </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2">
          <v-data-table
            :headers="headers"
            :items="filteredLogs"
            :loading="loading"
            class="elevation-0 clickable-table"
            :items-per-page="15"
            :footer-props="{
              'items-per-page-options': [10, 15, 25, 50, -1],
              'items-per-page-text': 'Baris per halaman:'
            }"
            @click:row="showLogDetail"
          >
            <template #item.timestamp="{ item }">
              {{ formatTimestamp(item.timestamp) }}
            </template>
            <template #item.detail_perubahan="{ item }">
              <v-chip
                v-if="item.detail_perubahan && Object.keys(item.detail_perubahan).length > 0"
                color="info"
                small
              >
                Lihat Detail
              </v-chip>
              <span v-else>-</span>
            </template>
            <template #no-data>
              <div class="text-center py-8">
                <v-icon size="64" color="grey lighten-1">mdi-file-remove-outline</v-icon>
                <p class="text-subtitle-1 mt-4">Tidak ada log transaksi</p>
                <p class="text-body-2 grey--text">
                  Tidak ada data log yang sesuai dengan filter yang dipilih.
                </p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Log Detail Dialog -->
    <v-dialog v-model="dialog.show" max-width="600">
      <v-card>
        <v-card-title class="text-h6 d-flex justify-space-between align-center">
          Detail Log Transaksi
          <v-btn icon @click="dialog.show = false" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Waktu:</v-list-item-title>
              <v-list-item-subtitle>{{ formatTimestamp(dialog.log.timestamp) }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Dicatat Oleh:</v-list-item-title>
              <v-list-item-subtitle>{{ dialog.log.dicatat_oleh_uid }} ({{ dialog.log.dicatat_oleh_role }})</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Jenis Aksi:</v-list-item-title>
              <v-list-item-subtitle>{{ dialog.log.jenis_aksi }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="dialog.log.user_id_santri">
              <v-list-item-title class="font-weight-bold">User ID Santri:</v-list-item-title>
              <v-list-item-subtitle>{{ dialog.log.user_id_santri }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="dialog.log.id_transaksi_terkait">
              <v-list-item-title class="font-weight-bold">No. Transaksi Terkait:</v-list-item-title>
              <v-list-item-subtitle>{{ dialog.log.id_transaksi_terkait }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="dialog.log.catatan">
              <v-list-item-title class="font-weight-bold">Catatan:</v-list-item-title>
              <v-list-item-subtitle>{{ dialog.log.catatan }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="dialog.log.detail_perubahan && Object.keys(dialog.log.detail_perubahan).length > 0">
              <v-list-item-title class="font-weight-bold">Detail Perubahan:</v-list-item-title>
              <v-list-item-subtitle>
                <pre>{{ JSON.stringify(dialog.log.detail_perubahan, null, 2) }}</pre>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialog.show = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { db, appId } from '@/plugins/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

const loading = ref(false);
const error = ref(null);
const allLogsData = ref([]);

const filter = ref({
  userIdSantri: '',
  nomorTransaksi: '',
  jenisAksi: null,
});

const jenisAksiOptions = [
  'Pembayaran SPP',
  'Setoran Tabungan',
  'Penarikan Tabungan',
  'Update Tarif SPP',
  // Tambahkan jenis aksi lain jika ada
];

const headers = [
  { text: 'Waktu', value: 'timestamp', sortable: true, width: '180px' },
  { text: 'Jenis Aksi', value: 'jenis_aksi', sortable: true, width: '150px' },
  { text: 'User ID Santri', value: 'user_id_santri', sortable: true, width: '150px' },
  { text: 'No. Transaksi Terkait', value: 'id_transaksi_terkait', sortable: true, width: '200px' },
  { text: 'Dicatat Oleh', value: 'dicatat_oleh_uid', sortable: true, width: '150px' },
  { text: 'Peran', value: 'dicatat_oleh_role', sortable: true, width: '100px' },
  { text: 'Detail Perubahan', value: 'detail_perubahan', sortable: false, width: '120px' },
  { text: 'Catatan', value: 'catatan', sortable: false, width: 'auto' },
];

const filteredLogs = computed(() => {
  let logs = allLogsData.value;

  if (filter.value.userIdSantri) {
    logs = logs.filter(log =>
      log.user_id_santri && log.user_id_santri.toLowerCase().includes(filter.value.userIdSantri.toLowerCase())
    );
  }

  if (filter.value.nomorTransaksi) {
    logs = logs.filter(log =>
      log.id_transaksi_terkait && log.id_transaksi_terkait.toLowerCase().includes(filter.value.nomorTransaksi.toLowerCase())
    );
  }

  if (filter.value.jenisAksi) {
    logs = logs.filter(log => log.jenis_aksi === filter.value.jenisAksi);
  }

  return logs;
});

const dialog = ref({
  show: false,
  log: {},
});

const showLogDetail = (event, { item }) => {
  dialog.value.log = item;
  dialog.value.show = true;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  // Firestore Timestamp object has toDate() method
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

const loadLogs = async () => {
  loading.value = true;
  error.value = null;
  allLogsData.value = [];

  console.log('Fungsi loadLogs dipanggil. Memulai fetch data log keuangan dari Firestore.');
  try {
    const logsCollectionRef = collection(db, `artifacts/${appId}/public/data/finance_logs`);
    // Mengambil semua log, diurutkan berdasarkan timestamp terbaru
    const q = query(logsCollectionRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    const fetchedData = [];
    querySnapshot.forEach((doc) => {
      fetchedData.push({
        id: doc.id,
        ...doc.data()
      });
    });

    allLogsData.value = fetchedData;
    console.log('Data allLogsData.value setelah fetch dari Firestore:', allLogsData.value);
  } catch (err) {
    console.error('Error loading finance logs from Firestore:', err);
    error.value = err.message || 'Terjadi kesalahan saat memuat log keuangan dari Firestore';
  } finally {
    loading.value = false;
    console.log('Fungsi loadLogs selesai.');
  }
};

const applyFilters = () => {
  // Filter akan otomatis diterapkan karena `filteredLogs` adalah computed property
  console.log('Filters applied:', filter.value);
};

onMounted(() => {
  console.log('LogTransaksi mounted - loading data');
  loadLogs();
});
</script>

<style scoped>
.clickable-table >>> tbody tr {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable-table >>> tbody tr:hover {
  background-color: #C6E7FF !important;
}

.v-data-table {
  font-size: 0.875rem;
}

.v-chip {
  font-size: 0.75rem;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.85rem;
}
</style>
