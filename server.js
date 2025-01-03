const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const databaseDir = path.join(__dirname, 'database');
const app = express();
const PORT = 3000;
const cors = require("cors");
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createUser(username, password) {
  const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
  await pool.query(query, [username, password]);
}


app.use(cors({ origin: "https://infogasandip.github.io" })); // Allow requests from your frontend


// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Path to the users.json file
const usersFilePath = path.join(__dirname, 'database', 'users.json');
if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir);
}
// Helper function to read and write to users.json
function readUsers() {
    // If the file does not exist, create it with an empty object
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, JSON.stringify({}));
    }

    const data = fs.readFileSync(usersFilePath, 'utf-8');

    // If the file is empty, return an empty object
    if (!data.trim()) {
        return {};
    }

    // Parse the JSON content
    return JSON.parse(data);
}


function writeUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)); // Pretty print JSON
    } catch (error) {
        console.error('Error writing to users.json:', error);
    }
}


// Routes

// Handle signup
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const users = readUsers();

    if (users[email]) {
        return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    users[email] = { username, password };
    writeUsers(users);

    // Send a success response
    res.status(200).json({ success: true, message: 'Account created successfully.' });
});


// Handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Read users
    const users = readUsers();

    // Check if user exists and password matches
    if (users[email] && users[email].password === password) {
        return res.json({ success: true, redirect: '/home.html' });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password.' });
});

// Serve the homepage
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(frontendPath, 'signup.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
