<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <div>
          <h2 class="text-h5 font-weight-bold mb-2">REKAP PEMBAYARAN SANTRI</h2>
          <p class="text-subtitle-1 mb-1">
            TAHUN AJARAN : {{ selectedTahunAjaran?.nama_tahun_ajaran || 'Memuat...' }}
          </p>
          <p class="text-subtitle-2 grey--text">
            {{ getKelasGenderLabel() }}
          </p>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end align-start">
        <div class="d-flex flex-column align-end">
          <!-- Dropdown Tahun Ajaran -->
          <v-select
            v-model="selectedTahunAjaranId"
            :items="tahunAjaranOptions"
            item-title="nama_tahun_ajaran"
            item-value="id"
            label="TAHUN AJARAN"
            variant="outlined"
            density="compact"
            class="mb-3"
            style="min-width: 200px;"
            @update:model-value="onTahunAjaranChange"
          />
          
          <!-- Tabs untuk Kelas -->
          <v-tabs
            v-model="selectedTab"
            color="primary"
            density="compact"
            class="kelas-tabs"
            @update:model-value="onTabChange"
          >
            <v-tab
              v-for="tab in kelasTabs"
              :key="tab.value"
              :value="tab.value"
              class="text-caption"
            >
              {{ tab.label }}
            </v-tab>
          </v-tabs>
        </div>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4 text-subtitle-1">Memuat data pembayaran santri...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent border="left" class="mb-4">
          <v-row align="center">
            <v-col class="grow">
              <div class="title">Gagal memuat data</div>
              <div>{{ error }}</div>
            </v-col>
            <v-col class="shrink">
              <v-btn color="error" @click="loadData"> Coba Lagi </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2" class="table-container">
          <v-data-table
            :headers="dynamicHeaders"
            :items="filteredSantri"
            :loading="loading"
            class="elevation-0 payment-table"
            :items-per-page="15"
            fixed-header
            :footer-props="{
              'items-per-page-options': [15, 25, 50, -1],
              'items-per-page-text': 'Baris per halaman:'
            }"
            @click:row="handleRowClick"
          >
            <!-- Custom header styling -->
            <template #headers="{ columns }">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.value"
                  class="text-center payment-header"
                  :style="getHeaderStyle(column)"
                >
                  {{ column.text }}
                </th>
              </tr>
            </template>

            <!-- User ID -->
            <template #item.user_id="{ item }">
              <div class="text-center">{{ item.user_id }}</div>
            </template>

            <!-- Nama Santri -->
            <template #item.nama_santri="{ item }">
              <div class="text-left">{{ item.nama_santri }}</div>
            </template>

            <!-- Daftar Ulang -->
            <template #item.daftar_ulang="{ item }">
              <div class="text-center payment-cell">
                {{ formatCurrency(item.biaya_daftar_ulang || 0) }}
              </div>
            </template>

            <!-- Monthly Payment Columns -->
            <template
              v-for="month in monthColumns"
              :key="month.value"
              #[`item.${month.value}`]="{ item }"
            >
              <div class="text-center payment-cell">
                {{ getPaymentStatus(item, month.value) }}
              </div>
            </template>

            <!-- Beban SPP -->
            <template #item.beban_spp="{ item }">
              <div class="text-center payment-cell">
                {{ formatCurrency(item.jumlah_spp_beban_per_bulan || 0) }}
              </div>
            </template>

            <template #no-data>
              <div class="text-center py-8">
                <v-icon size="64" color="grey lighten-1">mdi-account-off</v-icon>
                <p class="text-subtitle-1 mt-4">Tidak ada data santri</p>
                <p class="text-body-2 grey--text">
                  Belum ada data santri untuk kelas dan tahun ajaran yang dipilih.
                </p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Import Firebase modules
import { db, appId } from '@/plugins/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const route = useRoute();

// Reactive data
const loading = ref(false);
const error = ref(null);
const allSantriData = ref([]); // Akan menyimpan semua data santri dari Firestore
const tahunAjaranData = ref([]);
const selectedTahunAjaranId = ref(null);
const selectedTab = ref('1-pa'); // Default: Kelas 1 Putra

