document.addEventListener('DOMContentLoaded', () => {
    console.log("Sairaj Dairy - About Us Page fully initialized.");

    // Navigation active link handler
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
});