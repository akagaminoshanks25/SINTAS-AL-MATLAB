Rangkuman Struktur Database Firestore SINTAS
Dokumen ini merangkum rancangan struktur database Firestore untuk aplikasi SINTAS, dengan fokus pada koleksi-koleksi utama dan bagaimana data akan disimpan dan dihubungkan.
1. Koleksi login
Path: /artifacts/{appId}/public/data/login/{docId}
Tujuan: Menyimpan informasi kredensial dan peran pengguna untuk autentikasi.
ID Dokumen: {docId} (ID unik yang digenerate Firestore)
Struktur Dokumen:
{
  "user_id": "string",          // Username / Nomor Induk (misal: "admin", "SNT001")
  "nama_user": "string",        // Nama lengkap pengguna
  "password": "string",         // Password utama (hashed atau plain, sesuai kebijakan keamanan)
  "password_ortu": "string",    // Password khusus untuk orang tua santri (jika role santri)
  "role": "string",             // Peran utama pengguna (misal: "admin", "santri", "keuangan")
  "roles": ["string"],          // Array peran pengguna (misal: ["admin"], ["santri"], ["ustadz", "keuangan"])
  "aktif": "boolean",           // Status akun aktif/non-aktif
  "uid": "string",              // UID dari Firebase Authentication (diupdate saat login)
  "terakhir_login": "timestamp", // Timestamp terakhir login
  "terakhir_logout": "timestamp" // Timestamp terakhir logout
}


Catatan: user_id di sini akan menjadi referensi ke nomor atau nomor_induk di koleksi santri atau alumni untuk peran yang relevan.
2. Koleksi santri
Path: /artifacts/{appId}/public/data/santri/{docId}
Tujuan: Menyimpan data biodata dan informasi dasar setiap santri.
ID Dokumen: {docId} (ID unik yang digenerate Firestore)
Struktur Dokumen (contoh field penting):
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


Catatan: Field kelas_saat_ini dan status_santri_saat_ini adalah denormalisasi untuk memudahkan filtering dan tampilan cepat di daftar santri tanpa perlu join data.
3. Koleksi alumni
Path: /artifacts/{appId}/public/data/alumni/{docId}
Tujuan: Menyimpan data alumni. Struktur mirip dengan santri namun dengan penyesuaian untuk data alumni.
ID Dokumen: {docId} (ID unik yang digenerate Firestore)
Struktur Dokumen (contoh field penting):
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


4. Koleksi spp_payments (Pembayaran SPP & Biaya Lain)
Path: /artifacts/{appId}/public/data/spp_payments/{paymentId}
Tujuan: Menyimpan detail setiap pembayaran keuangan yang dilakukan oleh/untuk santri, termasuk SPP bulanan dan biaya satu kali seperti "daftar ulang".
ID Dokumen: {paymentId} (ID unik yang digenerate Firestore)
Struktur Dokumen:
{
  "santri_id": "string",             // ID santri yang melakukan pembayaran (misal: SNT001)
  "jenis_biaya": "string",           // "SPP", "Daftar Ulang", "Seragam", "Buku", "Kegiatan", dll.
  "jumlah_pembayaran": "number",     // Jumlah uang yang dibayarkan
  "tanggal_pembayaran": "timestamp", // Waktu pembayaran dilakukan
  "tahun_ajaran": "string",          // Contoh: "2024/2025" (penting untuk biaya tahunan seperti Daftar Ulang)
  "bulan_spp": "string / null",      // Contoh: "Juli", "Agustus" (null jika `jenis_biaya` bukan "SPP")
  "status_pembayaran": "string",     // "Lunas", "Belum Lunas", "Cicilan" (opsional, jika ada skema cicilan)
  "dicatat_oleh_uid": "string",      // UID pengguna yang melakukan input
  "dicatat_oleh_nama": "string",     // Nama pengguna yang melakukan input (denormalisasi)
  "dicatat_oleh_role": "string",     // Peran pengguna saat itu (denormalisasi)
  "catatan_tambahan": "string (opsional)" // Catatan jika ada
}


