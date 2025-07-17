<template>
  <v-container fluid class="py-4">
    <!-- Header Sticky Bar -->
    <div class="sticky-header">
      <v-row class="align-center">
        <v-col cols="auto">
          <v-btn icon @click="goBack" color="primary">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <div>
            <h3 class="text-h6 font-weight-bold mb-0">
              {{ dataSantri['nama_santri'] || 'Memuat...' }}
            </h3>
            <p class="text-body-2 grey--text mb-0">
              {{ dataSantri['user_id'] || '-' }}
            </p>
          </div>
        </v-col>

        <v-col>
          <v-tabs v-model="tab" align-tabs="end" color="primary">
            <v-tab value="biodata">BIODATA</v-tab>
            <v-tab value="akademik">AKADEMIK</v-tab>
            <v-tab value="kepondokan">KEPONDOKAN</v-tab>
            <v-tab value="administrasi">ADMINISTRASI</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </div>

    <!-- Loading State -->
    <v-row v-if="loading" class="mt-4">
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
    <v-row v-else-if="error" class="mt-4">
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
              <v-btn color="error" @click="fetchData"> <!-- Memanggil fetchData untuk coba lagi -->
                Coba Lagi
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Konten Tab (hanya tampil jika tidak loading dan tidak ada error) -->
    <v-window v-else v-model="tab" class="mt-4">
      <v-window-item value="biodata">
        <BiodataSantri :data="dataSantri" />
      </v-window-item>
      <v-window-item value="akademik">
        <AkademikSantri :data="dataSantri" />
      </v-window-item>
      <v-window-item value="kepondokan">
        <KepondokanSantri :data="dataSantri" />
      </v-window-item>
      <v-window-item value="administrasi">
        <AdministrasiSantri :data="dataSantri" />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import BiodataSantri from '@/components/santri/BiodataSantri.vue';
import AkademikSantri from '@/components/santri/AkademikSantri.vue';
import KepondokanSantri from '@/components/santri/KepondokanSantri.vue';
import AdministrasiSantri from '@/components/santri/AdministrasiSantri.vue';

// Import Firebase modules dari file inisialisasi terpusat
import { db, appId } from '@/plugins/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


export default {
  name: 'InformasiSantri',
  components: {
    BiodataSantri,
    AkademikSantri,
    KepondokanSantri,
    AdministrasiSantri
  },
  data() {
    return {
      tab: 'biodata',
      dataSantri: {},
      loading: false,
      error: null
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchData() {
      this.loading = true;
      this.error = null;

      try {
        const userIdParam = this.$route.params.nomor; // Menggunakan 'nomor' sebagai user_id
        console.log("Fetching data for user_id:", userIdParam);

        // Query Firestore untuk mencari santri berdasarkan user_id
        const santriCollectionRef = collection(db, `artifacts/${appId}/public/data/santri`);
        const q = query(santriCollectionRef, where("user_id", "==", userIdParam));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          this.error = 'Data santri tidak ditemukan.';
          this.dataSantri = {}; // Kosongkan data jika tidak ditemukan
        } else {
          const santriDoc = querySnapshot.docs[0];
          this.dataSantri = santriDoc.data();
          console.log("Data santri dari Firestore:", this.dataSantri);
        }
      } catch (err) {
        this.error = 'Terjadi kesalahan saat mengambil data santri dari Firestore.';
        console.error('Error fetching santri data from Firestore:', err);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  // Watch for route changes to refetch data if the user_id in the URL changes
  watch: {
    '$route.params.nomor': 'fetchData'
  }
};
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #ffffff;
  padding-top: 12px;
  padding-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.v-container {
  max-height: calc(100vh - 64px); /* Menyesuaikan agar konten tetap full */
  overflow-y: auto;
}
</style>
