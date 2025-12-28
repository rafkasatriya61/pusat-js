// Data User berdasarkan Hari (1=Senin, 2=Selasa, dst)
const dataPiket = {
    1: { user: "hafni", pass: "senin123" },
    2: { user: "najla", pass: "selasa123" },
    3: { user: "amel",  pass: "rabu123" },
    4: { user: "shella", pass: "kamis123" },
    5: { user: "nana",   pass: "jumat123" }
};

const loginForm = document.getElementById('login-form');
const reportForm = document.getElementById('report-form');

// Fungsi Cek Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    const hariIni = new Date().getDay(); // Mendapatkan angka hari (0-6)
    const petugas = dataPiket[hariIni];

    if (petugas && user === petugas.user && pass === petugas.pass) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('report-page').style.display = 'block';
    } else {
        alert("Maaf, login gagal! Pastikan Username benar dan sesuai dengan jadwal hari ini.");
    }
});

// Fungsi Kirim ke WhatsApp
reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const noWhatsApp = "628999809547"; // GANTI DENGAN NOMOR WHATSAPP KAMU (Awali dengan 62)
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
                  `_Dikirim otomatis via Sistem Laporan_`;

    const urlWA = `https://api.whatsapp.com/send?phone=${noWhatsApp}&text=${pesan}`;
    
    window.open(urlWA, '_blank');
});