// Computed properties
const selectedTahunAjaran = computed(() => {
  return tahunAjaranData.value.find(ta => ta.id === selectedTahunAjaranId.value);
});

const tahunAjaranOptions = computed(() => {
  return tahunAjaranData.value.map(ta => ({
    id: ta.id,
    nama_tahun_ajaran: ta.nama_tahun_ajaran
  }));
});

const kelasTabs = computed(() => {
  const tabs = [];
  // Kelas 1-6 Putra
  for (let i = 1; i <= 6; i++) {
    tabs.push({
      label: `Kelas ${i} Pa`,
      value: `${i}-pa`,
      kelas: i.toString(),
      gender: 'Laki-laki'
    });
  }
  // Kelas 1-6 Putri
  for (let i = 1; i <= 6; i++) {
    tabs.push({
      label: `Kelas ${i} Pi`,
      value: `${i}-pi`,
      kelas: i.toString(),
      gender: 'Perempuan'
    });
  }
  return tabs;
});

const currentTabInfo = computed(() => {
  return kelasTabs.value.find(tab => tab.value === selectedTab.value);
});

const monthColumns = computed(() => {
  if (!selectedTahunAjaran.value) return [];
  
  const tahunAjaran = selectedTahunAjaran.value.nama_tahun_ajaran; // e.g., "2025/2026"
  const [startYear, endYear] = tahunAjaran.split('/').map(y => parseInt(y));
  
  const months = [
    { name: 'Jul', year: startYear },
    { name: 'Aug', year: startYear },
    { name: 'Sep', year: startYear },
    { name: 'Oct', year: startYear },
    { name: 'Nov', year: startYear },
    { name: 'Des', year: startYear },
    { name: 'Jan', year: endYear },
    { name: 'Feb', year: endYear },
    { name: 'Mar', year: endYear },
    { name: 'Apr', year: endYear },
    { name: 'May', year: endYear },
    { name: 'Jun', year: endYear }
  ];
  
  return months.map(month => ({
    text: `${month.name} ${month.year}`,
    value: `${month.name.toLowerCase()}_${month.year}`,
    sortable: false,
    width: '90px'
  }));
});

const dynamicHeaders = computed(() => {
  const baseHeaders = [
    { text: 'Nomor Induk', value: 'user_id', sortable: true, width: '120px' },
    { text: 'Nama Santri', value: 'nama_santri', sortable: true, width: '280px' },
    { text: 'Daftar Ulang', value: 'daftar_ulang', sortable: false, width: '100px' }
  ];
  
  const monthHeaders = monthColumns.value;
  
  const endHeaders = [
    { text: 'Beban SPP', value: 'beban_spp', sortable: false, width: '100px' }
  ];
  
  return [...baseHeaders, ...monthHeaders, ...endHeaders];
});

const filteredSantri = computed(() => {
  if (!currentTabInfo.value) return [];
  
  return allSantriData.value.filter(santri => {
    const matchKelas = santri.kelas_saat_ini?.toString() === currentTabInfo.value.kelas;
    const matchGender = santri.gender === currentTabInfo.value.gender;
    return matchKelas && matchGender;
  });
});

// Methods
const getKelasGenderLabel = () => {
  if (!currentTabInfo.value) return '';
  const genderLabel = currentTabInfo.value.gender === 'Laki-laki' ? 'Putra' : 'Putri';
  return `Kelas ${currentTabInfo.value.kelas} ${genderLabel}`;
};

