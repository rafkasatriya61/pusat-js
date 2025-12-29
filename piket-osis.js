// 1. DATA PETUGAS & LOGIN (0=Minggu, 1=Senin, dst)
const jadwalPiket = {
    1: [ // Senin
        { user: "hafni", pass: "afni si imut" },
        { user: "rafka", pass: "cantikku afni" },
        { user: "bintang", pass: "211110" },
        { user: "niyya", pass: "husniyyah01" },
        { user: "siti khoirun nisa", pass: "nisa1210" },
        { user: "shella", pass:"123"}
    ],
    2: [ // Selasa
        { user: "iis kholisoh", pass: "iskhls" },
        { user: "aqlima", pass: "aqlima.ai0214" },
        { user: "daffa", pass: "322751" },
        { user: "sri mulyati", pass: "piket th" },
        { user: "userE", pass: "passE" }
    ],
    3: [ // Rabu
        { user: "dina", pass: "si geulis" },
        { user: "yenigeulis140610", pass: "yenigeulis140610" },
        { user: "najla", pass: "enggalupa" },
        { user: "arya", pass: "dragoknighthunterz" },
        { user: "hariri", pass: "hariri12345" }
    ],
    4: [ // Kamis
        { user: "mahardika", pass: "adalah pokoknya" },
        { user: "risydah", pass: "risda 378" },
        { user: "ayu", pass: "220709" },
        { user: "kiky", pass: "kynvm" },
        { user: "afriza", pass: "kepoo nihh" }
    ],
    5: [ // Jumat
        { user: "amel", pass: "prikitiw" },
        { user: "missdini", pass: "rayymiss02" },
        { user: "userU", pass: "passU" },
        { user: "userV", pass: "passV" },
        { user: "userW", pass: "passW" }
    ],
    6: [{ user: "admin", pass: "adminsabtu" }], // Sabtu
    0: [{ user: "admin", pass: "adminminggu"}]  // Minggu
};

// --- 2. DATABASE NOMOR WALI KELAS ---
const databaseWali = {
    "10-TKR": "628xxx", 
    "10-MP":  "628xxx", 
    "10-TKJ": "628xxx",
    "11-TKR": "628xxx",
    "11-TKJ": "628xxx",
    "11-MP":  "628xxx",
    "12-TKR": "628xxx",
    "12-TKJ": "628xxx",
    "12-MP":  "628xxx"
};

// Nomor Bot WA Kamu
const nomorBotWA = "628999810354"; 
const nomorAdmin = "628999809547"

// --- 3. FUNGSI NOTIFIKASI POPUP ---
function showNotification(success, message) {
    const notif = document.getElementById('notification');
    const msg = document.getElementById('notif-message');
    const icon = document.getElementById('notif-icon');
    const waErrorBtn = document.getElementById('wa-error-btn');

    notif.style.background = success ? "#25D366" : "#ff4444";
    icon.textContent = success ? "✅" : "❌";
    msg.textContent = message;
    
    notif.classList.add('show');
    
    // Munculkan tombol lapor WA jika pengiriman ke Sheets gagal
    if (!success && message.includes("Gagal")) {
        if(waErrorBtn) waErrorBtn.style.display = "block";
    } else {
        if(waErrorBtn) waErrorBtn.style.display = "none";
    }

    setTimeout(() => { notif.classList.remove('show'); }, 4000);
}

// --- 4. FITUR MATA PASSWORD ---
const eyeIcon = document.getElementById('eye-icon');
const passwordInput = document.getElementById('password');

if (eyeIcon) {
    eyeIcon.addEventListener('click', () => {
        const isPass = passwordInput.type === 'password';
        passwordInput.type = isPass ? 'text' : 'password';
        eyeIcon.textContent = isPass ? '🙈' : '👁️';
    });
}

// --- 5. FUNGSI LUPA PASSWORD (AMBIL DATA DARI JADWAL) ---
const btnLupaPass = document.getElementById('btn-lupa-pass');
if (btnLupaPass) {
    btnLupaPass.addEventListener('click', () => {
        const hariIni = new Date().getDay();
        const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const petugasHariIni = jadwalPiket[hariIni];
        
        let teksData = `.lupapassword (nama petugas)`;
        petugasHariIni.forEach(p => {
            teksData += `- User: ${p.user} | Pass: ${p.pass}\n`;
        });

        const urlWA = `https://wa.me/${nomorBotWA}?text=${encodeURIComponent(teksData)}`;
        window.open(urlWA, '_blank');
    });
}

// --- 6. LOGIKA LOGIN ---
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputUser = document.getElementById('username').value.toLowerCase().trim();
    const inputPass = document.getElementById('password').value;
    
    const hariIni = new Date().getDay(); 
    const daftarPetugas = jadwalPiket[hariIni];

    const userValid = daftarPetugas.find(p => p.user === inputUser && p.pass === inputPass);

    if (userValid) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('report-page').style.display = 'block';
        showNotification(true, `Selamat datang, ${inputUser}!`);
    } else {
        showNotification(false, "Login Gagal! Username tidak sesuai jadwal atau password salah.");
    }
});

// --- 7. KIRIM DATA KE GOOGLE SHEETS ---
const reportForm = document.getElementById('report-form');
reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const namaSiswa = document.getElementById('nama').value;
    const kelasSiswa = document.querySelector('input[name="kelas"]:checked').value;
    const jurusanSiswa = document.querySelector('input[name="jurusan"]:checked').value;
    const petugasPiket = document.getElementById('username').value;

    let daftarPelanggaran = [];
    document.querySelectorAll('input[name="pelanggaran"]:checked').forEach((item) => {
        daftarPelanggaran.push(item.value);
    });
    
    const pelanggaranLain = document.getElementById('pelanggaran-lain').value;
    if (pelanggaranLain) daftarPelanggaran.push(pelanggaranLain);

    if (daftarPelanggaran.length === 0) {
        showNotification(false, "Pilih minimal satu jenis pelanggaran!");
        return;
    }

    const kunciTujuan = `${kelasSiswa}-${jurusanSiswa}`;
    const nomorWali = databaseWali[kunciTujuan] || "-";

    const payload = {
        tanggal: new Date().toLocaleString('id-ID'),
        siswa: namaSiswa,
        kelas: kelasSiswa,
        jurusan: jurusanSiswa,
        pelanggaran: daftarPelanggaran.join(', '),
        petugas: petugasPiket,
        nomorWali: nomorWali
    };

    const btnSubmit = document.getElementById('btn-submit');
    const originalText = btnSubmit.innerText;
    btnSubmit.innerText = "⏳ Mengirim...";
    btnSubmit.disabled = true;

    try {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz2RMoHkS85ABrcTRRCcOfLnHVvnpxMAyLQpVeyHk4F1YgFIPFpzEB_4cIHfhVgXBuc/exec';

        await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        showNotification(true, `Berhasil! Laporan ${namaSiswa} sudah disimpan.`);
        reportForm.reset();
    } catch (error) {
        showNotification(false, "Gagal mengirim data ke sistem.");
        console.error('Error!', error.message);
    } finally {
        btnSubmit.innerText = originalText;
        btnSubmit.disabled = false;
    }
});

// Fungsi Lapor WA jika error kirim
function laporWA() {
    const pesan = encodeURIComponent("Data piket ERROR, Benerin cepetan");
    window.open(`https://wa.me/${nomorAdmin}?text=${pesan}`, '_blank');
}
