// Show / hide password
function togglePassword(inputId, icon) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}


// Signup form
document.getElementById("signupForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check name
    if (name === "") {
        alert("Please enter your full name.");
        return;
    }


    // Check email
    if (email === "") {
        alert("Please enter your email address.");
        return;
    }


    // Check phone
    if (phone === "") {
        alert("Please enter your phone number.");
        return;
    }


    // Check password
    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }


    // Check confirm password
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }


    alert("Account created successfully!");


    // After successful signup
    // window.location.href = "login.html";

});


// Google signup
function googleSignup() {
    alert("Google Sign Up will be connected later.");
}