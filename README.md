# Struktur Database Firestore untuk SINTAS

Dokumen ini menjelaskan rancangan struktur database **Firestore** yang digunakan oleh aplikasi **SINTAS**. Fokus utama adalah pada koleksi-koleksi penting serta bagaimana data disimpan dan dihubungkan di dalamnya.

---

## Koleksi Utama

### 1. `login`

* **Tujuan**: Menyimpan informasi kredensial dan peran pengguna untuk autentikasi.
* **Path**: `/artifacts/{appId}/public/data/login/{docId}`
* **Struktur Dokumen**:
    ```json
    {
      "user_id": "string",            // Username / Nomor Induk (misal: "admin", "SNT001")
      "nama_user": "string",          // Nama lengkap pengguna
      "password": "string",           // Password utama (hashed atau plain, sesuai kebijakan keamanan)
      "password_ortu": "string",      // Password khusus untuk orang tua santri (jika role santri)
      "role": "string",               // Peran utama pengguna (misal: "admin", "santri", "keuangan")
      "roles": ["string"],            // Array peran pengguna (misal: ["admin"], ["santri"], ["ustadz", "keuangan"])
      "aktif": "boolean",             // Status akun aktif/non-aktif
      "uid": "string",                // UID dari Firebase Authentication (diupdate saat login)
      "terakhir_login": "timestamp",  // Timestamp terakhir login
      "terakhir_logout": "timestamp"  // Timestamp terakhir logout
    }
    ```
* **Catatan**: `user_id` di koleksi ini akan menjadi referensi ke ID unik di koleksi `santri` atau `alumni` untuk peran yang relevan.

---

### 2. `santri`

* **Tujuan**: Menyimpan biodata dan informasi dasar setiap santri.
* **Path**: `/artifacts/{appId}/public/data/santri/{docId}`
* **Struktur Dokumen (contoh field penting)**:
    ```json
    {
      "user_id": "string",              // ID unik santri, sama dengan user_id di koleksi login
      "nama_santri": "string",
      "gender": "string",               // "Laki-laki" atau "Perempuan"
      "kelas_saat_ini": "string",       // Denormalisasi: Kelas aktif saat ini (misal: "1", "2", "7")
      "status_santri_saat_ini": "string", // Denormalisasi: Status aktif, lulus, keluar, dll.
      "tahun_masuk_pondok": "number",
      "jenjang_masuk_pondok": "string", // "MTs", "MA"
      "tanggal_lahir": "timestamp",
      "tempat_lahir": "string",
      "alamat": "string",
      "kabupaten": "string",
      "provinsi": "string",
      "nama_ayah": "string",
      "nama_ibu": "string",
      "nomor_hp_ortu": "string",
      // ... field biodata lainnya
    }
    ```
* **Catatan**: Field seperti `kelas_saat_ini` dan `status_santri_saat_ini` adalah bentuk **denormalisasi** untuk memudahkan proses filtering dan menampilkan data secara cepat tanpa perlu melakukan *join* antar koleksi.

---

### 3. `alumni`

* **Tujuan**: Menyimpan data alumni. Strukturnya mirip dengan koleksi `santri` namun disesuaikan untuk data alumni.
* **Path**: `/artifacts/{appId}/public/data/alumni/{docId}`
* **Struktur Dokumen (contoh field penting)**:
    ```json
    {
      "user_id": "string",              // ID unik alumni
      "nama_alumni": "string",
      "gender": "string",               // "Laki-laki" atau "Perempuan"
      "tahun_lulus": "number",
      "pendidikan_terakhir": "string",
      "pekerjaan_saat_ini": "string",
      "alamat_saat_ini": "string",
      // ... field data alumni lainnya
    }
    ```

---

### 4. `spp_payments` (Pembayaran SPP & Biaya Lain)

* **Tujuan**: Merekam setiap detail pembayaran keuangan yang dilakukan oleh/untuk santri, termasuk SPP bulanan dan biaya satu kali seperti "Daftar Ulang".
* **Path**: `/artifacts/{appId}/public/data/spp_payments/{paymentId}`
* **Struktur Dokumen**:
    ```json
    {
      "santri_id": "string",            // ID santri yang melakukan pembayaran (misal: SNT001)
      "jenis_biaya": "string",          // "SPP", "Daftar Ulang", "Seragam", "Buku", "Kegiatan", dll.
      "jumlah_pembayaran": "number",    // Jumlah uang yang dibayarkan
      "tanggal_pembayaran": "timestamp",// Waktu pembayaran dilakukan
      "tahun_ajaran": "string",         // Contoh: "2024/2025" (penting untuk biaya tahunan seperti Daftar Ulang)
      "bulan_spp": "string / null",     // Contoh: "Juli", "Agustus" (null jika `jenis_biaya` bukan "SPP")
      "status_pembayaran": "string",    // "Lunas", "Belum Lunas", "Cicilan" (opsional, jika ada skema cicilan)
      "dicatat_oleh_uid": "string",     // UID pengguna yang melakukan input
      "dicatat_oleh_nama": "string",    // Nama pengguna yang melakukan input (denormalisasi)
      "dicatat_oleh_role": "string",    // Peran pengguna saat itu (denormalisasi)
      "catatan_tambahan": "string (opsional)" // Catatan jika ada
    }
    ```
