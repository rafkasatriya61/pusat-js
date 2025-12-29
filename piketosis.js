// 1. DATA PETUGAS & LOGIN (0=Minggu, 1=Senin, dst)
const jadwalPiket = {
    1: [ // Senin
        { user: "hafni", pass: "afni si imut" },
        { user: "rafka", pass: "cantikku afni" },
        { user: "bintang", pass: "211110" },
        { user: "petugas4", pass: "piket4" },
        { user: "petugas5", pass: "piket5" }
    ],
    2: [ // Selasa
        { user: "iis kholisoh", pass: "iskhls" },
        { user: "userB", pass: "passB" },
        { user: "userC", pass: "passC" },
        { user: "userD", pass: "passD" },
        { user: "userE", pass: "passE" }
    ],
    3: [ // Rabu
        { user: "dina", pass: "si geulis" },
        { user: "-", pass: "-" },
        { user: "userI", pass: "passI" },
        { user: "userJ", pass: "passJ" },
        { user: "hariri", pass: "hariri12345" }
    ],
    4: [ // Kamis
        { user: "mahardika", pass: "adalah pokoknya" },
        { user: "risydah", pass: "risda 378" },
        { user: "ayu", pass: "220709" },
        { user: "kiky", pass: "kynvm" },
        { user: "userQ", pass: "passQ" }
    ],
    5: [ // Jumat
        { user: "amel", pass: "prikitiw" },
        { user: "userT", pass: "passT" },
        { user: "userU", pass: "passU" },
        { user: "userV", pass: "passV" },
        { user: "userW", pass: "passW" }
    ],
    6: [{ user: "admin", pass: "adminsabtu" }], // Sabtu
    0: [{ user: "admin", pass: "adminminggu"}]  // Minggu
};

// 2. DATABASE NOMOR WALI KELAS
const databaseWali = {
    "10-TKR": "-", // Ibu Mulyana
    "10-MP":  "-", // Mis Monica
    "10-TKJ": "-",
    "11-TKR": "-",
    "11-TKJ": "-",
    "11-MP":  "-",
    "12-TKR": "-",
    "12-TKJ": "-",
    "12-MP":  "-"
};

const loginForm = document.getElementById('login-form');
const reportForm = document.getElementById('report-form');

// 3. LOGIKA LOGIN
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputUser = document.getElementById('username').value.toLowerCase();
    const inputPass = document.getElementById('password').value;
    
    const hariIni = new Date().getDay(); 
    const daftarPetugas = jadwalPiket[hariIni];

    const userValid = daftarPetugas.find(p => p.user === inputUser && p.pass === inputPass);

    if (userValid) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('report-page').style.display = 'block';
    } else {
        alert("Login Gagal! Username tidak sesuai jadwal hari ini atau password salah.");
    }
});

// 4. FUNGSI KIRIM DATA KE GOOGLE SHEETS
reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ambil data dasar
    const namaSiswa = document.getElementById('nama').value;
    const kelasSiswa = document.querySelector('input[name="kelas"]:checked').value;
    const jurusanSiswa = document.querySelector('input[name="jurusan"]:checked').value;
    const petugasPiket = document.getElementById('username').value;

    // Ambil data pelanggaran (checkbox)
    let daftarPelanggaran = [];
    document.querySelectorAll('input[name="pelanggaran"]:checked').forEach((item) => {
        daftarPelanggaran.push(item.value);
    });
    
    const pelanggaranLain = document.getElementById('pelanggaran-lain').value;
    if (pelanggaranLain) {
        daftarPelanggaran.push(pelanggaranLain);
    }

    if (daftarPelanggaran.length === 0) {
        alert("Pilih minimal satu jenis pelanggaran!");
        return;
    }

    // Tentukan nomor Wali Kelas
    const kunciTujuan = `${kelasSiswa}-${jurusanSiswa}`;
    const nomorWali = databaseWali[kunciTujuan] || "6281234567890";

    // Siapkan Payload (Data untuk dikirim ke Apps Script)
    const payload = {
        siswa: namaSiswa,
        kelas: kelasSiswa,
        jurusan: jurusanSiswa,
        pelanggaran: daftarPelanggaran.join(', '),
        petugas: petugasPiket,
        nomorWali: nomorWali
    };

    // Animasi Loading Tombol
    const btnSubmit = e.target.querySelector('button[type="submit"]');
    const originalText = btnSubmit.innerText;
    btnSubmit.innerText = "⏳ Sedang Mengirim...";
    btnSubmit.disabled = true;

    try {
        // LINK WEB APP KAMU
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz2RMoHkS85ABrcTRRCcOfLnHVvnpxMAyLQpVeyHk4F1YgFIPFpzEB_4cIHfhVgXBuc/exec';

        await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        alert(`✅ Laporan untuk ${namaSiswa} berhasil disimpan ke Google Sheets!`);
        
        // Reset form & hapus centang checkbox setelah sukses
        reportForm.reset();
    } catch (error) {
        console.error('Error!', error.message);
        alert("❌ Gagal mengirim data. Pastikan koneksi internet stabil.");
    } finally {
        btnSubmit.innerText = originalText;
        btnSubmit.disabled = false;
    }
});

