
const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');

app.use(express.json());

const SECRET_KEY = 'your_secret_key';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

let animes = [
    { id: 1, title: 'Naruto', episodes: [] },
    { id: 2, title: 'One Piece', episodes: [] }
];

// Middleware untuk autentikasi token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
}

// Route login untuk admin
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(403).send('Invalid username or password.');
    }
});

// Endpoint GET untuk mengambil semua anime (tidak perlu autentikasi)
app.get('/api/animes', (req, res) => {
    res.json(animes);
});

// Endpoint POST untuk menambah anime baru (hanya admin)
app.post('/api/animes', authenticateToken, (req, res) => {
    const newAnime = {
        id: animes.length + 1,
        title: req.body.title,
        episodes: []
    };
    animes.push(newAnime);
    res.status(201).json(newAnime);
});

// Endpoint GET untuk mengambil semua episode dari anime tertentu (tidak perlu autentikasi)
app.get('/api/animes/:id/episodes', (req, res) => {
    const anime = animes.find(a => a.id === parseInt(req.params.id));
    if (!anime) return res.status(404).send('Anime not found.');
    res.json(anime.episodes);
});

// Endpoint POST untuk menambah episode baru ke anime tertentu (hanya admin)
app.post('/api/animes/:id/episodes', authenticateToken, (req, res) => {
    const anime = animes.find(a => a.id === parseInt(req.params.id));
    if (!anime) return res.status(404).send('Anime not found.');
    
    const newEpisode = {
        episodeNumber: anime.episodes.length + 1,
        title: req.body.title
    };
    anime.episodes.push(newEpisode);
    res.status(201).json(newEpisode);
});

// Menjalankan server
app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
});
