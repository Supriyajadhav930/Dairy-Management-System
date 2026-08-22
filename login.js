// ============================
// SHOW / HIDE PASSWORD
// ============================

const password = document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

    } else {

        password.type = "password";

    }

});


// ============================
// LOGIN FORM
// ============================

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const passwordValue =
        document.getElementById("password").value.trim();


    if (email === "" || passwordValue === "") {

        alert("Please enter email and password.");

        return;
    }


    alert("Login successful!");

});