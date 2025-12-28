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

const loginForm = document.getElementById('login-form');
const reportForm = document.getElementById('report-form');

// Logika Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputUser = document.getElementById('username').value.toLowerCase();
    const inputPass = document.getElementById('password').value;
    
    const hariIni = new Date().getDay(); 
    const daftarPetugas = jadwalPiket[hariIni];

    // Cari apakah ada username dan password yang cocok di dalam daftar hari ini
    const userValid = daftarPetugas.find(p => p.user === inputUser && p.pass === inputPass);

    if (userValid) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('report-page').style.display = 'block';
    } else {
        alert("Login Gagal! Akun tidak terdaftar untuk hari ini atau password salah.");
    }
});

// Fungsi Kirim ke WhatsApp
reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Ganti dengan nomor WhatsApp kamu (awali dengan 62)
    const noWhatsApp = "628999809547"; 
    
    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const jurusan = document.getElementById('jurusan').value;
    const pelanggaran = document.getElementById('pelanggaran').value;

    const pesan = `*LAPORAN PIKET BARU*%0A` +
                  `--------------------------%0A` +
                  `👤 *Nama:* ${nama}%0A` +
                  `🏢 *Kelas:* ${kelas}%0A` +
                  `📚 *Jurusan:* ${jurusan}%0A` +
                  `⚠️ *Pelanggaran:* ${pelanggaran}%0A` +
                  `--------------------------%0A` +
                  `_Dikirim via Sistem Web Laporan_`;

    const urlWA = `https://api.whatsapp.com/send?phone=${noWhatsApp}&text=${pesan}`;
    window.open(urlWA, '_blank');
});
            
