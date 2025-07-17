<template>
  <!-- Menambahkan :width="sidebarWidth" untuk mengatur lebar sidebar -->
  <v-navigation-drawer app permanent class="fixed-sidebar" :width="sidebarWidth">
    <!-- Fixed Logo Section -->
    <div class="logo-section">
      <!-- Mengubah div ini menjadi flex container untuk mensejajarkan logo dan teks -->
      <div class="d-flex align-center px-4 py-4">
        <!-- Logo Image -->
        <v-img
          src="/img/logo.png"
          alt="SINTAS Logo"
          max-width="40"
          max-height="40"
          class="mr-2"
        ></v-img>
        <div>
          <h2 class="text-h5 font-weight-bold primary--text mb-0">SINTAS</h2>
          <p class="text-caption grey--text mb-0">Sistem Integrasi Data Santri</p>
        </div>
      </div>
      <v-divider />
    </div>

    <!-- User Info Section -->
    <div class="user-section pa-2">
      <div class="text-center">
        <div class="text-subtitle-2 font-weight-light mb-1">{{ userName }}</div>
        <v-chip
          :color="getRoleColor(userRole)"
          text-color="white"
          small
        >
          {{ getRoleLabel(userRole) }}
        </v-chip>
      </div>
      <v-divider class="mt-4" />
    </div>

    <!-- Scrollable Navigation -->
    <div class="nav-section">
      <v-list dense nav>
        <!-- Home -->
        <v-list-item :to="dashboardRoute" exact active-class="active-link">
          <template v-slot:prepend>
            <v-icon>mdi-home</v-icon>
          </template>
          <v-list-item-title class="submenu-text">Home</v-list-item-title>
        </v-list-item>

        <!-- Administrasi (Manajemen) - Dipindahkan di sini -->
        <!-- Administrasi Keuangan (Dropdown Menu) -->
        <v-list-group v-if="canAccessPembayaranSpp" value="adm-keuangan">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
          <template v-slot:prepend>
            <v-icon>mdi-file-document-multiple</v-icon>
          </template>
              <v-list-item-title class="submenu-text">Adm Manajemen</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item :to="pembayaranSppRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-cash-multiple</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Pembayaran SPP</v-list-item-title>
          </v-list-item>

          <v-list-item :to="tabunganSantriRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-piggy-bank</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Tabungan Santri</v-list-item-title>
          </v-list-item>

          <v-list-item :to="manajemenSppRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Manajemen SPP</v-list-item-title>
          </v-list-item>

          <v-list-item :to="logTransaksiRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-file-document-multiple</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Log Transaksi</v-list-item-title>
          </v-list-item>

          <v-list-item :to="laporanKeuanganRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-chart-line</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Laporan Keuangan</v-list-item-title>
          </v-list-item>

          <v-list-item :to="tunggakanSppRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-alert-circle</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Tunggakan SPP</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Data Manajemen - Item baru, dipindahkan di sini -->
        <!-- PERUBAHAN DI SINI: Tambahkan kondisi untuk role 'admin' -->
        <v-list-item v-if="canAccessDataManajemen || userRole === 'admin'" :to="dataManajemenRoute" link active-class="active-link">
          <template v-slot:prepend>
            <v-icon>mdi-database</v-icon> <!-- Icon untuk manajemen data -->
          </template>
          <v-list-item-title class="submenu-text">TU Manajemen</v-list-item-title>
        </v-list-item>


        <!-- Direct Link: Akademik (Santri, Asistenpa, Asistenpi) -->
        <v-list-item v-if="canAccessPersonalAcademic" :to="akademikRoute" link active-class="active-link">
          <template v-slot:prepend>
            <v-icon>mdi-book-open</v-icon>
          </template>
          <v-list-item-title class="submenu-text">Akademik</v-list-item-title>
        </v-list-item>

        <!-- Direct Link: Kepondokan (Santri, Asistenpa, Asistenpi) -->
        <v-list-item v-if="canAccessPersonalKepondokan" :to="kepondokanRoute" link active-class="active-link">
          <template v-slot:prepend>
            <v-icon>mdi-home</v-icon>
          </template>
          <v-list-item-title class="submenu-text">Kepondokan</v-list-item-title>
        </v-list-item>

        <!-- Direct Link: Administrasi (Personal: Santri, Asistenpa, Asistenpi) -->
        <v-list-item v-if="canAccessAdministrasiPersonal" :to="administrasiPersonalRoute" link active-class="active-link">
          <template v-slot:prepend>
            <v-icon>mdi-file-document-outline</v-icon>
          </template>
          <v-list-item-title class="submenu-text">Administrasi</v-list-item-title>
        </v-list-item>

        <!-- Divider untuk memisahkan menu pribadi dan menu tugas asisten/manajemen -->
        <v-divider v-if="['asistenpa', 'asistenpi'].includes(userRole) || canAccessPembayaranSpp || canAccessDataManajemen || userRole === 'admin'" class="my-2" />

        <!-- Direct Link: Berita Acara (Asistenpa, Asistenpi) - Hanya Melihat -->
        <v-list-item v-if="['asistenpa', 'asistenpi'].includes(userRole)" :to="beritaAcaraRoute" link active-class="active-link">
          <template v-slot:prepend>
            <v-icon>mdi-file-document</v-icon>
          </template>
          <v-list-item-title class="submenu-text">Berita Acara</v-list-item-title>
        </v-list-item>

        <!-- Data Santri (Admin, Phpapi, Ustadz, Ustadzah) -->
        <v-menu
          v-if="canAccessDataSantri"
          open-on-hover open-delay="10"
          location="end"
          offset-y
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon>mdi-account-multiple</v-icon>
              </template>
              <v-list-item-title class="submenu-text">Data Santri</v-list-item-title>
              <template v-slot:append>
                <v-icon small>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </template>
          <v-card min-width="320" class="pa-2">
            <v-row no-gutters>
              <!-- Kolom Putra -->
              <v-col v-if="canAccessPutra" :cols="canAccessPutri ? 6 : 12" class="pr-1">
                <v-list dense>
                  <v-list-subheader class="text-center font-weight-bold text-blue">Putra</v-list-subheader>
                  <v-list-item
                    v-for="kelas in 7"
                    :key="'Pa' + kelas"
                    :to="kelasRoute(kelas, 'pa')"
                    link
                    class="px-2 santri-menu-item"
                    active-class="active-link"
                  >
                    <v-list-item-title class="submenu-text">Kelas {{ kelas }} Pa </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>

              <!-- Kolom Putri -->
              <v-col v-if="canAccessPutri" :cols="canAccessPutra ? 6 : 12" class="pl-1">
                <v-list dense>
                  <v-list-subheader class="text-center font-weight-bold text-pink">Putri</v-list-subheader>
                  <v-list-item
                    v-for="kelas in 7"
                    :key="'Pi' + kelas"
                    :to="kelasRoute(kelas, 'pi')"
                    link
                    class="px-2 santri-menu-item"
                    active-class="active-link"
                  >
                    <v-list-item-title class="submenu-text">Kelas {{ kelas }} Pi</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </v-menu>

        <!-- OKAPEMA (Admin, Phpapi, Ustadz, Ustadzah) - Daftar Alumni -->
        <v-menu
          v-if="canAccessOkapema"
          open-on-hover open-delay="10"
          location="end"
          offset-y
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon>mdi-account-group</v-icon> <!-- Icon untuk Alumni/Grup -->
              </template>
              <v-list-item-title class="submenu-text">OKAPEMA</v-list-item-title>
              <template v-slot:append>
                <v-icon small>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </template>
          <v-card min-width="200" class="pa-2"> <!-- Lebar lebih kecil jika hanya 2 opsi -->
            <v-list dense>
              <v-list-item
                v-if="canAccessOkapemaPutra"
                :to="alumniGenderRoute('pa')"
                link
                class="px-2 santri-menu-item"
                active-class="active-link"
              >
                <v-list-item-title class="submenu-text">Alumni Putra</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="canAccessOkapemaPutri"
                :to="alumniGenderRoute('pi')"
                link
                class="px-2 santri-menu-item"
                active-class="active-link"
              >
                <v-list-item-title class="submenu-text">Alumni Putri</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <!-- Monitoring (Admin, Phpapi) -->
        <v-list-item v-if="canAccessMonitoring" :to="monitoringRoute" link active-class="active-link">
          <template v-slot:prepend>
            <v-icon>mdi-monitor-dashboard</v-icon>
          </template>
          <v-list-item-title class="submenu-text">Monitoring</v-list-item-title>
        </v-list-item>

        <!-- BA Akademik (Admin, Phpapi, Ustadz, Ustadzah) -->
        <v-list-group v-if="userHasRole(['admin', 'phpapi', 'ustadz', 'ustadzah'])" value="ba-akademik">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon>mdi-book-open-page-variant</v-icon>
              </template>
              <v-list-item-title class="submenu-text">BA Akademik</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item :to="jurnalKBMRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-notebook</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Jurnal KBM</v-list-item-title>
          </v-list-item>

          <v-list-item :to="presensiSantriRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-account-check</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Presensi Santri</v-list-item-title>
          </v-list-item>

          <v-list-item :to="infoKBMRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Info KBM</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- BA Kepondokan (Admin, Phpapi, Ustadz, Ustadzah) -->
        <v-list-group v-if="userHasRole(['admin', 'phpapi', 'ustadz', 'ustadzah'])" value="ba-kepondokan">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon>mdi-home-group</v-icon>
              </template>
              <v-list-item-title class="submenu-text">BA Kepondokan</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item :to="kesehatanRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-heart-pulse</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Kesehatan</v-list-item-title>
          </v-list-item>

          <v-list-item :to="presensiJamaahRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-account-clock</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Presensi Jama'ah</v-list-item-title>
          </v-list-item>

          <v-list-item :to="kegiatanRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-calendar-star</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Kegiatan</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Berita Acara (Admin, Phpapi, Ustadz, Ustadzah) - Grup untuk Input/Edit -->
        <v-list-group v-if="userHasRole(['admin', 'phpapi', 'ustadz', 'ustadzah'])" value="berita-acara">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon>mdi-file-document</v-icon>
              </template>
              <v-list-item-title class="submenu-text">Berita Acara</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item :to="mahkamahRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-gavel</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Mahkamah</v-list-item-title>
          </v-list-item>

          <v-list-item :to="beritaAcaraRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-file-document-edit</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Input BA</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Input Nilai (Semua Pengajar & Asisten) -->
        <v-list-group v-if="canAccessInputNilai" value="input-nilai">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon>mdi-clipboard-edit</v-icon>
              </template>
              <v-list-item-title class="submenu-text">Input Nilai</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item :to="inputNilaiRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-book-edit</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Nilai Mapel</v-list-item-title>
          </v-list-item>

          <v-list-item :to="nilaiSikapRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-account-heart</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Nilai Sikap</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- PKL (Asistenpa, Asistenpi) -->
        <v-list-group v-if="userHasRole(['asistenpa', 'asistenpi'])" value="pkl">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon>mdi-school</v-icon>
              </template>
              <v-list-item-title class="submenu-text">PKL</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item :to="jurnalKBMRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-notebook</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Jurnal KBM</v-list-item-title>
          </v-list-item>

          <v-list-item :to="presensiSantriRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-account-check</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Presensi Santri</v-list-item-title>
          </v-list-item>

          <v-list-item :to="infoKBMRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Info KBM</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Admin Panel (Admin only) -->
        <v-divider v-if="canAccessAdminPanel" class="my-2" />
        <v-list-group v-if="canAccessAdminPanel" value="admin">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon>mdi-shield-account</v-icon>
              </template>
              <v-list-item-title class="submenu-text">Admin Panel</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item :to="kelolaUserRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-account-cog</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Kelola User</v-list-item-title>
          </v-list-item>

          <v-list-item :to="pengaturanSistemRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Pengaturan Sistem</v-list-item-title>
          </v-list-item>

          <v-list-item :to="logAktivitasRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-file-document-multiple</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Log Aktivitas</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </div>

    <!-- Fixed User Menu at Bottom -->
    <div class="user-menu-section">
      <v-divider />
      <v-menu location="top" open-on-hover open-delay="20">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" class="user-menu-item">
            <template v-slot:prepend>
              <v-icon>mdi-account-circle</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Menu User</v-list-item-title>
            <template v-slot:append>
              <v-icon>mdi-chevron-up</v-icon>
            </template>
          </v-list-item>
        </template>
        <v-list>
          <v-list-item :to="profilRoute" link active-class="active-link">
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Profil</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout" link>
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title class="submenu-text">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

