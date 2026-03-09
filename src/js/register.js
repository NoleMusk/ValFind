document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    // add registration logic
    alert('Pendaftaran dengan email: ' + email);
});