const getHeaderStyle = (column) => {
  if (column.value === 'nama_santri') {
    return 'text-align: left; font-weight: 600; font-size: 0.85rem; background-color: #f5f5f5;';
  }
  return 'font-weight: 600; font-size: 0.85rem; background-color: #f5f5f5;';
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === 0) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const getPaymentStatus = (santri, monthKey) => {
  // Placeholder logic - in real implementation, this would check payment records
  // For now, return placeholder values
  const paymentData = santri.pembayaran_spp || {}; // Assuming payment data is nested
  const monthPayment = paymentData[monthKey];
  
  if (monthPayment) {
    return formatCurrency(monthPayment.jumlah_bayar);
  }
  
  // Placeholder: show random status for demo
  const statuses = ['Lunas', 'Belum', formatCurrency(santri.jumlah_spp_beban_per_bulan || 0)];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const loadTahunAjaran = async () => {
  try {
    const tahunAjaranRef = collection(db, `artifacts/${appId}/public/data/tahun_ajaran`);
    const querySnapshot = await getDocs(tahunAjaranRef);
    
    const fetchedData = [];
    querySnapshot.forEach((doc) => {
      fetchedData.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    tahunAjaranData.value = fetchedData;
    
    // Set default tahun ajaran (most recent or active)
    if (fetchedData.length > 0) {
      const activeTahunAjaran = fetchedData.find(ta => ta.aktif) || fetchedData[0]; // Cari yang aktif
      selectedTahunAjaranId.value = activeTahunAjaran.id;
    }
    
    console.log('Tahun ajaran data loaded:', fetchedData);
  } catch (err) {
    console.error('Error loading tahun ajaran:', err);
    error.value = 'Gagal memuat data tahun ajaran';
  }
};

const loadSantriData = async () => {
  try {
    const santriCollectionRef = collection(db, `artifacts/${appId}/public/data/santri`);
    const querySnapshot = await getDocs(santriCollectionRef);
    
    const fetchedData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fetchedData.push({
        id: doc.id,
        ...data
      });
    });
    
    allSantriData.value = fetchedData;
    console.log('Santri data loaded:', fetchedData);
  } catch (err) {
    console.error('Error loading santri data:', err);
    error.value = 'Gagal memuat data santri';
  }
};

const loadData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await Promise.all([
      loadTahunAjaran(),
      loadSantriData()
    ]);
  } catch (err) {
    console.error('Error loading data:', err);
    error.value = 'Gagal memuat data';
  } finally {
    loading.value = false;
  }
};

const onTahunAjaranChange = (newTahunAjaranId) => {
  console.log('Tahun ajaran changed to:', newTahunAjaranId);
  // Data will automatically update through computed properties
};

const onTabChange = (newTab) => {
  console.log('Tab changed to:', newTab);
  // Data will automatically update through computed properties
};

// Watchers
watch(selectedTahunAjaranId, (newValue) => {
  if (newValue) {
    console.log('Selected tahun ajaran changed:', newValue);
  }
});

watch(selectedTab, (newValue) => {
  if (newValue) {
    console.log('Selected tab changed:', newValue);
  }
});

// Lifecycle
onMounted(() => {
  console.log('PembayaranSpp mounted - loading data');
  loadData();
});
</script>

<style scoped>
.table-container {
  max-height: calc(100vh - 250px);
  overflow: auto;
}

.payment-table {
  font-size: 0.8rem;
}

.payment-header {
  background-color: #f5f5f5 !important;
  border: 1px solid #ddd !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  padding: 8px 4px !important;
  white-space: nowrap;
}

.payment-cell {
  font-size: 0.75rem;
  padding: 4px;
  border: 1px solid #eee;
  white-space: nowrap;
}

.kelas-tabs {
  max-width: 800px;
}

.kelas-tabs .v-tab {
  min-width: 80px !important;
  font-size: 0.75rem !important;
  padding: 0 8px !important;
}

/* Custom scrollbar for table */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Table styling to match the image */
.v-data-table >>> .v-data-table__wrapper table {
  border-collapse: collapse;
}

.v-data-table >>> .v-data-table__wrapper table td {
  border: 1px solid #ddd !important;
  padding: 8px 4px !important;
}

.v-data-table >>> .v-data-table__wrapper table th {
  border: 1px solid #ddd !important;
  background-color: #f5f5f5 !important;
}

/* Fixed header styling */
.v-data-table >>> .v-data-table__wrapper {
  max-height: calc(100vh - 300px);
}
</style>
