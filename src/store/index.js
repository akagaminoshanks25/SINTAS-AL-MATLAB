import { createStore } from 'vuex';
// Import Firebase SDK modules yang diperlukan dari file inisialisasi terpusat
import { db, auth, appId, authInitializedPromise } from '@/plugins/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';

const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    roles: JSON.parse(localStorage.getItem('user'))?.roles || [],
    isLoggedIn: !!localStorage.getItem('user'),
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isLoggedIn = !!user;
      state.roles = user?.roles || [];
      localStorage.setItem('user', JSON.stringify(user));
    },
    CLEAR_USER(state) {
      state.user = null;
      state.roles = [];
      state.isLoggedIn = false;
      localStorage.removeItem('user');
    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        console.log('🟡 Menunggu inisialisasi Firebase Auth awal selesai...');
        await authInitializedPromise;
        console.log('✅ Inisialisasi Firebase Auth awal selesai.');

        const uid = auth.currentUser?.uid;
        if (!uid) {
          console.error('🔴 Auth.currentUser masih null setelah inisialisasi awal. Autentikasi awal mungkin gagal.');
          throw new Error('Belum terautentikasi. Silakan coba lagi.');
        }
        console.log('✅ UID Firebase terdeteksi:', uid);


        console.log('🟡 Mencoba login dengan: ', { username, password });

        const loginRef = collection(db, `artifacts/${appId}/public/data/login`);
        console.log('📁 Path login Firestore:', loginRef.path);

        const q = query(loginRef, where('user_id', '==', username));
        const querySnapshot = await getDocs(q);
        console.log('🔎 Jumlah dokumen ditemukan:', querySnapshot.size);

        if (querySnapshot.empty) {
          throw new Error('User ID tidak ditemukan.');
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const userDocRef = doc(db, loginRef.path, userDoc.id);

        const passwordMatch =
          userData.password === password ||
          (userData.role === 'santri' && userData.password_ortu === password);

        if (!passwordMatch) {
          throw new Error('Password salah.');
        }

        if (userData.aktif !== true) {
          throw new Error('Akun Anda tidak aktif.');
        }

        await updateDoc(userDocRef, { uid });
        console.log('✅ UID dokumen login diperbarui/ditambahkan.');


        const user = {
          username: userData.user_id,
          name: userData.nama_user || userData.user_id,
          role: userData.role || (userData.roles?.[0] ?? null),
          roles: userData.roles || [],
          user_id: userData.user_id,
          firestoreDocId: userDoc.id,
        };

        commit('SET_USER', user);

        await updateDoc(userDocRef, { terakhir_login: new Date() });

        return { success: true, user };
      } catch (err) {
        console.error('🔴 Login failed:', err.message);
        return { success: false, message: err.message };
      }
    },

    async logout({ commit, state }) {
      const user = state.user;
      try {
        if (user?.firestoreDocId) {
          const userDocRef = doc(db, `artifacts/${appId}/public/data/login`, user.firestoreDocId);
          await updateDoc(userDocRef, { terakhir_logout: new Date() });
          console.log('📌 Logout time updated.');
        }
      } catch (e) {
        console.warn('Logout Firestore update failed:', e.message);
      }

      commit('CLEAR_USER');
    }
  },

  getters: {
    user(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    userRole(state) {
      return state.user?.role || null;
    },
    userRoles(state) {
      return state.roles;
    },
    userName(state) {
      return state.user?.name || state.user?.username || 'Guest';
    },
    userIdentifier(state) {
      return state.user?.user_id || null;
    },
    dashboardRoute(state) {
      if (!state.user) return '/';
      const role = state.user.role;
      switch (role) {
        case 'admin':
          return '/admin';
        case 'phpapi':
          return '/phpapi';
        case 'ustadz':
          return '/ustadz';
        case 'ustadzah':
          return '/ustadzah';
        case 'asistenpa':
          return '/asistenpa';
        case 'asistenpi':
          return '/asistenpi';
        case 'santri':
          return '/santri';
        case 'tatadata': // Tambahkan rute untuk peran 'tatadata'
          return '/datamanajemen';
        case 'keuangan': // Tambahkan rute untuk peran 'keuangan'
          return '/pembayaran-spp'; // Default ke halaman pembayaran SPP
        default:
          return '/';
      }
    },
    canAccessDataSantri(state) {
      return ['admin', 'phpapi', 'ustadz', 'ustadzah'].includes(state.user?.role);
    },
    canAccessPutra(state) {
      return ['admin', 'phpapi', 'ustadz'].includes(state.user?.role);
    },
    canAccessPutri(state) {
      return ['admin', 'phpapi', 'ustadzah'].includes(state.user?.role);
    },
    canAccessOkapema(state) {
      return ['admin', 'phpapi', 'ustadz', 'ustadzah'].includes(state.user?.role);
    },
    canAccessOkapemaPutra(state) {
      return ['admin', 'phpapi', 'ustadz'].includes(state.user?.role);
    },
    canAccessOkapemaPutri(state) {
      return ['admin', 'phpapi', 'ustadzah'].includes(state.user?.role);
    },
    canAccessMonitoring(state) {
      return ['admin', 'phpapi'].includes(state.user?.role);
    },
    canAccessInputNilai(state) {
      return ['admin', 'phpapi', 'ustadz', 'ustadzah', 'asistenpa', 'asistenpi'].includes(state.user?.role);
    },
    canAccessAdminPanel(state) {
      return state.user?.role === 'admin';
    },
    canAccessPersonalAcademic(state) {
      return ['santri', 'asistenpa', 'asistenpi'].includes(state.user?.role);
    },
    canAccessPersonalKepondokan(state) {
      return ['santri', 'asistenpa', 'asistenpi'].includes(state.user?.role);
    },
    canAccessAdministrasi(state) {
      return ['santri', 'phpapi', 'admin', 'asistenpa', 'asistenpi'].includes(state.user?.role);
    },
    hasRole: (state) => (roleName) => {
      return state.roles.includes(roleName);
    },
    // Getter untuk akses halaman Pembayaran SPP dan Log Transaksi
    canAccessPembayaranSpp(state) {
      return (
        state.roles.includes('admin') ||
        state.roles.includes('keuangan') ||
        (state.roles.includes('ustadz') && state.roles.includes('keuangan')) ||
        (state.roles.includes('ustadzah') && state.roles.includes('keuangan')) ||
        (state.roles.includes('asistenpa') && state.roles.includes('keuangan')) ||
        (state.roles.includes('asistenpi') && state.roles.includes('keuangan'))
      );
    },
    canAccessLogTransaksi(state) {
      return (
        state.roles.includes('admin') ||
        state.roles.includes('keuangan') ||
        (state.roles.includes('ustadz') && state.roles.includes('keuangan')) ||
        (state.roles.includes('ustadzah') && state.roles.includes('keuangan')) ||
        (state.roles.includes('asistenpa') && state.roles.includes('keuangan')) ||
        (state.roles.includes('asistenpi') && state.roles.includes('keuangan'))
      );
    },
    // Getter baru untuk akses halaman Tabungan Santri, Manajemen SPP, Laporan Keuangan, Tunggakan SPP
    canAccessKeuanganMenu(state) { // Getter umum untuk semua sub-menu keuangan
      return (
        state.roles.includes('admin') ||
        state.roles.includes('keuangan') ||
        (state.roles.includes('ustadz') && state.roles.includes('keuangan')) ||
        (state.roles.includes('ustadzah') && state.roles.includes('keuangan')) ||
        (state.roles.includes('asistenpa') && state.roles.includes('keuangan')) ||
        (state.roles.includes('asistenpi') && state.roles.includes('keuangan'))
      );
    },
    canEditAdministrasi(state) {
      return state.roles.includes('keuangan');
    },
    canAccessAdministrasiPutra(state) {
      const hasKeuangan = state.roles.includes('keuangan');
      const isAdminOrPhpapi = state.roles.includes('admin') || state.roles.includes('phpapi');
      const isUstadzOrAsistenpa = state.roles.includes('ustadz') || state.roles.includes('asistenpa');
      return hasKeuangan && (isAdminOrPhpapi || isUstadzOrAsistenpa);
    },
    canAccessAdministrasiPutri(state) {
      const hasKeuangan = state.roles.includes('keuangan');
      const isAdminOrPhpapi = state.roles.includes('admin') || state.roles.includes('phpapi');
      const isUstadzahOrAsistenpi = state.roles.includes('ustadzah') || state.roles.includes('asistenpi');
      return hasKeuangan && (isAdminOrPhpapi || isUstadzahOrAsistenpi);
    },
    // Getter untuk peran 'tatadata' dan 'phpapi'
    canAccessDataManajemen(state) {
      return state.roles.includes('tatadata') || state.roles.includes('admin') || state.roles.includes('phpapi'); // PHPAPI DITAMBAHKAN
    }
  }
});

export default store;
