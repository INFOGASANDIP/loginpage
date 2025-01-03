document.getElementById('signup-link').addEventListener('click', () => {
    window.location.href = '/signup.html';
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (result.success) {
        window.location.href = result.redirect;
    } else {
        alert(result.message);
    }
});
// login.js
const API_BASE_URL = "https://loginpage-2.onrender.com";

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();

        if (result.success) {
            window.location.href = "/home.html";
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to log in. Please try again.");
    }
});
