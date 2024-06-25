// Mostrar y cerrar modal para vehículo
function mostrarModal() {
    document.getElementById('vehicleModal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('vehicleModal').style.display = 'none';
}

// Mostrar y cerrar modal para campus
function mostrarModalCampus() {
    document.getElementById('campusModal').style.display = 'block';
}

function cerrarModalCampus() {
    document.getElementById('campusModal').style.display = 'none';
}

// Manejo del formulario de registro de vehículo
document.getElementById('vehicleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const marca = document.getElementById('marca').value;
    const patente = document.getElementById('patente').value;
    const color = document.getElementById('color').value;

    if (/^[A-Z]{2,3}[0-9]{4}$/.test(patente)) {
        alert('Vehículo registrado: ' + marca + ', ' + patente + ', ' + color);
        agregarBotonVehiculo(marca, patente, color);
        cerrarModal();
        marcarComoFinalizado(document.querySelector('.add-vehicle-btn'), 'Finalizado');
        mostrarInfoVehiculo(marca, color, patente);
    } else {
        alert('La patente ingresada no es válida. Debe ser en formato chileno (e.g., AB1234 o ABC123).');
    }
});

function marcarComoFinalizado(button, text) {
    button.classList.add('completed-btn');
    button.innerText = text;
}

function agregarBotonVehiculo(marca, patente, color) {
    const btn = document.createElement('button');
    btn.innerHTML = 'Seleccionar Campus';
    btn.className = 'campus-btn';
    btn.onclick = mostrarModalCampus;
    document.getElementById('vehiculosContainer').appendChild(btn);

    btn.dataset.marca = marca;
    btn.dataset.patente = patente;
    btn.dataset.color = color;
}

function mostrarInfoVehiculo(marca, patente, color) {
    const container = document.getElementById('vehicleInfoContainer');
    container.innerHTML = `
        <p><strong>Marca:</strong> ${marca}</p>
        <p><strong>Patente:</strong> ${patente}</p>
        <p><strong>Color:</strong> ${color}</p>
    `;
}

function mostrarUbicacionCampus() {
    const campus = document.getElementById('campus').value;
    const ubicacionCampusDiv = document.getElementById('ubicacionCampus');
    ubicacionCampusDiv.innerHTML = '';

    if (campus) {
        let ubicacionTexto = '';
        let ubicacionURL = '';

        if (campus === 'Chuyaca') {
            ubicacionTexto = 'Google Maps';
            ubicacionURL = 'https://maps.app.goo.gl/VYjxTXeeaQF2kmRz8';
        } else if (campus === 'Meyer') {
            ubicacionTexto = 'Google Maps';
            ubicacionURL = 'https://maps.app.goo.gl/VYjxTXeeaQF2kmRz8';
        }

        const link = document.createElement('a');
        link.textContent = ubicacionTexto;
        link.href = ubicacionURL;
        link.target = '_blank'; // Abre el enlace en una nueva pestaña/tab

        const button = document.createElement('button');
        button.textContent = 'Seleccionar esta ubicación';
        button.onclick = function() {
            alert('Ubicación seleccionada: ' + campus);
            cerrarModalCampus();
            document.querySelector('.campus-btn').classList.add('completed-btn');
            document.querySelector('.campus-btn').innerText = 'Finalizado';
            mostrarTercerBoton();
        };

        ubicacionCampusDiv.appendChild(link);
        ubicacionCampusDiv.appendChild(button);
    }
}

function mostrarTercerBoton() {
    const tercerBtn = document.createElement('button');
    tercerBtn.innerHTML = 'Seleccionar Estacionamiento';
    tercerBtn.className = 'third-btn';
    tercerBtn.onclick = function() {
        mostrarEstacionamientos();
    };

    document.getElementById('vehiculosContainer').appendChild(tercerBtn);
}

function mostrarEstacionamientos() {
    const parkingContainer = document.getElementById('parkingContainer');
    parkingContainer.style.display = 'block';
    parkingContainer.innerHTML = '';

    const numFilas = 5;
    const numColumnas = 5;

    for (let fila = 0; fila < numFilas; fila++) {
        for (let columna = 0; columna < numColumnas; columna++) {
            const parkingSpot = document.createElement('button'); // Cambiado de 'div' a 'button'
            parkingSpot.classList.add('parking-spot');
            parkingSpot.textContent = `A${fila + 1}${String.fromCharCode(65 + columna)}`;

            // Asignar clase disponible u ocupada de forma aleatoria
            const ocupado = Math.random() < 0.5; // Cambiar la probabilidad si es necesario
            if (ocupado) {
                parkingSpot.classList.add('occupied');
                parkingSpot.disabled = true;
            } else {
                parkingSpot.classList.add('available');
                parkingSpot.onclick = function() {
                    seleccionarEstacionamiento(parkingSpot);
                };
            }
            parkingContainer.appendChild(parkingSpot);
        }
        parkingContainer.appendChild(document.createElement('br'));
    }
}
let selectedSpot = null;
function seleccionarEstacionamiento(parkingSpot) {
    const parkingContainer = document.getElementById('parkingContainer');
    const botones = parkingContainer.getElementsByClassName('parking-spot');
    
    for (let boton of botones) {
        boton.classList.remove('selected');
    }

    parkingSpot.classList.add('selected');

    // Mostrar botón de horarios disponibles
    mostrarBotonHorariosDisponibles();
}

function mostrarBotonHorariosDisponibles() {
    const horariosBtn = document.createElement('button');
    horariosBtn.innerHTML = 'Horarios Disponibles';
    horariosBtn.className = 'horarios-btn';
    horariosBtn.onclick = function() {
        mostrarModalHorariosDisponibles();
    };

    // Eliminar botón de horarios disponibles si ya existe
    const vehiculosContainer = document.getElementById('vehiculosContainer');
    const existingHorariosBtn = vehiculosContainer.querySelector('.horarios-btn');
    if (existingHorariosBtn) {
        vehiculosContainer.removeChild(existingHorariosBtn);
    }

    vehiculosContainer.appendChild(horariosBtn);
}

function mostrarModalHorariosDisponibles() {
    const horariosModal = document.getElementById('horariosModal');
    horariosModal.style.display = 'block';
}

function cerrarModalHorariosDisponibles() {
    const horariosModal = document.getElementById('horariosModal');
    horariosModal.style.display = 'none';
}

window.onclick = function(event) {
    const vehicleModal = document.getElementById('vehicleModal');
    const campusModal = document.getElementById('campusModal');
    const horariosModal = document.getElementById('horariosModal');
    if (event.target == vehicleModal) {
        vehicleModal.style.display = 'none';
    }
    if (event.target == campusModal) {
        campusModal.style.display = 'none';
    }
    if (event.target == horariosModal) {
        horariosModal.style.display = 'none';
    }
}