import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'; // Import Vuex store

import LoginView from '../views/LoginView.vue';
import NotFound from '../views/NotFound.vue';

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue';
import PhpapiLayout from '@/layouts/PhpapiLayout.vue';
import UstadzLayout from '@/layouts/UstadzLayout.vue';
import UstadzahLayout from '@/layouts/UstadzahLayout.vue';
import AsistenpaLayout from '@/layouts/AsistenpaLayout.vue';
import AsistenpiLayout from '@/layouts/AsistenpiLayout.vue';
import StudentLayout from '@/layouts/StudentLayout.vue';

// Views Utama
import AdminDashboard from '../views/AdminDashboard.vue';
import PhpapiDashboard from '../views/PhpapiDashboard.vue';
import UstadzDashboard from '../views/UstadzDashboard.vue';
import UstadzahDashboard from '../views/UstadzahDashboard.vue';
import AsistenpaDashboard from '../views/AsistenpaDashboard.vue';
import AsistenpiDashboard from '../views/AsistenpiDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';

// Views Data Santri
import DataSantri from '../views/DataSantri.vue';
import InformasiSantri from '../views/InformasiSantri.vue';

// Views untuk Alumni (OKAPEMA)
import DaftarAlumni from '../views/DaftarAlumni.vue';
import InformasiAlumni from '../views/InformasiAlumni.vue';

// Views Akademik & Kepondokan & Berita Acara (yang sudah ada)
import JurnalKBM from '../views/JurnalKBM.vue';
import InputNilai from '../views/InputNilai.vue';
import KesehatanSantri from '../views/KesehatanSantri.vue';
import BeritaAcara from '../views/BeritaAcara.vue';

// Views untuk Administrasi (Personal vs Manajemen)
import AdministrasiSantri from '@/components/santri/AdministrasiSantri.vue'; // Menggunakan komponen tab sebagai view penuh
import PembayaranSpp from '../views/PembayaranSpp.vue'; // Mengubah nama dari AdministrasiManajemen.vue
import LogTransaksi from '../views/LogTransaksi.vue'; // Komponen baru untuk Log Transaksi

// Menggunakan komponen yang sudah ada di src/components/santri sebagai view personal
import AkademikSantri from '@/components/santri/AkademikSantri.vue';
import KepondokanSantri from '../components/santri/KepondokanSantri.vue'; // Perbaiki path jika diperlukan

// Import komponen baru untuk Data Manajemen
import DataManajemen from '../views/DataManajemen.vue';

// Import komponen baru untuk Keuangan (nama file diperbaiki)
import TabunganSantri from '../views/TabunganSantri.vue';
import ManajemenSpp from '../views/ManajemenSpp.vue'; // Nama file diperbaiki dari ManajemenSPP.vue
import LaporanKeuangan from '../views/LaporanKeuangan.vue';
import TunggakanSpp from '../views/TunggakanSpp.vue'; // Nama file diperbaiki dari TunggakanSPP.vue


