let cinemas = [
    {
        id: 0,
        name: 'Bioskop Grand Mall',
        location: 'Jakarta Pusat'
    },
    {
        id: 1,
        name: 'Cinema XXI Plaza',
        location: 'Jakarta Selatan'
    },
    {
        id: 2,
        name: 'CGV Mall',
        location: 'Jakarta Barat'
    }
];

let films = JSON.parse(localStorage.getItem('films')) || [
    {
        id: 0,
        name: 'Avengers: Endgame',
        genre: 'action',
        poster: 'Avanger.png',
        duration: '180 menit',
        schedules: ['10:00', '14:00', '18:00'],
        cinemas: [0, 1] // Grand Mall, Cinema XXI Plaza
    },
    {
        id: 1,
        name: 'Titanic',
        genre: 'drama',
        poster: 'Titanic.png',
        duration: '195 menit',
        schedules: ['12:00', '16:00', '20:00'],
        cinemas: [1, 2] // Cinema XXI Plaza, CGV Mall
    },
    {
        id: 2,
        name: 'Deadpool',
        genre: 'comedy',
        poster: 'Deadpool.png',
        duration: '108 menit',
        schedules: ['11:00', '15:00', '19:00'],
        cinemas: [0, 2] // Grand Mall, CGV Mall
    },
    {
        id: 3,
        name: 'Waktu Maghrib',
        genre: 'horror',
        poster: 'Waktu.png',
        duration: '135 menit',
        schedules: ['13:00', '17:00', '21:00'],
        cinemas: [0, 1, 2] // Semua bioskop
    }
];

let selectedCinema = null;
let selectedFilm = null;
let selectedTime = null;
let selectedSeats = [];


const pricePerTicket = 50000; // Rp 50.000 per tiket
const totalSeats = 25; // 5x5 grid
const rows = ['A', 'B', 'C', 'D', 'E'];
const cols = [1, 2, 3, 4, 5];

function saveFilms() {
    localStorage.setItem('films', JSON.stringify(films));
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(sec => {
        if (sec.id === sectionId) {
            sec.classList.remove('hidden');
        } else {
            sec.classList.add('hidden');
        }
    });
}

function filterMovies() {
    const genreFilter = document.getElementById('genreFilter');
    const searchInput = document.getElementById('searchInput');
    const selectedGenre = genreFilter ? genreFilter.value : 'all';
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const movieCards = document.querySelectorAll('.movie-card');

    movieCards.forEach(card => {
        const genre = card.dataset.genre;
        const name = card.querySelector('h3').textContent.toLowerCase();

        let show = true;
        if (selectedGenre !== 'all' && genre !== selectedGenre) show = false;
        if (searchTerm && !name.includes(searchTerm)) show = false;

        card.style.display = show ? 'block' : 'none';
    });
}

function attachCinemaEvents() {
    document.querySelectorAll('.select-cinema').forEach(button => {
        button.addEventListener('click', function() {
            const cinemaId = parseInt(this.closest('.cinema-card').dataset.id);
            selectedCinema = cinemas.find(c => c.id === cinemaId);
            if (selectedCinema) {
                showSection('movies');
                generateMoviesGrid(cinemaId);
            }
        });
    });
}

function attachMovieEvents() {
    document.querySelectorAll('.select-movie').forEach(button => {
        button.addEventListener('click', function() {
            const filmId = parseInt(this.closest('.movie-card').dataset.id);
            selectedFilm = films.find(f => f.id === filmId);
            if (selectedFilm) {
                document.getElementById('selectedMovieTitle').textContent = `Jadwal untuk ${selectedFilm.name}`;
                showSection('schedule');
                generateSchedules();
            }
        });
    });
}

function generateCinemas() {
    const grid = document.getElementById('cinemasGrid');
    if (!grid) return;
    grid.innerHTML = '';
    cinemas.forEach(cinema => {
        const card = document.createElement('div');
        card.className = 'cinema-card';
        card.dataset.id = cinema.id;
        card.innerHTML = `
            <h3>${cinema.name}</h3>
            <p>Lokasi: ${cinema.location}</p>
            <button class="select-cinema" onclick="window.location.href='daftar.html?cinemaId=${cinema.id}'">Pilih Bioskop</button>
        `;
        grid.appendChild(card);
    });
}

function generateMoviesGrid(cinemaId = null) {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const filteredFilms = cinemaId !== null ? films.filter(film => film.cinemas.includes(cinemaId)) : films;
    filteredFilms.forEach(film => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.genre = film.genre;
        card.dataset.id = film.id;
        card.innerHTML = `
            <img src="${film.poster}" alt="${film.name}" onerror="this.src='https://via.placeholder.com/200x300/FF0000/FFFFFF?text=No+Image'">
            <h3>${film.name}</h3>
            <p>Genre: ${film.genre.charAt(0).toUpperCase() + film.genre.slice(1)} | Durasi: ${film.duration}</p>
            <button class="select-movie">Pilih Film</button>
        `;
        grid.appendChild(card);
    });
    attachMovieEvents();
}

