document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un nombre de usuario almacenado
    var username = sessionStorage.getItem('username');

    if (username) {
        // Mostrar nombre de usuario en lugar del menú hamburguesa
        document.getElementById('user-name').textContent = username;
        document.getElementById('user-name').style.display = 'block';

        // Ocultar el icono del menú hamburguesa si se muestra
        document.querySelector('.menu-icon').style.display = 'none';
        // Mostrar el botón de cerrar sesión
        document.getElementById('logout-btn').style.display = 'block';
    } else {
        // Mostrar el menú hamburguesa por defecto si no hay usuario autenticado
        document.querySelector('.menu-icon').style.display = 'block';
        document.getElementById('user-name').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'none';
    }
});

function logout() {
    // Limpiar sessionStorage y redirigir a la página de inicio de sesión
    sessionStorage.removeItem('username');
    window.location.href = 'login.html';
}
function toggleDropdown(id) {
    var dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Función para cerrar sesión (puedes definir tu lógica aquí)
function logout() {
    // Lógica para cerrar sesión, redirigir, etc.
    alert('Cerrar sesión');
}
