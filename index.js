document.addEventListener('DOMContentLoaded', () => {
    // Navigation active link toggle
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Button action handles
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            console.log('Login clicked');
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            console.log('Sign Up clicked');
        });
    }
});