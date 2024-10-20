const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

// membuat koneksi mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crudmysql'
});

connection.connect((err) => {
    if (err) {
        console.error("Terjadi kesalahan dalam koneksi ke MySQL:", err.stack);
    }
    console.log("Koneksi MySQL berhasil dengan id" + connection.threadId)
});

// menggunakan view engine 
app.set('view engine', 'ejs');

// Routing (Create, Read, Update, Delete) untuk buku perpustakaan

// Menampilkan data buku di halaman index /read
app.get('/', (req, res) => {
    const query = 'SELECT * FROM book';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { books: results });
    });
});

// Create / Input / Insert buku
app.post('/add', (req, res) => {
    const { title, author, year } = req.body;
    const query = 'INSERT INTO book (title, author, year) VALUES (?, ?, ?)';
    connection.query(query, [title, author, year], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Update - Akses halaman edit
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM book WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('edit', { book: result[0] });
    });
});

// Update - Simpan perubahan data buku
app.post('/update/:id', (req, res) => {
    const { title, author, year } = req.body;
    const query = 'UPDATE book SET title = ?, author = ?, year = ? WHERE id = ?';
    connection.query(query, [title, author, year, req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Delete - Menghapus buku
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM book WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Menjalankan server di port 3000
app.listen(3000, () => {
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:3000");
});