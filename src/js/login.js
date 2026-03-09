document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Add your login logic here (e.g., ajax request)
    console.log('Trying to log in with', email, password);
    alert('Masuk dengan email: ' + email);
});

document.getElementById('google-login').addEventListener('click', function() {
    // Placeholder for google login action
    alert('Login dengan Google belum diimplementasikan');
});