const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },

  // Admin Routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'data-santri/:kelas/:gender',
        name: 'AdminDataSantri',
        component: DataSantri
      },
      {
        path: 'informasi-santri/:nomor',
        name: 'AdminInformasiSantri',
        component: InformasiSantri
      },
      // Rute OKAPEMA untuk Admin
      {
        path: 'alumni/:gender',
        name: 'AdminDaftarAlumni',
        component: DaftarAlumni
      },
      {
        path: 'informasi-alumni/:nomor',
        name: 'AdminInformasiAlumni',
        component: InformasiAlumni
      },
      {
        path: 'jurnal-kbm',
        name: 'AdminJurnalKBM',
        component: JurnalKBM
      },
      {
        path: 'input-nilai',
        name: 'AdminInputNilai',
        component: InputNilai
      },
      {
        path: 'kesehatan-santri',
        name: 'AdminKesehatanSantri',
        component: KesehatanSantri
      },
      {
        path: 'berita-acara',
        name: 'AdminBeritaAcara',
        component: BeritaAcara
      },
      // Rute Pembayaran SPP untuk Admin
      {
        path: 'pembayaran-spp',
        name: 'AdminPembayaranSpp',
        component: PembayaranSpp,
        meta: { requiresAuth: true, requiredRoles: ['admin'] }
      },
      // Rute Log Transaksi untuk Admin
      {
        path: 'log-transaksi',
        name: 'AdminLogTransaksi',
        component: LogTransaksi,
        meta: { requiresAuth: true, requiredRoles: ['admin'] }
      },
      // Rute Tabungan Santri untuk Admin
      {
        path: 'tabungan-santri',
        name: 'AdminTabunganSantri',
        component: TabunganSantri,
        meta: { requiresAuth: true, requiredRoles: ['admin'] }
      },
      // Rute Manajemen SPP untuk Admin
      {
        path: 'manajemen-spp',
        name: 'AdminManajemenSpp',
        component: ManajemenSpp,
        meta: { requiresAuth: true, requiredRoles: ['admin'] }
      },
      // Rute Laporan Keuangan untuk Admin
      {
        path: 'laporan-keuangan',
        name: 'AdminLaporanKeuangan',
        component: LaporanKeuangan,
        meta: { requiresAuth: true, requiredRoles: ['admin'] }
      },
      // Rute Tunggakan SPP untuk Admin
      {
        path: 'tunggakan-spp',
        name: 'AdminTunggakanSpp',
        component: TunggakanSpp,
        meta: { requiresAuth: true, requiredRoles: ['admin'] }
      },
      // Rute Data Manajemen untuk Admin
      {
        path: 'data-manajemen',
        name: 'AdminDataManajemen',
        component: DataManajemen,
        meta: { requiresAuth: true, requiredRoles: ['admin'] }
      }
    ]
  },

  // Phpapi Routes
  {
    path: '/phpapi',
    component: PhpapiLayout,
    meta: { requiresAuth: true, allowedRoles: ['phpapi'] },
    children: [
      {
        path: '',
        name: 'PhpapiDashboard',
        component: PhpapiDashboard
      },
      {
        path: 'data-santri/:kelas/:gender',
        name: 'PhpapiDataSantri',
        component: DataSantri
      },
      {
        path: 'informasi-santri/:nomor',
        name: 'PhpapiInformasiSantri',
        component: InformasiSantri
      },
      // Rute OKAPEMA untuk Phpapi
      {
        path: 'alumni/:gender',
        name: 'PhpapiDaftarAlumni',
        component: DaftarAlumni
      },
      {
        path: 'informasi-alumni/:nomor',
        name: 'PhpapiInformasiAlumni',
        component: InformasiAlumni
      },
      {
        path: 'jurnal-kbm',
        name: 'PhpapiJurnalKBM',
        component: JurnalKBM
      },
      {
        path: 'input-nilai',
        name: 'PhpapiInputNilai',
        component: InputNilai
      },
      {
        path: 'kesehatan-santri',
        name: 'PhpapiKesehatanSantri',
        component: KesehatanSantri
      },
      {
        path: 'berita-acara',
        name: 'PhpapiBeritaAcara',
        component: BeritaAcara
      },
      // Rute Data Manajemen untuk Phpapi
      {
        path: 'data-manajemen',
        name: 'PhpapiDataManajemen',
        component: DataManajemen,
        meta: { requiresAuth: true, requiredRoles: ['phpapi'] }
      }
    ]
  },

  // Ustadz Routes (Putra only)
  {
    path: '/ustadz',
    component: UstadzLayout,
    meta: { requiresAuth: true, allowedRoles: ['ustadz'], genderAccess: 'Laki-laki' },
    children: [
      {
        path: '',
        name: 'UstadzDashboard',
        component: UstadzDashboard
      },
      {
        path: 'data-santri/:kelas/:gender',
        name: 'UstadzDataSantri',
        component: DataSantri
      },
      {
        path: 'informasi-santri/:nomor',
        name: 'UstadzInformasiSantri',
        component: InformasiSantri
      },
      // Rute OKAPEMA untuk Ustadz (hanya Putra)
      {
        path: 'alumni/:gender',
        name: 'UstadzDaftarAlumni',
        component: DaftarAlumni,
        meta: { genderAccess: 'Laki-laki' }
      },
      {
        path: 'informasi-alumni/:nomor',
        name: 'UstadzInformasiAlumni',
        component: InformasiAlumni
      },
      {
        path: 'jurnal-kbm',
        name: 'UstadzJurnalKBM',
        component: JurnalKBM
      },
      {
        path: 'input-nilai',
        name: 'UstadzInputNilai',
        component: InputNilai
      },
      {
        path: 'kesehatan-santri',
        name: 'UstadzKesehatanSantri',
        component: KesehatanSantri
      },
      {
        path: 'berita-acara',
        name: 'UstadzBeritaAcara',
        component: BeritaAcara
      },
      // Rute Pembayaran SPP untuk Ustadz + Keuangan (Manajemen Putra)
      {
        path: 'pembayaran-spp',
        name: 'UstadzPembayaranSpp',
        component: PembayaranSpp,
        meta: { requiresAuth: true, requiredRoles: ['ustadz', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Log Transaksi untuk Ustadz + Keuangan
      {
        path: 'log-transaksi',
        name: 'UstadzLogTransaksi',
        component: LogTransaksi,
        meta: { requiresAuth: true, requiredRoles: ['ustadz', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Tabungan Santri untuk Ustadz + Keuangan
      {
        path: 'tabungan-santri',
        name: 'UstadzTabunganSantri',
        component: TabunganSantri,
        meta: { requiresAuth: true, requiredRoles: ['ustadz', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Manajemen SPP untuk Ustadz + Keuangan
      {
        path: 'manajemen-spp',
        name: 'UstadzManajemenSpp',
        component: ManajemenSpp,
        meta: { requiresAuth: true, requiredRoles: ['ustadz', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Laporan Keuangan untuk Ustadz + Keuangan
      {
        path: 'laporan-keuangan',
        name: 'UstadzLaporanKeuangan',
        component: LaporanKeuangan,
        meta: { requiresAuth: true, requiredRoles: ['ustadz', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Tunggakan SPP untuk Ustadz + Keuangan
      {
        path: 'tunggakan-spp',
        name: 'UstadzTunggakanSpp',
        component: TunggakanSpp,
        meta: { requiresAuth: true, requiredRoles: ['ustadz', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Data Manajemen untuk Ustadz
      {
        path: 'data-manajemen',
        name: 'UstadzDataManajemen',
        component: DataManajemen,
        meta: { requiresAuth: true, requiredRoles: ['ustadz', 'tatadata'], genderAccess: 'Laki-laki' }
      }
    ]
  },

  // Ustadzah Routes (Putri only)
  {
    path: '/ustadzah',
    component: UstadzahLayout,
    meta: { requiresAuth: true, allowedRoles: ['ustadzah'], genderAccess: 'Perempuan' },
    children: [
      {
        path: '',
        name: 'UstadzahDashboard',
        component: UstadzahDashboard
      },
      {
        path: 'data-santri/:kelas/:gender',
        name: 'UstadzahDataSantri',
        component: DataSantri
      },
      {
        path: 'informasi-santri/:nomor',
        name: 'UstadzahInformasiSantri',
        component: InformasiSantri
      },
      // Rute OKAPEMA untuk Ustadzah (hanya Putri)
      {
        path: 'alumni/:gender',
        name: 'UstadzahDaftarAlumni',
        component: DaftarAlumni,
        meta: { genderAccess: 'Perempuan' }
      },
      {
        path: 'informasi-alumni/:nomor',
        name: 'UstadzahInformasiAlumni',
        component: InformasiAlumni
      },
      {
        path: 'jurnal-kbm',
        name: 'UstadzahJurnalKBM',
        component: JurnalKBM
      },
      {
        path: 'input-nilai',
        name: 'UstadzahInputNilai',
        component: InputNilai
      },
      {
        path: 'kesehatan-santri',
        name: 'UstadzahKesehatanSantri',
        component: KesehatanSantri
      },
      {
        path: 'berita-acara',
        name: 'UstadzahBeritaAcara',
        component: BeritaAcara
      },
      // Rute Pembayaran SPP untuk Ustadzah + Keuangan (Manajemen Putri)
      {
        path: 'pembayaran-spp',
        name: 'UstadzahPembayaranSpp',
        component: PembayaranSpp,
        meta: { requiresAuth: true, requiredRoles: ['ustadzah', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Log Transaksi untuk Ustadzah + Keuangan
      {
        path: 'log-transaksi',
        name: 'UstadzahLogTransaksi',
        component: LogTransaksi,
        meta: { requiresAuth: true, requiredRoles: ['ustadzah', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Tabungan Santri untuk Ustadzah + Keuangan
      {
        path: 'tabungan-santri',
        name: 'UstadzahTabunganSantri',
        component: TabunganSantri,
        meta: { requiresAuth: true, requiredRoles: ['ustadzah', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Manajemen SPP untuk Ustadzah + Keuangan
      {
        path: 'manajemen-spp',
        name: 'UstadzahManajemenSpp',
        component: ManajemenSpp,
        meta: { requiresAuth: true, requiredRoles: ['ustadzah', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Laporan Keuangan untuk Ustadzah + Keuangan
      {
        path: 'laporan-keuangan',
        name: 'UstadzahLaporanKeuangan',
        component: LaporanKeuangan,
        meta: { requiresAuth: true, requiredRoles: ['ustadzah', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Tunggakan SPP untuk Ustadzah + Keuangan
      {
        path: 'tunggakan-spp',
        name: 'UstadzahTunggakanSpp',
        component: TunggakanSpp,
        meta: { requiresAuth: true, requiredRoles: ['ustadzah', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Data Manajemen untuk Ustadzah
      {
        path: 'data-manajemen',
        name: 'UstadzahDataManajemen',
        component: DataManajemen,
        meta: { requiresAuth: true, requiredRoles: ['ustadzah', 'tatadata'], genderAccess: 'Perempuan' }
      }
    ]
  },

  // Asistenpa Routes
  {
    path: '/asistenpa',
    component: AsistenpaLayout,
    meta: { requiresAuth: true, allowedRoles: ['asistenpa'] },
    children: [
      {
        path: '',
        name: 'AsistenpaDashboard',
        component: AsistenpaDashboard
      },
      // Rute Personal untuk Asistenpa (menggunakan komponen yang sudah ada)
      {
        path: 'akademik',
        name: 'AsistenpaAkademik',
        component: AkademikSantri
      },
      {
        path: 'kepondokan',
        name: 'AsistenpaKepondokan',
        component: KepondokanSantri
      },
      {
        path: 'administrasi',
        name: 'AsistenpaAdministrasi',
        component: AdministrasiSantri
      },
      {
        path: 'berita-acara',
        name: 'AsistenpaBeritaAcara',
        component: BeritaAcara
      },
      {
        path: 'jurnal-kbm',
        name: 'AsistenpaJurnalKBM',
        component: JurnalKBM
      },
      {
        path: 'input-nilai',
        name: 'AsistenpaInputNilai',
        component: InputNilai
      },
      // Rute Pembayaran SPP untuk Asistenpa + Keuangan (Manajemen Putra)
      {
        path: 'pembayaran-spp',
        name: 'AsistenpaPembayaranSpp',
        component: PembayaranSpp,
        meta: { requiresAuth: true, requiredRoles: ['asistenpa', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Log Transaksi untuk Asistenpa + Keuangan
      {
        path: 'log-transaksi',
        name: 'AsistenpaLogTransaksi',
        component: LogTransaksi,
        meta: { requiresAuth: true, requiredRoles: ['asistenpa', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Tabungan Santri untuk Asistenpa + Keuangan
      {
        path: 'tabungan-santri',
        name: 'AsistenpaTabunganSantri',
        component: TabunganSantri,
        meta: { requiresAuth: true, requiredRoles: ['asistenpa', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Manajemen SPP untuk Asistenpa + Keuangan
      {
        path: 'manajemen-spp',
        name: 'AsistenpaManajemenSpp',
        component: ManajemenSpp,
        meta: { requiresAuth: true, requiredRoles: ['asistenpa', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Laporan Keuangan untuk Asistenpa + Keuangan
      {
        path: 'laporan-keuangan',
        name: 'AsistenpaLaporanKeuangan',
        component: LaporanKeuangan,
        meta: { requiresAuth: true, requiredRoles: ['asistenpa', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Tunggakan SPP untuk Asistenpa + Keuangan
      {
        path: 'tunggakan-spp',
        name: 'AsistenpaTunggakanSpp',
        component: TunggakanSpp,
        meta: { requiresAuth: true, requiredRoles: ['asistenpa', 'keuangan'], genderAccess: 'Laki-laki' }
      },
      // Rute Data Manajemen untuk Asistenpa
      {
        path: 'data-manajemen',
        name: 'AsistenpaDataManajemen',
        component: DataManajemen,
        meta: { requiresAuth: true, requiredRoles: ['asistenpa', 'tatadata'], genderAccess: 'Laki-laki' }
      }
    ]
  },

  // Asistenpi Routes
  {
    path: '/asistenpi',
    component: AsistenpiLayout,
    meta: { requiresAuth: true, allowedRoles: ['asistenpi'] },
    children: [
      {
        path: '',
        name: 'AsistenpiDashboard',
        component: AsistenpiDashboard
      },
      // Rute Personal untuk Asistenpi (menggunakan komponen yang sudah ada)
      {
        path: 'akademik',
        name: 'AsistenpiAkademik',
        component: AkademikSantri
      },
      {
        path: 'kepondokan',
        name: 'AsistenpiKepondokan',
        component: KepondokanSantri
      },
      {
        path: 'administrasi',
        name: 'AsistenpiAdministrasi',
        component: AdministrasiSantri
      },
      {
        path: 'berita-acara',
        name: 'AsistenpiBeritaAcara',
        component: BeritaAcara
      },
      {
        path: 'jurnal-kbm',
        name: 'AsistenpiJurnalKBM',
        component: JurnalKBM
      },
      {
        path: 'input-nilai',
        name: 'AsistenpiInputNilai',
        component: InputNilai
      },
      // Rute Pembayaran SPP untuk Asistenpi + Keuangan (Manajemen Putri)
      {
        path: 'pembayaran-spp',
        name: 'AsistenpiPembayaranSpp',
        component: PembayaranSpp,
        meta: { requiresAuth: true, requiredRoles: ['asistenpi', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Log Transaksi untuk Asistenpi + Keuangan
      {
        path: 'log-transaksi',
        name: 'AsistenpiLogTransaksi',
        component: LogTransaksi,
        meta: { requiresAuth: true, requiredRoles: ['asistenpi', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Tabungan Santri untuk Asistenpi + Keuangan
      {
        path: 'tabungan-santri',
        name: 'AsistenpiTabunganSantri',
        component: TabunganSantri,
        meta: { requiresAuth: true, requiredRoles: ['asistenpi', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Manajemen SPP untuk Asistenpi + Keuangan
      {
        path: 'manajemen-spp',
        name: 'AsistenpiManajemenSpp',
        component: ManajemenSpp,
        meta: { requiresAuth: true, requiredRoles: ['asistenpi', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Laporan Keuangan untuk Asistenpi + Keuangan
      {
        path: 'laporan-keuangan',
        name: 'AsistenpiLaporanKeuangan',
        component: LaporanKeuangan,
        meta: { requiresAuth: true, requiredRoles: ['asistenpi', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Tunggakan SPP untuk Asistenpi + Keuangan
      {
        path: 'tunggakan-spp',
        name: 'AsistenpiTunggakanSpp',
        component: TunggakanSpp,
        meta: { requiresAuth: true, requiredRoles: ['asistenpi', 'keuangan'], genderAccess: 'Perempuan' }
      },
      // Rute Data Manajemen untuk Asistenpi
      {
        path: 'data-manajemen',
        name: 'AsistenpiDataManajemen',
        component: DataManajemen,
        meta: { requiresAuth: true, requiredRoles: ['asistenpi', 'tatadata'], genderAccess: 'Perempuan' }
      }
    ]
  },

  // Santri Routes
  {
    path: '/santri',
    component: StudentLayout,
    meta: { requiresAuth: true, allowedRoles: ['santri'] },
    children: [
      {
        path: '',
        name: 'StudentDashboard',
        component: StudentDashboard
      },
      {
        path: 'profil',
        name: 'StudentProfil',
        component: InformasiSantri
      },
      // Rute Personal untuk Santri (menggunakan komponen yang sudah ada)
      {
        path: 'akademik',
        name: 'SantriAkademik',
        component: AkademikSantri
      },
      {
        path: 'kepondokan',
        name: 'SantriKepondokan',
        component: KepondokanSantri
      },
      {
        path: 'administrasi',
        name: 'SantriAdministrasi',
        component: AdministrasiSantri
      }
    ]
  },
  // Rute Data Manajemen untuk peran 'tatadata' utama (jika ada)
  {
    path: '/datamanajemen',
    name: 'DataManajemen',
    component: DataManajemen,
    meta: { requiresAuth: true, allowedRoles: ['tatadata', 'admin', 'phpapi'] }
  },
  // Rute Pembayaran SPP untuk peran 'keuangan' utama (jika ada)
  {
    path: '/pembayaran-spp',
    name: 'PembayaranSpp',
    component: PembayaranSpp,
    meta: { requiresAuth: true, allowedRoles: ['keuangan', 'admin'] }
  },
  // Rute Log Transaksi untuk peran 'keuangan' utama (jika ada)
  {
    path: '/log-transaksi',
    name: 'LogTransaksi',
    component: LogTransaksi,
    meta: { requiresAuth: true, allowedRoles: ['keuangan', 'admin'] }
  },
  // Rute Tabungan Santri untuk peran 'keuangan' utama (jika ada)
  {
    path: '/tabungan-santri',
    name: 'TabunganSantri',
    component: TabunganSantri,
    meta: { requiresAuth: true, allowedRoles: ['keuangan', 'admin'] }
  },
  // Rute Manajemen SPP untuk peran 'keuangan' utama (jika ada)
  {
    path: '/manajemen-spp',
    name: 'ManajemenSpp',
    component: ManajemenSpp,
    meta: { requiresAuth: true, allowedRoles: ['keuangan', 'admin'] }
  },
  // Rute Laporan Keuangan untuk peran 'keuangan' utama (jika ada)
  {
    path: '/laporan-keuangan',
    name: 'LaporanKeuangan',
    component: LaporanKeuangan,
    meta: { requiresAuth: true, allowedRoles: ['keuangan', 'admin'] }
  },
  // Rute Tunggakan SPP untuk peran 'keuangan' utama (jika ada)
  {
    path: '/tunggakan-spp',
    name: 'TunggakanSpp',
    component: TunggakanSpp,
    meta: { requiresAuth: true, allowedRoles: ['keuangan', 'admin'] }
  },

  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard dengan dukungan multi-role
router.beforeEach((to, from, next) => {
  const user = store.getters.user; // Ambil user dari Vuex store
  const userRoles = store.getters.userRoles; // Ambil array roles dari Vuex store

  // Jika rute memerlukan otentikasi
  if (to.meta.requiresAuth) {
    // Jika user belum login
    if (!user || !user.username) {
      next('/'); // Redirect ke halaman login
      return;
    }

    // Periksa apakah user memiliki peran yang diizinkan untuk layout utama (allowedRoles)
    // Ini adalah pemeriksaan untuk layout level atas (misal /admin, /phpapi)
    if (to.meta.allowedRoles && !to.meta.allowedRoles.some(role => userRoles.includes(role))) {
      next('/'); // Redirect jika tidak memiliki peran yang diizinkan
      return;
    }

    // Periksa requiredRoles untuk rute spesifik (misal /admin/administrasi-manajemen)
    // Ini digunakan untuk rute yang membutuhkan kombinasi peran (misal 'ustadz' DAN 'keuangan')
    if (to.meta.requiredRoles) {
      const hasAllRequiredRoles = to.meta.requiredRoles.every(role => userRoles.includes(role));
      if (!hasAllRequiredRoles) {
        next('/'); // Redirect jika tidak memiliki semua peran yang dibutuhkan
        return;
      }
    }

    // Pemeriksaan akses gender untuk Data Santri, Alumni, dan Administrasi Manajemen
    if (to.meta.genderAccess && to.params.gender) {
      const allowedGender = to.meta.genderAccess === 'Laki-laki' ? 'pa' : 'pi';
      const requestedGender = to.params.gender;

      // Logika khusus untuk Ustadz/Ustadzah dan Asistenpa/Asistenpi dengan peran Keuangan atau Tatadata
      if (to.name.includes('PembayaranSpp') || to.name.includes('LogTransaksi') || to.name.includes('TabunganSantri') || to.name.includes('ManajemenSpp') || to.name.includes('LaporanKeuangan') || to.name.includes('TunggakanSpp') || to.name.includes('DataManajemen')) {
        // Hanya izinkan jika memiliki peran keuangan, tatadata, atau admin. PHPAPI hanya untuk DataManajemen.
        const canAccessFinancialOrDataMan = userRoles.includes('keuangan') || userRoles.includes('admin') ||
                                            (userRoles.includes('tatadata') && to.name.includes('DataManajemen')) ||
                                            (userRoles.includes('phpapi') && to.name.includes('DataManajemen'));

        if (canAccessFinancialOrDataMan) {
          if (userRoles.includes('ustadz') || userRoles.includes('asistenpa')) {
            if (requestedGender !== 'pa') {
              next('/');
              return;
            }
          } else if (userRoles.includes('ustadzah') || userRoles.includes('asistenpi')) {
            if (requestedGender !== 'pi') {
              next('/');
              return;
            }
          }
        } else {
          next('/');
          return;
        }
      } else { // Logika gender access untuk Data Santri & Alumni (seperti sebelumnya)
        if (userRoles.includes('ustadz') && requestedGender === 'pi') {
          next('/');
          return;
        }
        if (userRoles.includes('ustadzah') && requestedGender === 'pa') {
          next('/');
          return;
        }
      }
    }
  }

  next(); // Lanjutkan ke rute yang dituju
});

export default router;
