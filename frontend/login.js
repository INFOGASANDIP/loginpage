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
