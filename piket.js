// Struktur Data: 0=Minggu, 1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat, 6=Sabtu
const jadwalPiket = {
    // SENIN
    1: [
        { user: "hafni", pass: "hafni123" },
        { user: "petugas2", pass: "pass2" },
        { user: "petugas3", pass: "pass3" },
        { user: "petugas4", pass: "pass4" },
        { user: "petugas5", pass: "pass5" }
    ],
    // SELASA
    2: [
        { user: "najla", pass: "najla123" },
        { user: "userB", pass: "passB" },
        { user: "userC", pass: "passC" },
        { user: "userD", pass: "passD" },
        { user: "userE", pass: "passE" }
    ],
    // RABU
    3: [
        { user: "amel", pass: "amel123" },
        { user: "userH", pass: "passH" },
        { user: "userI", pass: "passI" },
        { user: "userJ", pass: "passJ" },
        { user: "userK", pass: "passK" }
    ],
    // KAMIS
    4: [
        { user: "shella", pass: "shella123" },
        { user: "userN", pass: "passN" },
        { user: "userO", pass: "passO" },
        { user: "userP", pass: "passP" },
        { user: "userQ", pass: "passQ" }
    ],
    // JUMAT
    5: [
        { user: "nana", pass: "nana123" },
        { user: "userT", pass: "passT" },
        { user: "userU", pass: "passU" },
        { user: "userV", pass: "passV" },
        { user: "userW", pass: "passW" }
    ],
    // SABTU (Admin Only)
    6: [
        { user: "admin", pass: "admin123" }
    ],
    // MINGGU (Admin Only)
    0: [
        { user: "admin", pass: "admin123" }
    ]
};

// Database Wali Kelas (Key: Kelas-Jurusan)
const databaseWali = {
    "10-TKR": "628999810460", // Ibu Mulyana
    "10-MP":  "628999809547", // Mis Monica
    "10-TKJ": "628123456789", // Contoh lainnya
    "11-TKR": "628123456789",
    "11-TKJ": "628123456789",
    "11-MP":  "628123456789",
    "12-TKR": "628123456789",
    "12-TKJ": "628123456789",
    "12-MP":  "628123456789"
};

reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Ambil Data Form
    const namaSiswa = document.getElementById('nama').value;
    const kelasSiswa = document.querySelector('input[name="kelas"]:checked').value;
    const jurusanSiswa = document.querySelector('input[name="jurusan"]:checked').value;
    const petugasPiket = document.getElementById('username').value; // Ambil username yang sedang login

    // 2. Ambil Pelanggaran (Checkbox)
    let daftarPelanggaran = [];
    document.querySelectorAll('input[name="pelanggaran"]:checked').forEach((item) => {
        daftarPelanggaran.push(item.value);
    });
    const pelanggaranLain = document.getElementById('pelanggaran-lain').value;
    if (pelanggaranLain) daftarPelanggaran.push(pelanggaranLain);

    if (daftarPelanggaran.length === 0) {
        alert("Pilih minimal satu jenis pelanggaran!");
        return;
    }

    // 3. Tentukan Tujuan (Wali Kelas)
    const kunciTujuan = `${kelasSiswa}-${jurusanSiswa}`;
    const nomorWali = databaseWali[kunciTujuan];

    if (!nomorWali) {
        alert("Data nomor Wali Kelas belum terdaftar di sistem!");
        return;
    }

    // 4. Susun Pesan untuk Bot
    // Format: .lapor [NomorWali]|[IsiPesan]
    const formatPesan = `*LAPORAN PIKET SISWA*%0A` +
                      `--------------------------%0A` +
                      `👤 *Nama:* ${namaSiswa}%0A` +
                      `🏢 *Kelas:* ${kelasSiswa} ${jurusanSiswa}%0A` +
                      `⚠️ *Pelanggaran:*%0A- ${daftarPelanggaran.join('%0A- ')}%0A` +
                      `--------------------------%0A` +
                      `👮 *Petugas:* ${petugasPiket}%0A` +
                      `_Mohon untuk ditindaklanjuti._`;

    const nomorBot = "628XXXXXXXXXX"; // ISI DENGAN NOMOR WHATSAPP BOT KAMU
    
    // Gunakan perintah pemicu untuk Bot kamu
    const urlWA = `https://api.whatsapp.com/send?phone=${nomorBot}&text=.lapor ${nomorWali}|${formatPesan}`;

    // 5. Eksekusi Kirim (Buka Tab Baru)
    window.open(urlWA, '_blank');

    // 6. Reset Form agar Hafni bisa input siswa lain tanpa login ulang
    reportForm.reset();
    alert("Laporan untuk " + namaSiswa + " telah diteruskan ke Bot!");
});