// Variabel reaktif untuk lebar sidebar. Anda bisa mengubah nilai ini.
const sidebarWidth = ref(280); // Default width in pixels

const userRole = computed(() => store.getters.userRole);
const userRoles = computed(() => store.getters.userRoles); // Getter untuk array peran

const userName = computed(() => store.getters.userName); // Menggunakan getter dari store
const userIdentifier = computed(() => store.getters.userIdentifier); // Menggunakan getter untuk user_id/nomor_induk

// Menggunakan dashboardRoute dari store
const dashboardRoute = computed(() => store.getters.dashboardRoute);

const canAccessDataSantri = computed(() => store.getters.canAccessDataSantri);
const canAccessPutra = computed(() => store.getters.canAccessPutra);
const canAccessPutri = computed(() => store.getters.canAccessPutri);

const canAccessInputNilai = computed(() => store.getters.canAccessInputNilai);
const canAccessMonitoring = computed(() => store.getters.canAccessMonitoring);
const canAccessAdminPanel = computed(() => store.getters.canAccessAdminPanel);

// Computed properties untuk akses menu pribadi (Akademik, Kepondokan, Administrasi)
const canAccessPersonalAcademic = computed(() => store.getters.canAccessPersonalAcademic);
const canAccessPersonalKepondokan = computed(() => store.getters.canAccessPersonalKepondokan);
const canAccessAdministrasiPersonal = computed(() => store.getters.canAccessAdministrasi);