Penanganan "Daftar Ulang":
Ketika jenis_biaya adalah "Daftar Ulang", field bulan_spp akan diisi null.
Validasi di aplikasi akan memastikan hanya ada satu pembayaran "Daftar Ulang" berstatus "Lunas" per santri_id dan tahun_ajaran.
5. Koleksi transaksi_logs (Jurnal Audit)
Path: /artifacts/{appId}/public/data/transaksi_logs/{logId}
Tujuan: Jurnal audit untuk semua aksi keuangan penting yang dilakukan dalam sistem, termasuk pencatatan pembayaran.
ID Dokumen: {logId} (ID unik yang digenerate Firestore)
Struktur Dokumen:
{
  "timestamp": "timestamp",          // Waktu aksi audit terjadi
  "dicatat_oleh_uid": "string",      // UID pengguna yang melakukan aksi
  "dicatat_oleh_role": "string",     // Peran pengguna saat itu
  "jenis_aksi": "string",            // Contoh: "Pembayaran SPP", "Pembayaran Daftar Ulang", "Setoran Tabungan", "Penarikan Tabungan", "Update Tarif SPP", "Update Data Santri Keuangan"
  "user_id_santri": "string / null", // ID santri yang terkait dengan transaksi (null jika aksi tidak spesifik santri)
  "id_transaksi_terkait": "string",  // ID dokumen dari koleksi `spp_payments` atau `tabungan_transactions` yang terkait.
  "detail_perubahan": "map",         // Objek yang mencatat detail relevan dari aksi (misal: {"jenis_biaya": "Daftar Ulang", "jumlah": 500000, "tahun_ajaran": "2024/2025"})
  "catatan": "string (opsional)"
}


Hubungan: Setiap kali dokumen baru ditambahkan ke spp_payments (atau koleksi transaksi keuangan lainnya seperti tabungan_transactions), sebuah entri baru akan dibuat di transaksi_logs dengan id_transaksi_terkait yang merujuk ke ID dokumen di spp_payments tersebut.
6. Koleksi tabungan_transactions (Transaksi Tabungan)
Path: /artifacts/{appId}/public/data/tabungan_transactions/{transactionId}
Tujuan: Menyimpan detail setiap setoran atau penarikan tabungan santri.
ID Dokumen: {transactionId} (ID unik yang digenerate Firestore)
Struktur Dokumen:
{
  "santri_id": "string",             // ID santri yang terkait
  "jenis_transaksi": "string",       // "Setoran", "Penarikan"
  "jumlah": "number",
  "tanggal_transaksi": "timestamp",
  "saldo_setelah_transaksi": "number", // Denormalisasi: Saldo santri setelah transaksi ini
  "dicatat_oleh_uid": "string",
  "dicatat_oleh_nama": "string",
  "dicatat_oleh_role": "string",
  "catatan": "string (opsional)"
}


Catatan: Setiap transaksi di sini juga akan memicu entri di transaksi_logs.
7. Koleksi spp_tariffs (Tarif SPP)
Path: /artifacts/{appId}/public/data/spp_tariffs/{tariffId}
Tujuan: Menyimpan tarif SPP per kelas per tahun ajaran.
ID Dokumen: {tariffId} (ID unik yang digenerate Firestore, bisa juga kelas_tahunajaran misal kelas1_2024-2025)
Struktur Dokumen:
{
  "kelas": "string",         // "1", "2", ..., "7"
  "tahun_ajaran": "string",  // "2024/2025"
  "jumlah_spp_bulanan": "number",
  "jumlah_daftar_ulang": "number", // Jika daftar ulang juga dikelola di sini
  "aktif": "boolean",        // Apakah tarif ini aktif
  "terakhir_diubah": "timestamp",
  "diubah_oleh_uid": "string"
}


8. Koleksi user_profiles (Profil Pengguna Non-Santri)
Path: /artifacts/{appId}/public/data/user_profiles/{userId}
Tujuan: Menyimpan detail profil untuk pengguna non-santri (admin, phpapi, ustadz, keuangan, tatadata, dll.).
ID Dokumen: {userId} (ID unik yang digenerate Firestore, bisa sama dengan user_id di koleksi login)
Struktur Dokumen (contoh):
{
  "user_id": "string",          // Sama dengan user_id di koleksi login
  "nama_lengkap": "string",
  "jabatan": "string",
  "jenis_kelamin": "string",
  "nomor_telepon": "string",
  "email": "string",
  // ... field profil lainnya
}


Catatan: Ini terpisah dari koleksi login agar data profil lebih kaya dan tidak tercampur dengan kredensial.
9. Koleksi Lainnya (Contoh)
jurnal_kbm: Menyimpan entri jurnal kegiatan belajar mengajar.
presensi_santri: Menyimpan data presensi harian santri.
kesehatan_santri: Menyimpan riwayat kesehatan santri.
berita_acara_kejadian: Menyimpan detail insiden atau berita acara lainnya.
nilai_mapel: Menyimpan nilai mata pelajaran santri.
nilai_sikap: Menyimpan nilai sikap santri.
Setiap koleksi ini akan memiliki struktur dokumennya sendiri yang relevan dengan data yang disimpannya, dan mungkin juga akan memicu entri di transaksi_logs jika ada perubahan data yang signifikan atau memerlukan audit.
