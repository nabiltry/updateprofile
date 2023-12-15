const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Konfigurasi koneksi ke MySQL
const connection = mysql.createConnection({
  host: '34.101.65.238',
  port: 3306,
  user: 'root', 
  password: '12345', 
  database: 'profiledb', 
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Mendapatkan semua data profil
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM profiles', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

// Mendapatkan data profil berdasarkan ID
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM profiles WHERE id = ?', [id], (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  });
});

// Menambahkan profil baru
app.post('/users', (req, res) => {
  const { nama, email, password, tanggal_lahir, jenis } = req.body;
  const sql = 'INSERT INTO profiles (nama, email, password, tanggal_lahir, jenis) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [nama, email, password, tanggal_lahir, jenis], (error, results, fields) => {
    if (error) throw error;
    res.json({ message: 'Profile added successfully', id: results.insertId });
  });
});

// Mengupdate profil berdasarkan ID
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { nama, email, password, tanggal_lahir, jenis } = req.body;
  const sql = 'UPDATE profiles SET nama=?, email=?, password=?, tanggal_lahir=?, jenis=? WHERE id=?';
  connection.query(sql, [nama, email, password, tanggal_lahir, jenis, id], (error, results, fields) => {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  });
});

// Menghapus profil berdasarkan ID
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM profiles WHERE id=?';
  connection.query(sql, [id], (error, results, fields) => {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.json({ message: 'Profile deleted successfully' });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  });
});

// Jalankan server pada port yang telah ditentukan
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
