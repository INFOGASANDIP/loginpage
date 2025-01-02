const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Paths for static files and database
const frontendPath = path.join(__dirname, 'frontend');
const dbPath = path.join(__dirname, 'database', 'users.json');

// Serve static files
app.use(express.static(frontendPath));

// Serve the index.html as the default page for root
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(frontendPath, 'signup.html'));
});


// Route: Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    try {
        const users = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        if (users[email] && users[email].password === password) {
            return res.json({ success: true, redirect: '/home.html' });
        }

        return res.json({ success: false, message: 'Email/Phone or password is incorrect.' });
    } catch (err) {
        console.error('Error reading users.json:', err);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Route: Signup
app.post('/signup', (req, res) => {
    const { email, password } = req.body;

    try {
        const users = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        if (users[email]) {
            return res.json({ success: false, message: 'User already exists!' });
        }

        users[email] = { password };
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

        return res.json({ success: true, redirect: '/home.html' });
    } catch (err) {
        console.error('Error writing to users.json:', err);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
