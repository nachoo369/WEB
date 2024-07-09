// app.js
document.addEventListener("DOMContentLoaded", function() {
    const userName = localStorage.getItem("userName");
    const menu = document.getElementById("menu");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const helpBtn = document.getElementById("help-btn");
    const reserveBtn = document.getElementById("reserve-btn");
    const historyBtn = document.getElementById("history-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const userNameBtn = document.getElementById("user-name");

    if (userName) {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        helpBtn.style.display = "none";
        reserveBtn.style.display = "block";
        historyBtn.style.display = "block";
        logoutBtn.style.display = "block";
        userNameBtn.style.display = "block";
        userNameBtn.textContent = userName;
    }

    window.toggleMenu = function() {
        menu.style.display = menu.style.display === "none" ? "block" : "none";
    }

    window.logout = function() {
        localStorage.removeItem("userName");
        location.reload();
    }
});
