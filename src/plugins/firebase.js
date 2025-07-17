// src/plugins/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';

// KONFIGURASI FIREBASE ANDA
// ========================================================================================================
// Jika Anda menjalankan aplikasi INI SECARA LOKAL (BUKAN DI LINGKUNGAN CANVAS):
// Anda HARUS MENGGANTI SELURUH BLOK 'firebaseConfig' DI BAWAH INI
// dengan objek konfigurasi yang PERSIS SAMA yang Anda SALIN DARI FIREBASE CONSOLE Anda.
//
// Cara mendapatkan konfigurasi dari Firebase Console:
// 1. Buka Firebase Console (console.firebase.google.com)
// 2. Pilih proyek Anda (SINTAS).
// 3. Klik ikon roda gigi (Project settings) di samping "Project overview".
// 4. Gulir ke bawah ke bagian "Your apps".
// 5. Klik pada aplikasi web Anda (ikon </>).
// 6. Di bawah "Firebase SDK snippet", pilih "Config".
// 7. SALIN SELURUH OBJEK JAVASCRIPT YANG TERLIHAT DI SANA.
//    Contoh:
//    const firebaseConfig = {
//      apiKey: "AIzaSyC...",
//      authDomain: "your-project-id.firebaseapp.com",
//      projectId: "your-project-id",
//      storageBucket: "your-project-id.appspot.com",
//      messagingSenderId: "...",
//      appId: "1:..."
//    };
//
// Tempelkan SELURUH OBJEK TERSEBUT di bawah ini.
// ========================================================================================================
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "AIzaSyCU_WKOndBeEReYbcal-Vb6Y9oEyMvtmVA",
  authDomain: "sintas-app.firebaseapp.com",
  projectId: "sintas-app",
  storageBucket: "sintas-app.firebasestorage.app",
  messagingSenderId: "288908193897",
  appId: "1:288908193897:web:2e204b48c25d0e053ff2f8",
  measurementId: "G-RD30SSRBHM" // Menambahkan measurementId
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Dapatkan instance layanan Firebase
const db = getFirestore(app);
const auth = getAuth(app);

// Global variable untuk mendapatkan app ID dari Canvas environment
// PERUBAHAN DI SINI: Menggunakan 'sintas-app' sebagai fallback default
const appId = typeof __app_id !== 'undefined' ? __app_id : 'sintas-app';

// Promise yang akan resolve ketika inisialisasi autentikasi awal selesai
let authInitializedPromise;

if (typeof __initial_auth_token !== 'undefined') {
  console.log('🟡 plugins/firebase.js: Mencoba signInWithCustomToken...');
  authInitializedPromise = signInWithCustomToken(auth, __initial_auth_token)
    .then((userCredential) => {
      console.log("✅ plugins/firebase.js: Firebase authenticated with custom token. UID:", userCredential.user.uid);
      return userCredential.user; // Mengembalikan user object
    })
    .catch((error) => {
      console.error("🔴 plugins/firebase.js: Error signInWithCustomToken, mencoba anonymous. Error:", error.code, error.message);
      // Fallback ke anonymous sign-in jika custom token gagal
      return signInAnonymously(auth)
        .then((userCredential) => {
          console.log("✅ plugins/firebase.js: Firebase authenticated anonymously. UID:", userCredential.user.uid);
          return userCredential.user;
        })
        .catch((anonError) => {
          console.error("🔴 plugins/firebase.js: Error signInAnonymously. Autentikasi awal gagal total. Error:", anonError.code, anonError.message);
          return null; // Mengembalikan null jika anonymous sign-in juga gagal
        });
    });
} else {
  console.log('🟡 plugins/firebase.js: __initial_auth_token tidak ada, mencoba signInAnonymously...');
  authInitializedPromise = signInAnonymously(auth)
    .then((userCredential) => {
      console.log("✅ plugins/firebase.js: Firebase authenticated anonymously. UID:", userCredential.user.uid);
      return userCredential.user;
    })
    .catch((anonError) => {
      console.error("🔴 plugins/firebase.js: Error signInAnonymously. Autentikasi awal gagal total. Error:", anonError.code, anonError.message);
      return null; // Mengembalikan null jika anonymous sign-in gagal
    });
}

// Ekspor instance Firebase dan Promise authInitializedPromise
export { app, db, auth, appId, authInitializedPromise };
