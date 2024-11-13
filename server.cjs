const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const users = [
  { username: 'testuser', password: bcrypt.hashSync('testpassword', 10) }
]; // Dummy user for testing

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Protected route
app.get('/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid token');
      } else {
        return res.json({ message: 'Protected data', user: decoded });
      }
    });
  } else {
    res.status(401).send('No token provided');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});