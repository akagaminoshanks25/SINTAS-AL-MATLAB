<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h2 class="text-h5 font-weight-bold mb-2">Laporan Keuangan</h2>
            <p class="text-subtitle-1 grey--text">Gambaran umum keuangan pondok dan analisis tren</p>
          </div>
          <v-btn
            color="success"
            @click="generateReport"
            :loading="generatingReport"
          >
            <v-icon left>mdi-file-chart</v-icon>
            Generate Laporan
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filter Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedTahunAjaran"
          :items="tahunAjaranOptions"
          label="Tahun Ajaran"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedPeriod"
          :items="periodOptions"
          label="Periode Laporan"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="customStartDate"
          label="Dari Tanggal"
          variant="outlined"
          density="compact"
          type="date"
          :disabled="selectedPeriod !== 'custom'"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="customEndDate"
          label="Sampai Tanggal"
          variant="outlined"
          density="compact"
          type="date"
          :disabled="selectedPeriod !== 'custom'"
        />
      </v-col>
    </v-row>

    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card color="success" dark elevation="4">
          <v-card-text class="text-center">
            <v-icon size="48" class="mb-2">mdi-cash-plus</v-icon>
            <div class="text-h5 font-weight-bold">{{ formatCurrency(totalPenerimaan) }}</div>
            <div class="text-subtitle-2">Total Penerimaan SPP</div>
            <div class="text-caption">{{ selectedPeriodLabel }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="info" dark elevation="4">
          <v-card-text class="text-center">
            <v-icon size="48" class="mb-2">mdi-piggy-bank</v-icon>
            <div class="text-h5 font-weight-bold">{{ formatCurrency(totalSaldoTabungan) }}</div>
            <div class="text-subtitle-2">Total Saldo Tabungan</div>
            <div class="text-caption">Seluruh Santri</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="warning" dark elevation="4">
          <v-card-text class="text-center">
            <v-icon size="48" class="mb-2">mdi-alert-circle</v-icon>
            <div class="text-h5 font-weight-bold">{{ formatCurrency(totalTunggakan) }}</div>
            <div class="text-subtitle-2">Total Tunggakan SPP</div>
            <div class="text-caption">{{ tunggakanCount }} Santri</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="primary" dark elevation="4">
          <v-card-text class="text-center">
            <v-icon size="48" class="mb-2">mdi-account-multiple</v-icon>
            <div class="text-h5 font-weight-bold">{{ totalSantriAktif }}</div>
            <div class="text-subtitle-2">Santri Aktif</div>
            <div class="text-caption">Tahun Ajaran Ini</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon left color="primary">mdi-chart-line</v-icon>
            Tren Pembayaran SPP Bulanan
          </v-card-title>
          <v-card-text>
            <div class="chart-container">
              <!-- Placeholder for chart - you can integrate Chart.js or similar -->
              <div class="chart-placeholder">
                <v-icon size="64" color="grey lighten-2">mdi-chart-line</v-icon>
                <p class="text-subtitle-1 grey--text mt-4">Grafik Tren Pembayaran SPP</p>
                <p class="text-body-2 grey--text">
                  Integrasi dengan library chart akan menampilkan grafik di sini
                </p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon left color="secondary">mdi-chart-pie</v-icon>
            Distribusi Status Pembayaran
          </v-card-title>
          <v-card-text>
            <div class="chart-container">
              <!-- Placeholder for pie chart -->
              <div class="chart-placeholder">
                <v-icon size="64" color="grey lighten-2">mdi-chart-pie</v-icon>
                <p class="text-subtitle-1 grey--text mt-4">Pie Chart Status</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detailed Reports Section -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon left color="success">mdi-cash-multiple</v-icon>
            Penerimaan SPP per Kelas
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="kelasHeaders"
              :items="penerimaanPerKelas"
              :loading="loading"
              class="elevation-0"
              :items-per-page="12"
              hide-default-footer
            >
              <template #item.kelas="{ item }">
                <div class="font-weight-medium">{{ item.kelas }}</div>
              </template>

              <template #item.total_santri="{ item }">
                <div class="text-center">{{ item.total_santri }}</div>
              </template>

              <template #item.sudah_bayar="{ item }">
                <div class="text-center">
                  <v-chip color="success" text-color="white" small>
                    {{ item.sudah_bayar }}
                  </v-chip>
                </div>
              </template>

              <template #item.belum_bayar="{ item }">
                <div class="text-center">
                  <v-chip color="warning" text-color="white" small>
                    {{ item.belum_bayar }}
                  </v-chip>
                </div>
              </template>

              <template #item.total_penerimaan="{ item }">
                <div class="text-right font-weight-bold success--text">
                  {{ formatCurrency(item.total_penerimaan) }}
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon left color="warning">mdi-alert-circle-outline</v-icon>
            Ringkasan Tunggakan
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="tunggakanHeaders"
              :items="tunggakanPerKelas"
              :loading="loading"
              class="elevation-0"
              :items-per-page="12"
              hide-default-footer
            >
              <template #item.kelas="{ item }">
                <div class="font-weight-medium">{{ item.kelas }}</div>
              </template>

              <template #item.jumlah_santri="{ item }">
                <div class="text-center">
                  <v-chip color="warning" text-color="white" small>
                    {{ item.jumlah_santri }}
                  </v-chip>
                </div>
              </template>

              <template #item.total_tunggakan="{ item }">
                <div class="text-right font-weight-bold warning--text">
                  {{ formatCurrency(item.total_tunggakan) }}
                </div>
              </template>

              <template #item.rata_rata="{ item }">
                <div class="text-right">
                  {{ formatCurrency(item.rata_rata) }}
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-subtitle-1">Memuat data laporan keuangan...</p>
    </v-overlay>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// Import Firebase modules
import { db, appId } from '@/plugins/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Reactive data
const loading = ref(false);
const generatingReport = ref(false);
const selectedTahunAjaran = ref('2025/2026');
const selectedPeriod = ref('month');
const customStartDate = ref('');
const customEndDate = ref('');

// Data
const allSantriData = ref([]);
const sppPayments = ref([]);
const tabunganData = ref([]);

// Options
const tahunAjaranOptions = [
  { title: '2025/2026', value: '2025/2026' },
  { title: '2024/2025', value: '2024/2025' },
  { title: '2023/2024', value: '2023/2024' }
];

const periodOptions = [
  { title: 'Bulan Ini', value: 'month' },
  { title: 'Semester Ini', value: 'semester' },
  { title: 'Tahun Ajaran Ini', value: 'year' },
  { title: 'Periode Kustom', value: 'custom' }
];

// Computed properties
const selectedPeriodLabel = computed(() => {
  const option = periodOptions.find(opt => opt.value === selectedPeriod.value);
  return option ? option.title : 'Periode Dipilih';
});

const totalPenerimaan = computed(() => {
  // Calculate total SPP income based on selected period
  // This is placeholder calculation
  return 125000000; // Example: 125 million
});

const totalSaldoTabungan = computed(() => {
  // Calculate total savings balance
  return allSantriData.value.reduce((total, santri) => {
    return total + (santri.saldo_tabungan || 0);
  }, 0);
});

const totalTunggakan = computed(() => {
  // Calculate total outstanding payments
  // This is placeholder calculation
  return 15000000; // Example: 15 million
});

const tunggakanCount = computed(() => {
  // Count students with outstanding payments
  return allSantriData.value.filter(santri => 
    (santri.spp_status_saat_ini || 'belum_lunas') !== 'lunas'
  ).length;
});

const totalSantriAktif = computed(() => {
  return allSantriData.value.filter(santri => 
    santri.status_santri_saat_ini === 'aktif'
  ).length;
});

const penerimaanPerKelas = computed(() => {
  const kelasData = {};
  
  // Group santri by class
  allSantriData.value.forEach(santri => {
    if (santri.kelas_saat_ini && santri.status_santri_saat_ini === 'aktif') {
      const kelas = `Kelas ${santri.kelas_saat_ini} ${santri.gender === 'Laki-laki' ? 'Pa' : 'Pi'}`;
      
      if (!kelasData[kelas]) {
        kelasData[kelas] = {
          kelas,
          total_santri: 0,
          sudah_bayar: 0,
          belum_bayar: 0,
          total_penerimaan: 0
        };
      }
      
      kelasData[kelas].total_santri++;
      
      // Placeholder logic for payment status
      const isLunas = Math.random() > 0.3; // 70% chance of being paid
      if (isLunas) {
        kelasData[kelas].sudah_bayar++;
        kelasData[kelas].total_penerimaan += (santri.jumlah_spp_beban_per_bulan || 300000);
      } else {
        kelasData[kelas].belum_bayar++;
      }
    }
  });
  
  return Object.values(kelasData);
});

const tunggakanPerKelas = computed(() => {
  const kelasData = {};
  
  // Group santri by class for outstanding payments
  allSantriData.value.forEach(santri => {
    if (santri.kelas_saat_ini && santri.status_santri_saat_ini === 'aktif') {
      const kelas = `Kelas ${santri.kelas_saat_ini} ${santri.gender === 'Laki-laki' ? 'Pa' : 'Pi'}`;
      
      // Placeholder logic for outstanding payments
      const hasTunggakan = Math.random() > 0.7; // 30% chance of having outstanding payment
      
      if (hasTunggakan) {
        if (!kelasData[kelas]) {
          kelasData[kelas] = {
            kelas,
            jumlah_santri: 0,
            total_tunggakan: 0
          };
        }
        
        kelasData[kelas].jumlah_santri++;
        const tunggakan = (santri.jumlah_spp_beban_per_bulan || 300000) * Math.floor(Math.random() * 3 + 1);
        kelasData[kelas].total_tunggakan += tunggakan;
      }
    }
  });
  
  // Calculate average
  Object.values(kelasData).forEach(kelas => {
    kelas.rata_rata = kelas.total_tunggakan / kelas.jumlah_santri;
  });
  
  return Object.values(kelasData);
});

// Table headers
const kelasHeaders = [
  { text: 'Kelas', value: 'kelas', sortable: true },
  { text: 'Total Santri', value: 'total_santri', sortable: true },
  { text: 'Sudah Bayar', value: 'sudah_bayar', sortable: true },
  { text: 'Belum Bayar', value: 'belum_bayar', sortable: true },
  { text: 'Total Penerimaan', value: 'total_penerimaan', sortable: true }
];

const tunggakanHeaders = [
  { text: 'Kelas', value: 'kelas', sortable: true },
  { text: 'Jumlah Santri', value: 'jumlah_santri', sortable: true },
  { text: 'Total Tunggakan', value: 'total_tunggakan', sortable: true },
  { text: 'Rata-rata', value: 'rata_rata', sortable: true }
];

// Methods
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const loadData = async () => {
  loading.value = true;

  try {
    // Load santri data
    const santriCollectionRef = collection(db, `artifacts/${appId}/public/data/santri`);
    const santriSnapshot = await getDocs(santriCollectionRef);
    const santriData = [];
    santriSnapshot.forEach((doc) => {
      const data = doc.data();
      santriData.push({
        id: doc.id,
        ...data,
        saldo_tabungan: data.saldo_tabungan || 0,
        jumlah_spp_beban_per_bulan: data.jumlah_spp_beban_per_bulan || 300000
      });
    });
    allSantriData.value = santriData;

    console.log('Financial report data loaded');
  } catch (err) {
    console.error('Error loading financial report data:', err);
  } finally {
    loading.value = false;
  }
};

const generateReport = async () => {
  generatingReport.value = true;
  
  try {
    // Generate comprehensive report
    const reportData = {
      periode: selectedPeriodLabel.value,
      tahun_ajaran: selectedTahunAjaran.value,
      total_penerimaan: totalPenerimaan.value,
      total_saldo_tabungan: totalSaldoTabungan.value,
      total_tunggakan: totalTunggakan.value,
      total_santri_aktif: totalSantriAktif.value,
      penerimaan_per_kelas: penerimaanPerKelas.value,
      tunggakan_per_kelas: tunggakanPerKelas.value,
      generated_at: new Date().toISOString()
    };

    // Create and download report as JSON (you can modify this to generate PDF/Excel)
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_keuangan_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Report generated successfully');
  } catch (err) {
    console.error('Error generating report:', err);
  } finally {
    generatingReport.value = false;
  }
};

// Watchers
watch([selectedTahunAjaran, selectedPeriod], () => {
  // Reload data when filters change
  loadData();
});

// Lifecycle
onMounted(() => {
  console.log('LaporanKeuangan mounted - loading data');
  loadData();
});
</script>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #fafafa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
}

.v-data-table {
  font-size: 0.875rem;
}

.v-chip {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .v-data-table {
    font-size: 0.8rem;
  }
}
</style>