function generateSchedules() {
    const container = document.getElementById('scheduleButtons');
    if (!container || !selectedFilm) return;
    container.innerHTML = '';
    selectedFilm.schedules.forEach(time => {
        const btn = document.createElement('button');
        btn.textContent = time;
        btn.addEventListener('click', function() {
            selectedTime = time;
            document.getElementById('selectedTime').textContent = `Jadwal: ${time}`;
            showSection('seats');
            generateSeats();
        });
        container.appendChild(btn);
    });
}

function generateSeats() {
    const container = document.getElementById('seatsGrid');
    if (!container) return;
    container.innerHTML = '';
    selectedSeats = []; // Reset

    // Random booked seats (20% booked)
    const bookedSeats = new Set();
    while (bookedSeats.size < Math.floor(totalSeats * 0.2)) {
        const randomIndex = Math.floor(Math.random() * totalSeats);
        bookedSeats.add(randomIndex);
    }

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const seatIndex = row * 5 + col;
            const seatLabel = `${rows[row]}${cols[col]}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = seatLabel;

            if (bookedSeats.has(seatIndex)) {
                seat.classList.add('booked');
            } else {
                seat.classList.add('available');
                seat.addEventListener('click', () => toggleSeat(seat, seatLabel));
            }

            container.appendChild(seat);
        }
    }
    updateSeatsInfo();
}

function toggleSeat(seatElement, label) {
    if (selectedSeats.length >= 5) return; // Max 5 seats

    const index = selectedSeats.indexOf(label);
    if (index > -1) {
        // Deselect
        selectedSeats.splice(index, 1);
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
    } else {
        // Select
        selectedSeats.push(label);
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
    }
    updateSeatsInfo();
}

function updateSeatsInfo() {
    const count = selectedSeats.length;
    const infoElement = document.getElementById('selectedSeatsInfo');
    const proceedBtn = document.getElementById('proceedToForm');
    if (infoElement) {
        infoElement.textContent = `Kursi dipilih: ${count} | Total: Rp ${count * pricePerTicket.toLocaleString('id-ID')}`;
    }
    if (proceedBtn) {
        proceedBtn.disabled = count === 0;
    }
}

function showBookingForm() {
    if (selectedSeats.length > 0) {
        document.getElementById('summaryCinema').textContent = selectedCinema.name;
        document.getElementById('summaryMovie').textContent = selectedFilm.name;
        document.getElementById('summaryTime').textContent = selectedTime;
        document.getElementById('summarySeats').textContent = selectedSeats.join(', ');
        document.getElementById('summaryTotal').textContent = `Rp ${selectedSeats.length * pricePerTicket.toLocaleString('id-ID')}`;
        showSection('form');
    }
}

function resetAll() {
    selectedCinema = null;
    selectedFilm = null;
    selectedTime = null;
    selectedSeats = [];
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('searchInput').value = '';
    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter) genreFilter.value = 'all';
    filterMovies();
}



document.addEventListener('DOMContentLoaded', function() {
    generateCinemas();

    const genreFilter = document.getElementById('genreFilter');
    const searchInput = document.getElementById('searchInput');

    if (genreFilter) {
        genreFilter.addEventListener('change', filterMovies);
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterMovies);
    }

    const backToCinemasBtn = document.getElementById('backToCinemas');
    if (backToCinemasBtn) {
        backToCinemasBtn.addEventListener('click', () => showSection('cinemas'));
    }

    const backToMoviesBtn = document.getElementById('backToMovies');
    if (backToMoviesBtn) {
        backToMoviesBtn.addEventListener('click', () => showSection('movies'));
    }

    const backToScheduleBtn = document.getElementById('backToSchedule');
    if (backToScheduleBtn) {
        backToScheduleBtn.addEventListener('click', () => showSection('schedule'));
    }

    const proceedToFormBtn = document.getElementById('proceedToForm');
    if (proceedToFormBtn) {
        proceedToFormBtn.addEventListener('click', showBookingForm);
    }

    const backToSeatsBtn = document.getElementById('backToSeats');
    if (backToSeatsBtn) {
        backToSeatsBtn.addEventListener('click', () => showSection('seats'));
    }

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('customerName').value;
            const email = document.getElementById('customerEmail').value;

            if (!name || !email) {
                alert('Mohon isi nama dan email!');
                return;
            }

            const total = selectedSeats.length * pricePerTicket;
            alert(`Booking berhasil!\nBioskop: ${selectedCinema.name}\nFilm: ${selectedFilm.name}\nJadwal: ${selectedTime}\nKursi: ${selectedSeats.join(', ')}\nNama: ${name}\nEmail: ${email}\nTotal: Rp ${total.toLocaleString('id-ID')}`);

            resetAll();
            showSection('cinemas');
        });
    }


});
