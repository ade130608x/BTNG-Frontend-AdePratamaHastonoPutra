const API_URL = 'https://api-web.dnccudinus.org/api/mobil';

// DOM Elements
const carContainer = document.getElementById('car-container');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retryBtn');
const searchInput = document.getElementById('searchInput');

let allCarsData = [];

// Format mata uang Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
};

// Fungsi utama mengambil data API
async function fetchMobil() {
    carContainer.innerHTML = '';
    loadingIndicator.style.display = 'block';
    errorMessage.style.display = 'none';

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Menangkap array data
        allCarsData = data.data || data; 
        
        if (!Array.isArray(allCarsData) || allCarsData.length === 0) {
            throw new Error("Format data tidak sesuai atau kosong");
        }

        // DEBUGGING: Cek struktur asli dari API di Inspect -> Console
        console.log("Struktur Object Mobil dari API (Data Pertama):", allCarsData[0]);

        loadingIndicator.style.display = 'none';
        renderMobil(allCarsData);
        
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        loadingIndicator.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

// Manipulasi DOM untuk menampilkan data
function renderMobil(cars) {
    carContainer.innerHTML = '';

    if (cars.length === 0) {
        carContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Mobil tidak ditemukan.</p>';
        return;
    }

    cars.forEach(car => {
        // MENYESUAIKAN KEY API: Mencoba berbagai kemungkinan nama properti dari backend
        const carName = car.nama || car.nama_mobil || car.name || 'Nama Tidak Diketahui';
        const carBrand = car.merek || car.merk || car.brand || 'Merek Tidak Terdaftar';
        const carImage = car.gambar || car.image || car.img || car.foto || 'https://via.placeholder.com/400x300?text=Gambar+Tidak+Tersedia';
        const carPrice = car.harga ? formatRupiah(car.harga) : 'Harga Menyesuaikan';

        const card = document.createElement('div');
        card.className = 'car-card';

        card.innerHTML = `
            <div class="car-image-container">
                <img src="${carImage}" 
                     alt="${carName}" 
                     class="car-img" 
                     onerror="this.src='https://via.placeholder.com/400x300?text=Gambar+Error'">
            </div>
            <div class="car-info">
                <h3 class="car-name">${carName}</h3>
                <p class="car-brand">${carBrand}</p>
                <p class="car-price">${carPrice}</p>
                <button class="btn-primary" onclick="alert('Pemesanan untuk ${carName} segera diproses!')">
                    Pesan Sekarang
                </button>
            </div>
        `;

        carContainer.appendChild(card);
    });
}

// Fitur Pencarian Real-time (disesuaikan propertinya)
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    
    const filteredCars = allCarsData.filter(car => {
        const nama = (car.nama || car.nama_mobil || car.name || '').toLowerCase();
        const merk = (car.merek || car.merk || car.brand || '').toLowerCase();
        return nama.includes(keyword) || merk.includes(keyword);
    });
    
    renderMobil(filteredCars);
});

retryBtn.addEventListener('click', fetchMobil);
document.addEventListener('DOMContentLoaded', fetchMobil);