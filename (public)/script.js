const reservaForm = document.getElementById('reservaForm');
const mensajeReserva = document.getElementById('mensajeReserva');

reservaForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const placa = document.getElementById('placa').value;
    const fecha = document.getElementById('fecha').value;
    
    
    mensajeReserva.innerText = `¡Estacionamiento reservado para ${nombre} con placa ${placa} el ${fecha}!`;
    
    
});
