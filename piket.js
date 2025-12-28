// 1. DATA PETUGAS & LOGIN (0=Minggu, 1=Senin, dst)
const jadwalPiket = {
    1: [ // Senin
        { user: "hafni", pass: "hafni123" },
        { user: "petugas2", pass: "piket2" },
        { user: "petugas3", pass: "piket3" },
        { user: "petugas4", pass: "piket4" },
        { user: "petugas5", pass: "piket5" }
    ],
    2: [ // Selasa
        { user: "najla", pass: "najla123" },
        { user: "userB", pass: "passB" },
        { user: "userC", pass: "passC" },
        { user: "userD", pass: "passD" },
        { user: "userE", pass: "passE" }
    ],
    3: [ // Rabu
        { user: "amel", pass: "amel123" },
        { user: "userH", pass: "passH" },
        { user: "userI", pass: "passI" },
        { user: "userJ", pass: "passJ" },
        { user: "userK", pass: "passK" }
    ],
    4: [ // Kamis
        { user: "shella", pass: "shella123" },
        { user: "userN", pass: "passN" },
        { user: "userO", pass: "passO" },
        { user: "userP", pass: "passP" },
        { user: "userQ", pass: "passQ" }
    ],
    5: [ // Jumat
        { user: "nana", pass: "nana123" },
        { user: "userT", pass: "passT" },
        { user: "userU", pass: "passU" },
        { user: "userV", pass: "passV" },
        { user: "userW", pass: "passW" }
    ],
    6: [{ user: "admin", pass: "admin123" }], // Sabtu
    0: [{ user: "admin", pass: "admin123" }]  // Minggu
};

// 2. DATABASE NOMOR WALI KELAS
const databaseWali = {
    "10-TKR": "628999810460", // Ibu Mulyana
    "10-MP":  "628999809547", // Mis Monica
    "10-TKJ": "6281234567890",
    "11-TKR": "6281234567890",
    "11-TKJ": "6281234567890",
    "11-MP":  "6281234567890",
    "12-TKR": "6281234567890",
    "12-TKJ": "6281234567890",
    "12-MP":  "6281234567890"
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
// 1. DATA PETUGAS & LOGIN (0=Minggu, 1=Senin, dst)
const jadwalPiket = {
    1: [ // Senin
        { user: "hafni", pass: "hafni123" },
        { user: "petugas2", pass: "piket2" },
        { user: "petugas3", pass: "piket3" },
        { user: "petugas4", pass: "piket4" },
        { user: "petugas5", pass: "piket5" }
    ],
    2: [ // Selasa
        { user: "najla", pass: "najla123" },
        { user: "userB", pass: "passB" },
        { user: "userC", pass: "passC" },
        { user: "userD", pass: "passD" },
        { user: "userE", pass: "passE" }
    ],
    3: [ // Rabu
        { user: "amel", pass: "amel123" },
        { user: "userH", pass: "passH" },
        { user: "userI", pass: "passI" },
        { user: "userJ", pass: "passJ" },
        { user: "userK", pass: "passK" }
    ],
    4: [ // Kamis
        { user: "shella", pass: "shella123" },
        { user: "userN", pass: "passN" },
        { user: "userO", pass: "passO" },
        { user: "userP", pass: "passP" },
        { user: "userQ", pass: "passQ" }
    ],
    5: [ // Jumat
        { user: "nana", pass: "nana123" },
        { user: "userT", pass: "passT" },
        { user: "userU", pass: "passU" },
        { user: "userV", pass: "passV" },
        { user: "userW", pass: "passW" }
    ],
    6: [{ user: "admin", pass: "admin123" }], // Sabtu
    0: [{ user: "admin", pass: "admin123" }]  // Minggu
};

// 2. DATABASE NOMOR WALI KELAS
const databaseWali = {
    "10-TKR": "628999810460", // Ibu Mulyana
    "10-MP":  "628999809547", // Mis Monica
    "10-TKJ": "6281234567890",
    "11-TKR": "6281234567890",
    "11-TKJ": "6281234567890",
    "11-MP":  "6281234567890",
    "12-TKR": "6281234567890",
    "12-TKJ": "6281234567890",
    "12-MP":  "6281234567890"
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
        