// Computed properties untuk akses OKAPEMA
const canAccessOkapema = computed(() => store.getters.canAccessOkapema);
const canAccessOkapemaPutra = computed(() => store.getters.canAccessOkapemaPutra);
const canAccessOkapemaPutri = computed(() => store.getters.canAccessOkapemaPutri);

// Computed property untuk akses Keuangan (menggunakan getter yang sudah ada)
const canAccessPembayaranSpp = computed(() => store.getters.canAccessPembayaranSpp);

// Computed property baru untuk akses Data Manajemen
const canAccessDataManajemen = computed(() => store.getters.canAccessDataManajemen);


// Rute yang dibangun berdasarkan dashboardRoute
const jurnalKBMRoute = computed(() => `${dashboardRoute.value}/jurnal-kbm`);
const inputNilaiRoute = computed(() => `${dashboardRoute.value}/input-nilai`);
const kesehatanRoute = computed(() => `${dashboardRoute.value}/kesehatan-santri`);
const beritaAcaraRoute = computed(() => `${dashboardRoute.value}/berita-acara`); // Rute ini akan digunakan untuk tautan langsung dan grup

// Rute baru untuk tautan langsung Akademik, Kepondokan, Administrasi Personal
const akademikRoute = computed(() => `${dashboardRoute.value}/akademik`);
const kepondokanRoute = computed(() => `${dashboardRoute.value}/kepondokan`);
const administrasiPersonalRoute = computed(() => `${dashboardRoute.value}/administrasi`); // Mengarah ke tampilan personal

