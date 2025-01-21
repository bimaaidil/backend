const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

// Inisialisasi aplikasi Express
const app = express();

// Middleware untuk parsing request body
app.use(bodyParser.json());
app.use(cors());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/your_database', {
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Model User (Schema)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Route untuk login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password diperlukan' });
  }

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Verifikasi password dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Membuat token JWT untuk user
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(200).json({ message: 'Login berhasil', token });
    } else {
      return res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (err) {
    console.error('Terjadi kesalahan:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err });
  }
});

// Menjalankan server
const port = 5000;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
