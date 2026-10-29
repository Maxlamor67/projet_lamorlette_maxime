const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:4200' })); // autorise Angular
app.use(express.json());                            // lit le JSON du body

const users = [];
let nextId = 1;

app.post('/api/auth/signup', (req, res) => {
  const { username, email, password } = req.body ?? {};

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
  }

  const user = { id: nextId++, username, email };
  users.push({ ...user, password });

  res.status(201).json({ ...user, message: 'Compte créé.' });
});

app.listen(3000, () => {
  console.log('Mock API sur http://localhost:3000/api');
});