// Rute baru untuk menu Keuangan
const pembayaranSppRoute = computed(() => `${dashboardRoute.value}/pembayaran-spp`);
const tabunganSantriRoute = computed(() => `${dashboardRoute.value}/tabungan-santri`); // Placeholder
const manajemenSppRoute = computed(() => `${dashboardRoute.value}/manajemen-spp`); // Placeholder
const logTransaksiRoute = computed(() => `${dashboardRoute.value}/log-transaksi`);
const laporanKeuanganRoute = computed(() => `${dashboardRoute.value}/laporan-keuangan`); // Placeholder
const tunggakanSppRoute = computed(() => `${dashboardRoute.value}/tunggakan-spp`); // Placeholder

// Rute untuk Data Manajemen
const dataManajemenRoute = computed(() => `${dashboardRoute.value}/data-manajemen`);

// Rute untuk Admin Panel
const kelolaUserRoute = computed(() => `${dashboardRoute.value}/kelola-user`); // Placeholder
const pengaturanSistemRoute = computed(() => `${dashboardRoute.value}/pengaturan-sistem`); // Placeholder
const logAktivitasRoute = computed(() => `${dashboardRoute.value}/log-aktivitas`); // Placeholder
const monitoringRoute = computed(() => `${dashboardRoute.value}/monitoring`); // Placeholder

// Rute untuk BA Akademik & Kepondokan
const presensiSantriRoute = computed(() => `${dashboardRoute.value}/presensi-santri`); // Placeholder
const infoKBMRoute = computed(() => `${dashboardRoute.value}/info-kbm`); // Placeholder
const presensiJamaahRoute = computed(() => `${dashboardRoute.value}/presensi-jamaah`); // Placeholder
const kegiatanRoute = computed(() => `${dashboardRoute.value}/kegiatan`); // Placeholder
const mahkamahRoute = computed(() => `${dashboardRoute.value}/mahkamah`); // Placeholder
const nilaiSikapRoute = computed(() => `${dashboardRoute.value}/nilai-sikap`); // Placeholder