* **Penanganan "Daftar Ulang"**: Jika `jenis_biaya` adalah "Daftar Ulang", field `bulan_spp` akan diisi `null`. Aplikasi akan memastikan hanya ada satu pembayaran "Daftar Ulang" berstatus "Lunas" per `santri_id` dan `tahun_ajaran`.

---

### 5. `transaksi_logs` (Jurnal Audit)

* **Tujuan**: Menyimpan jurnal audit untuk semua aksi keuangan penting yang terjadi dalam sistem, termasuk pencatatan pembayaran.
* **Path**: `/artifacts/{appId}/public/data/transaksi_logs/{logId}`
* **Struktur Dokumen**:
    ```json
    {
      "timestamp": "timestamp",         // Waktu aksi audit terjadi
      "dicatat_oleh_uid": "string",     // UID pengguna yang melakukan aksi
      "dicatat_oleh_role": "string",    // Peran pengguna saat itu
      "jenis_aksi": "string",           // Contoh: "Pembayaran SPP", "Pembayaran Daftar Ulang", "Setoran Tabungan", "Penarikan Tabungan", "Update Tarif SPP", "Update Data Santri Keuangan"
      "user_id_santri": "string / null",// ID santri yang terkait dengan transaksi (null jika aksi tidak spesifik santri)
      "id_transaksi_terkait": "string", // ID dokumen dari koleksi `spp_payments` atau `tabungan_transactions` yang terkait.
      "detail_perubahan": "map",        // Objek yang mencatat detail relevan dari aksi (misal: {"jenis_biaya": "Daftar Ulang", "jumlah": 500000, "tahun_ajaran": "2024/2025"})
      "catatan": "string (opsional)"
    }
    ```
* **Hubungan**: Setiap kali dokumen baru ditambahkan ke koleksi transaksi keuangan (misalnya `spp_payments` atau `tabungan_transactions`), sebuah entri baru akan otomatis dibuat di `transaksi_logs` yang merujuk kembali ke ID dokumen transaksi tersebut melalui `id_transaksi_terkait`.

---

### 6. `tabungan_transactions` (Transaksi Tabungan)

* **Tujuan**: Menyimpan detail setiap setoran atau penarikan tabungan santri.
* **Path**: `/artifacts/{appId}/public/data/tabungan_transactions/{transactionId}`
* **Struktur Dokumen**:
    ```json
    {
      "santri_id": "string",            // ID santri yang terkait
      "jenis_transaksi": "string",      // "Setoran", "Penarikan"
      "jumlah": "number",
      "tanggal_transaksi": "timestamp",
      "saldo_setelah_transaksi": "number",// Denormalisasi: Saldo santri setelah transaksi ini
      "dicatat_oleh_uid": "string",
      "dicatat_oleh_nama": "string",
      "dicatat_oleh_role": "string",
      "catatan": "string (opsional)"
    }
    ```
* **Catatan**: Mirip dengan `spp_payments`, setiap transaksi di koleksi ini juga akan memicu entri di `transaksi_logs`.

---

### 7. `spp_tariffs` (Tarif SPP)

* **Tujuan**: Menyimpan tarif SPP per kelas per tahun ajaran.
* **Path**: `/artifacts/{appId}/public/data/spp_tariffs/{tariffId}`
* **Struktur Dokumen**:
    ```json
    {
      "kelas": "string",                // "1", "2", ..., "7"
      "tahun_ajaran": "string",         // "2024/2025"
      "jumlah_spp_bulanan": "number",
      "jumlah_daftar_ulang": "number",  // Jika daftar ulang juga dikelola di sini
      "aktif": "boolean",               // Apakah tarif ini aktif
      "terakhir_diubah": "timestamp",
      "diubah_oleh_uid": "string"
    }
    ```

---

### 8. `user_profiles` (Profil Pengguna Non-Santri)

* **Tujuan**: Menyimpan detail profil untuk pengguna non-santri (misalnya admin, ustadz, keuangan, staf tata data, dll.).
* **Path**: `/artifacts/{appId}/public/data/user_profiles/{userId}`
* **Struktur Dokumen (contoh)**:
    ```json
    {
      "user_id": "string",            // Sama dengan user_id di koleksi login
      "nama_lengkap": "string",
      "jabatan": "string",
      "jenis_kelamin": "string",
      "nomor_telepon": "string",
      "email": "string",
      // ... field profil lainnya
    }
    ```
* **Catatan**: Koleksi ini terpisah dari koleksi `login` untuk memungkinkan penyimpanan data profil yang lebih kaya tanpa bercampur dengan informasi kredensial.

---

## Contoh Koleksi Lainnya

Selain koleksi utama di atas, SINTAS juga dapat memiliki koleksi lain yang relevan untuk mendukung berbagai fitur, seperti:

* **`jurnal_kbm`**: Menyimpan entri jurnal kegiatan belajar mengajar.
* **`presensi_santri`**: Menyimpan data presensi harian santri.
* **`kesehatan_santri`**: Menyimpan riwayat kesehatan santri.
* **`berita_acara_kejadian`**: Menyimpan detail insiden atau berita acara lainnya.
* **`nilai_mapel`**: Menyimpan nilai mata pelajaran santri.
* **`nilai_sikap`**: Menyimpan nilai sikap santri.

Setiap koleksi ini akan memiliki struktur dokumennya sendiri yang relevan dengan data yang disimpannya. Beberapa di antaranya juga mungkin akan memicu entri di `transaksi_logs` jika ada perubahan data yang signifikan atau memerlukan audit.