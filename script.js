const reservaForm = document.getElementById('reservaForm');
const mensajeReserva = document.getElementById('mensajeReserva');

reservaForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const placa = document.getElementById('placa').value;
    const fecha = document.getElementById('fecha').value;
    
    // Aquí puedes agregar la lógica de reserva y mostrar un mensaje de confirmación
    mensajeReserva.innerText = `¡Estacionamiento reservado para ${nombre} con placa ${placa} el ${fecha}!`;
    
    // Aquí puedes enviar los datos a un servidor o almacenarlos localmente
});
