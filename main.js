
let token = null;

// Fungsi untuk login admin
document.getElementById('loginBtn').addEventListener('click', function() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        token = data.token;
        document.getElementById('loginMessage').textContent = 'Login successful!';
    })
    .catch(error => {
        console.error('Error logging in:', error);
        document.getElementById('loginMessage').textContent = 'Login failed.';
    });
});

// Fungsi untuk menambah anime baru
document.getElementById('addAnimeBtn').addEventListener('click', function() {
    const animeTitle = document.getElementById('animeTitle').value;
    if (!animeTitle) return alert('Please enter an anime title.');

    const newAnime = { title: animeTitle };

    fetch('http://localhost:3000/api/animes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(newAnime)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Anime ${data.title} added!`);
        fetchAnimes(); // Refresh list of animes
        document.getElementById('animeTitle').value = ''; // Clear input field
    })
    .catch(error => {
        console.error('Error adding anime:', error);
    });
});

// Fungsi untuk menambah episode baru
document.getElementById('addEpisodeBtn').addEventListener('click', function() {
    const selectedAnimeId = document.getElementById('animeSelect').value;
    const episodeTitle = document.getElementById('episodeTitle').value;
    if (!selectedAnimeId) return alert('Please select an anime.');
    if (!episodeTitle) return alert('Please enter an episode title.');

    const newEpisode = { title: episodeTitle };
    const episodeUrl = `http://localhost:3000/api/animes/${selectedAnimeId}/episodes`;

    fetch(episodeUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(newEpisode)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Episode ${data.title} added to anime ${selectedAnimeId}!`);
        document.getElementById('episodeTitle').value = ''; // Clear input field
    })
    .catch(error => {
        console.error('Error adding episode:', error);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/api/animes';

    // Fungsi untuk mendapatkan daftar anime
    function fetchAnimes() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                let resultHtml = '<h3>Anime List:</h3>';
                let animeOptions = '<option value="">Select Anime</option>';
                
                data.forEach(anime => {
                    resultHtml += `<p><strong>${anime.title}</strong> - ${anime.episodes.length} episodes</p>`;
                    animeOptions += `<option value="${anime.id}">${anime.title}</option>`;
                });

                document.getElementById('result').innerHTML = resultHtml;
                document.getElementById('animeSelect').innerHTML = animeOptions;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('result').textContent = 'Error fetching data';
            });
    }

    // Mendapatkan daftar anime saat halaman pertama kali dimuat
    fetchAnimes();
});