// Rute untuk Profil (menggunakan userRole untuk rute spesifik, atau StudentProfil sebagai fallback)
const profilRoute = computed(() => {
  const currentRole = userRole.value;
  const userId = userIdentifier.value; // Ambil user_id dari store

  if (!userId) {
    return '/'; // Atau rute default jika user ID tidak tersedia
  }

  // Jika peran adalah 'santri', gunakan rute StudentProfil
  if (currentRole === 'santri') {
    return { name: 'StudentProfil', params: { nomor: userId } };
  }
  // Untuk peran lain, gunakan rute InformasiSantri yang sesuai dengan peran
  // Ini mengasumsikan rute seperti 'AdminInformasiSantri', 'PhpapiInformasiSantri' sudah ada
  return { name: `${capitalizeFirstLetter(currentRole)}InformasiSantri`, params: { nomor: userId } };
});


const alumniGenderRoute = (genderParam) => {
  return { name: `${capitalizeFirstLetter(userRole.value)}DaftarAlumni`, params: { gender: genderParam } };
};

const kelasRoute = (kelas, genderParam) => {
  return { name: `${capitalizeFirstLetter(userRole.value)}DataSantri`, params: { kelas: kelas, gender: genderParam } };
};

const getRoleLabel = (role) => {
  const roleLabels = {
    'admin': 'Administrator',
    'phpapi': 'Phpapi',
    'ustadz': 'Ustadz',
    'ustadzah': 'Ustadzah',
    'asistenpa': 'Asisten Pa',
    'asistenpi': 'Asisten Pi',
    'santri': 'Santri',
    'keuangan': 'Keuangan',
    'tatadata': 'Tata Data' // Tambahkan label untuk peran 'tatadata'
  };
  return roleLabels[role] || role;
};

const getRoleColor = (role) => {
  const roleColors = {
    'admin': 'red',
    'phpapi': 'purple',
    'ustadz': 'blue',
    'ustadzah': 'pink',
    'asistenpa': 'teal',
    'asistenpi': 'cyan',
    'santri': 'green',
    'keuangan': 'orange',
    'tatadata': 'indigo' // Warna untuk peran 'tatadata'
  };
  return roleColors[role] || 'grey';
};

const logout = async () => { // Ubah menjadi async
  const userToLogout = store.getters.user;
  // Menggunakan user_id dari store untuk logout
  const userIdentifierToLogout = userToLogout?.user_id;

  if (userIdentifierToLogout) {
    try {
      // Panggil aksi logout dari Vuex store yang akan mengupdate Firestore
      await store.dispatch('logout');
      console.log('Logout initiated via Firestore store action.');
    } catch (error) {
      console.error('Error initiating logout via Firestore store action:', error);
      // Lanjutkan logout di frontend meskipun ada error di Firestore
    }
  } else {
    console.warn('No user identifier found for logout.');
  }

  // PERBAIKAN DI SINI: Arahkan pengguna ke halaman login setelah logout selesai
  router.push('/');
};

// Fungsi pembantu untuk mengkapitalisasi huruf pertama
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Fungsi userHasRole diubah menjadi lokal karena tidak lagi diimpor dari mapActions
const userHasRole = (roles) => {
  if (!Array.isArray(userRoles.value)) {
    return false;
  }
  return roles.some(role => userRoles.value.includes(role));
};
</script>

<style scoped>
.fixed-sidebar {
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh !important;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

/* Fixed Logo Section */
.logo-section {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1001;
  border-bottom: 0px solid #e0e0e0;
}

/* Fixed User Section */
.user-section {
  position: sticky;
  top: 85px; /* Sesuaikan jika tinggi logo berubah */
  background-color: white;
  z-index: 1001;
  border-bottom: 0px solid #e0e0e0;
}

/* Scrollable Navigation */
.nav-section {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px; /* Ruang untuk menu user di bawah */
}

/* Fixed User Menu at Bottom */
.user-menu-section {
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 1001;
  border-top: 1px solid #e0e0e0;
}

.active-link {
  background-color: #E3F2FD !important;
  color: #1565C0 !important;
  /* Hapus atau komentari baris ini jika ada border-bottom */
  /* border-bottom: 2px solid #1565C0; */
}

.submenu-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 300;
}

.text-blue {
  color: #1976D2 !important;
}

.text-pink {
  color: #E91E63 !important;
}

.santri-menu-item {
  border-radius: 4px;
  margin: 2px 0;
  transition: background-color 0.2s ease;
}

.santri-menu-item:hover {
  background-color: #f5f5f5;
}

.user-menu-item {
  background-color: #f8f9fa;
}

.v-card {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Custom scrollbar for navigation */
.nav-section::-webkit-scrollbar {
  width: 6px;
}

.nav-section::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.nav-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.nav-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.v-list-item:hover {
  background-color: #C6E7FF; /* Warna  saat di-hover */
}

.v-list-item {
  transition: background-color 0.2s ease;
}
</style>
