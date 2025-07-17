<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h2 class="text-h5 font-weight-bold mb-2">Data Santri</h2>
            <v-chip
              :color="genderColor"
              text-color="white"
              small
              class="mr-2"
            >
              Kelas {{ kelas }} {{ genderLabel }}
            </v-chip>
            <v-chip
              color="grey"
              text-color="white"
              small
            >
              Total: {{ filteredSantri.length }} santri
            </v-chip>
          </div>
          <v-btn
            color="primary"
            @click="loadData"
            :loading="loading"
            icon
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading && filteredSantri.length === 0">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="mt-4 text-subtitle-1">Memuat data santri...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert
          type="error"
          prominent
          border="left"
          class="mb-4"
        >
          <v-row align="center">
            <v-col class="grow">
              <div class="title">Gagal memuat data</div>
              <div>{{ error }}</div>
            </v-col>
            <v-col class="shrink">
              <v-btn color="error" @click="loadData">
                Coba Lagi
              </v-btn>
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
            :items="filteredSantri"
            :loading="loading"
            class="elevation-0 clickable-table"
            :items-per-page="15"
            :footer-props="{
              'items-per-page-options': [10, 15, 25, 50, -1],
              'items-per-page-text': 'Baris per halaman:'
            }"
            @click:row="handleRowClick"
          >
            <!-- Judul kolom eksplisit -->
            <template #headers="{ columns }">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.value"
                  class="text-left"
                  style="font-weight: 600; font-size: 0.85rem;"
                >
                  {{ column.text }}
                </th>
              </tr>
            </template>

            <template #item.status_santri_saat_ini="{ item }">
              <v-chip
                :color="getStatusColor(item['status_santri_saat_ini'])"
                text-color="white"
                small
              >
                {{ item['status_santri_saat_ini'] }}
              </v-chip>
            </template>

            <template #item.gender="{ item }">
              <v-chip
                :color="item.gender === 'Laki-laki' ? 'blue' : 'pink'"
                text-color="white"
                small
              >
                {{ item.gender }}
              </v-chip>
            </template>

            <template #no-data>
              <div class="text-center py-8">
                <v-icon size="64" color="grey lighten-1">mdi-account-off</v-icon>
                <p class="text-subtitle-1 mt-4">Tidak ada data santri</p>
                <p class="text-body-2 grey--text">
                  Belum ada data untuk kelas ini
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
import { useRoute, useRouter } from 'vue-router';
// Import Firebase modules dari file inisialisasi terpusat
import { db, appId } from '@/plugins/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


const route = useRoute();
const router = useRouter();

const loading = ref(false);
const error = ref(null);
const allSantriData = ref([]); // Akan menyimpan semua data santri dari Firestore

const kelas = computed(() => {
  console.log('Computed: Kelas dari URL:', route.params.kelas);
  return route.params.kelas;
});
const genderParam = computed(() => {
  console.log('Computed: Gender Param dari URL:', route.params.gender);
  return route.params.gender;
});
const gender = computed(() => {
  const g = genderParam.value === 'pa' ? 'Laki-laki' : 'Perempuan';
  console.log('Computed: Gender yang diharapkan (setelah konversi):', g);
  return g;
});
const genderLabel = computed(() => genderParam.value === 'pa' ? 'Pa' : 'Pi');
const genderColor = computed(() => genderParam.value === 'pa' ? 'blue' : 'pink');

const headers = [
  { text: 'User ID', value: 'user_id', sortable: true, width: '120px' }, // Menggunakan user_id
  { text: 'Nama Santri', value: 'nama_santri', sortable: true, width: '200px' },
  { text: 'Gender', value: 'gender', sortable: true, width: '100px' },
  { text: 'Tahun Masuk', value: 'tahun_masuk_pondok', sortable: true, width: '120px' },
  { text: 'Jenjang Masuk', value: 'jenjang_masuk_pondok', sortable: true, width: '130px' },
  { text: 'Status', value: 'status_santri_saat_ini', sortable: true, width: '120px' }, // Menggunakan field denormalisasi
  { text: 'Kelas', value: 'kelas_saat_ini', sortable: true, width: '80px' }, // Menggunakan field denormalisasi
  { text: 'Kabupaten', value: 'kabupaten', sortable: true, width: '150px' }
];

const filteredSantri = computed(() => {
  console.log('Computed: Memulai filter santri...');
  console.log('Computed: allSantriData.value (sebelum filter):', allSantriData.value);
  const filtered = allSantriData.value.filter(santri => {
    // Pastikan nama field sesuai dengan struktur denormalisasi Firestore yang baru
    const santriKelas = santri.kelas_saat_ini?.toString(); // Menggunakan field denormalisasi
    const santriGender = santri.gender?.toLowerCase(); // Menggunakan field denormalisasi
    const targetKelas = kelas.value;
    const targetGender = gender.value?.toLowerCase();

    const matchKelas = santriKelas === targetKelas;
    const matchGender = santriGender === targetGender;

    return matchKelas && matchGender;
  });
  console.log('Computed: filteredSantri (setelah filter):', filtered);
  return filtered;
});

const handleRowClick = (event, { item }) => {
  const userId = item['user_id']; // Menggunakan user_id untuk navigasi
  if (userId) {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const role = user.role?.toLowerCase();
    const basePath = ['admin', 'phpapi'].includes(role) ? `/${role}` : `/${role}`; // Sesuaikan jika ada role lain
    router.push(`${basePath}/informasi-santri/${userId}`); // Navigasi menggunakan user_id
  }
};

const loadData = async () => {
  loading.value = true;
  error.value = null;
  allSantriData.value = []; // Kosongkan data sebelum memuat yang baru

  console.log('Fungsi loadData dipanggil. Memulai fetch data santri dari Firestore.');
  try {
    const santriCollectionRef = collection(db, `artifacts/${appId}/public/data/santri`);
    // Mengambil semua dokumen dari koleksi 'santri'
    const querySnapshot = await getDocs(santriCollectionRef);
    
    const fetchedData = [];
    querySnapshot.forEach((doc) => {
      fetchedData.push(doc.data());
    });

    allSantriData.value = fetchedData;
    console.log('Data allSantriData.value setelah fetch dari Firestore:', allSantriData.value);

  } catch (err) {
    console.error('Error loading santri data dari Firestore:', err);
    error.value = err.message || 'Terjadi kesalahan saat memuat data santri dari Firestore';
  } finally {
    loading.value = false;
    console.log('Fungsi loadData selesai.');
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'aktif': return 'success';
    case 'lulus': return 'primary';
    case 'keluar': return 'warning';
    case 'pindah': return 'info'; // Jika masih ada 'pindah' dari riwayat lama
    default: return 'grey';
  }
};

watch([kelas, gender], () => {
  console.log('Watch: kelas atau gender berubah. Memuat ulang data.');
  loadData();
});

onMounted(() => {
  console.log('onMounted: Memuat data awal.');
  loadData();
});
</script>

<style scoped>
.v-data-table {
  font-size: 0.875rem;
}

.v-chip {
  font-size: 0.75rem;
}

.clickable-table >>> tbody tr {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable-table >>> tbody tr:hover {
  background-color: #C6E7FF !important;
}

@media (max-width: 768px) {
  .v-data-table {
    font-size: 0.8rem;
  }
}
</style>
