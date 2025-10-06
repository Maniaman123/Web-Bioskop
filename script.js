let films = JSON.parse(localStorage.getItem('films')) || [
    {
        id: 0,
        name: 'Avengers: Endgame',
        genre: 'action',
        poster: 'Avanger.png',
        duration: '180 menit',
        schedules: ['10:00', '14:00', '18:00'],
        description: 'Film superhero terakhir dari Marvel Studios yang mengakhiri saga Infinity War dengan epik dan emosional.'
    },
    {
        id: 1,
        name: 'Titanic',
        genre: 'drama',
        poster: 'Titanic.png',
        duration: '195 menit',
        schedules: ['12:00', '16:00', '20:00'],
        description: 'Kisah cinta tragis antara Jack dan Rose di atas kapal Titanic yang tenggelam pada tahun 1912.'
    },
    {
        id: 2,
        name: 'Deadpool',
        genre: 'comedy',
        poster: 'Deadpool.png',
        duration: '108 menit',
        schedules: ['11:00', '15:00', '19:00']
    },
    {
        id: 3,
        name: 'Waktu Maghrib',
        genre: 'horror',
        poster: 'Waktu.png',
        duration: '135 menit',
        schedules: ['13:00', '17:00', '21:00']
    }
];

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
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function resetAll() {
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

function generateMoviesGrid() {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    films.forEach(film => {
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
                seat.addEventListener('click', () => toggleSeat(seat, seatLabel, row, col));
            }

            container.appendChild(seat);
        }
    }
    updateSeatsInfo();
}

function toggleSeat(seatElement, label, row, col) {
    if (selectedSeats.length >= 5) return; // Max 5 seats

    const index = selectedSeats.findIndex(s => s.label === label);
    if (index > -1) {
        // Deselect
        selectedSeats.splice(index, 1);
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
    } else {
        // Select
        selectedSeats.push({ label, row, col });
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





// Initialize
function generateTopFilms() {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const topFilms = films.filter(film => film.name === 'Avengers: Endgame' || film.name === 'Titanic');
    topFilms.forEach(film => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.genre = film.genre;
        card.dataset.id = film.id;
        card.innerHTML = `
            <img src="${film.poster}" alt="${film.name}" class="top-film-poster" onerror="this.src='https://via.placeholder.com/200x300/FF0000/FFFFFF?text=No+Image'">
            <h3>${film.name}</h3>
            <p class="film-description">${film.description}</p>
            <a href="pilih-film.html" class="btn btn-primary">Pilih Film</a>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('moviesGrid').parentElement.querySelector('h2').textContent === 'Top Film') {
        generateTopFilms();
    } else {
        generateMoviesGrid();
    }

    // Filter dan Search
    const genreFilter = document.getElementById('genreFilter');
    const searchInput = document.getElementById('searchInput');

    if (genreFilter) {
        genreFilter.addEventListener('change', filterMovies);
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterMovies);
    }

    // Back to Movies
    const backToMoviesBtn = document.getElementById('backToMovies');
    if (backToMoviesBtn) {
        backToMoviesBtn.addEventListener('click', () => showSection('movies'));
    }

    // Back to Schedule
    const backToScheduleBtn = document.getElementById('backToSchedule');
    if (backToScheduleBtn) {
        backToScheduleBtn.addEventListener('click', () => showSection('schedule'));
    }

    // Proceed to Form
    const proceedToFormBtn = document.getElementById('proceedToForm');
    if (proceedToFormBtn) {
        proceedToFormBtn.addEventListener('click', function() {
            if (selectedSeats.length > 0) {
                document.getElementById('summaryMovie').textContent = selectedFilm.name;
                document.getElementById('summaryTime').textContent = selectedTime;
                document.getElementById('summarySeats').textContent = selectedSeats.map(s => s.label).join(', ');
                document.getElementById('summaryTotal').textContent = `Rp ${selectedSeats.length * pricePerTicket.toLocaleString('id-ID')}`;
                showSection('form');
            }
        });
    }

    // Back to Seats
    const backToSeatsBtn = document.getElementById('backToSeats');
    if (backToSeatsBtn) {
        backToSeatsBtn.addEventListener('click', () => showSection('seats'));
    }

    // Back to Cinemas
    const backToCinemasBtn = document.getElementById('backToCinemas');
    if (backToCinemasBtn) {
        backToCinemasBtn.addEventListener('click', () => {
            window.location.href = 'pilih-film.html';
        });
    }

    // Form Submit
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
            alert(`Booking berhasil!\nFilm: ${selectedFilm.name}\nJadwal: ${selectedTime}\nKursi: ${selectedSeats.map(s => s.label).join(', ')}\nNama: ${name}\nEmail: ${email}\nTotal: Rp ${total.toLocaleString('id-ID')}`);

            resetAll();
            showSection('movies');
        });
    }
});
