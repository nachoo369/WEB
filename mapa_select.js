import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyDPQHtLTQCPoQSAROQHKpFcDN-xuKkYlzg",
    authDomain: "tallerii-4104d.firebaseapp.com",
    projectId: "tallerii-4104d",
    storageBucket: "tallerii-4104d.appspot.com",
    messagingSenderId: "809208530029",
    appId: "1:809208530029:web:e823b1a85e167ec9cbab64",
    measurementId: "G-0E1TRG4GFF"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

console.log("Conexión a Firebase establecida correctamente.");

let startTime = null;
let endTime = null;
let disponibilidadLugares = {};
let lugarSeleccionado = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log("Documento cargado");
    createLugaresSiNoExisten();
    fetchDisponibilidadLugares();
    document.getElementById('start-time').addEventListener('change', function(event) {
        startTime = event.target.value;
    });
    document.getElementById('end-time').addEventListener('change', function(event) {
        endTime = event.target.value;
    });
    document.getElementById('reservar-btn').addEventListener('click', realizarReserva);
    document.getElementById('dialog-close-btn').addEventListener('click', closeDialog);
});

async function createLugaresSiNoExisten() {
    for (let i = 1; i <= 28; i++) {
        const docRef = doc(db, 'lugares_meyer', i.toString());
        const docSnapshot = await getDoc(docRef);
        if (!docSnapshot.exists()) {
            await setDoc(docRef, { disponible: true });
        }
    }
}

async function fetchDisponibilidadLugares() {
    const querySnapshot = await getDocs(collection(db, 'lugares_meyer'));
    querySnapshot.forEach(doc => {
        const lugarId = parseInt(doc.id);
        const disponible = doc.data().disponible;
        disponibilidadLugares[lugarId] = disponible;
        console.log(`Lugar ${lugarId}: ${disponible ? 'Disponible' : 'Ocupado'}`);
    });
    buildMapaLugares();
}

function buildMapaLugares() {
    const container = document.getElementById('mapa-lugares-container');
    container.innerHTML = '';

    // Fila con lugar preferencial
    container.appendChild(createFilaLugaresConPreferencial(6, 3));
  
    // Fila superior
    container.appendChild(createFilaLugares(0, 6));

  
    // Entrada
    container.appendChild(document.createTextNode(' Entrada '));
  
    // Fila inferior
    container.appendChild(createFilaLugares(8, 6));
  
    // Fila con 7 lugares
    container.appendChild(createFilaLugares(14, 7));
  
    // Fila con 7 lugares
    container.appendChild(createFilaLugares(21, 7));
}

function createFilaLugares(startIndex, count) {
    const row = document.createElement('div');
    row.className = 'lugares-row';
    for (let i = startIndex; i < startIndex + count; i++) {
      row.appendChild(createLugar(i));
    }
    return row;
}

function createFilaLugaresConPreferencial(startIndex, count) {
    const row = document.createElement('div');
    row.className = 'lugares-row';
    for (let i = startIndex; i < startIndex + count; i++) {
      row.appendChild(createLugarPreferencial(i));
    }
    return row;
}

function createLugar(index) {
    const lugar = document.createElement('div');
    lugar.className = 'lugar';
    lugar.style.backgroundColor = getLugarColor(index);
    lugar.innerText = (index + 1).toString();

    lugar.addEventListener('click', () => {
        if (disponibilidadLugares[index] === false) {
            showDialog('Estacionamiento no disponible', 'Este estacionamiento no está disponible.');
        } else {
            toggleSeleccion(index);
        }
    });

    return lugar;
}

function createLugarPreferencial(index) {
    const lugar = document.createElement('div');
    lugar.className = 'lugar';
    lugar.style.backgroundColor = getLugarColorPreferencia(index);
    lugar.innerHTML = '<i class="material-icons">accessible</i>';

    lugar.addEventListener('click', () => {
        if (disponibilidadLugares[index] === false) {
            showDialog('Estacionamiento no disponible', 'Este estacionamiento no está disponible.');
        } else {
            toggleSeleccion(index);
        }
    });

    return lugar;
}

function getLugarColor(index) {
    if (lugarSeleccionado === index) {
        return 'green';
    } else if (disponibilidadLugares[index] === false) {
        return 'red';
    } else {
        return 'grey';
    }
}

function getLugarColorPreferencia(index) {
    if (lugarSeleccionado === index) {
        return 'green';
    } else if (disponibilidadLugares[index] === false) {
        return 'red';
    } else {
        return 'blue';
    }
}

function toggleSeleccion(index) {
    lugarSeleccionado = (lugarSeleccionado === index) ? null : index;
    buildMapaLugares();
}

async function realizarReserva() {
  if (!startTime || !endTime) {
      showDialog('Error en la reserva', 'Por favor, seleccione ambas horas de inicio y fin.');
      return;
  }

  if (lugarSeleccionado === null) {
      showDialog('Error en la reserva', 'Por favor, seleccione un lugar.');
      return;
  }

  if (disponibilidadLugares[lugarSeleccionado] === false) {
      showDialog('Estacionamiento no disponible', 'Este estacionamiento no está disponible.');
      return;
  }

  try {
      const user = auth.currentUser;
      if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          let userName = 'Nombre no encontrado';
          if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData && userData.nombre) {
                  userName = userData.nombre;
              } else {
                  console.error('El documento de usuario no contiene el campo "nombre".');
              }
          } else {
              console.error('El documento de usuario no existe.');
          }
          // Obtener la última patente añadida por el usuario
          async function obtenerUltimaPatente(userUid) {
              const vehiculosQuery = collection(db, 'vehiculos');
              const vehiculosSnapshot = await getDocs(vehiculosQuery);
          
              let ultimaPatente = 'Patente no encontrada';
          
              vehiculosSnapshot.forEach(doc => {
                  const vehiculoData = doc.data();
                  if (vehiculoData.userId === userUid) {
                      ultimaPatente = vehiculoData.patente;
                  }
              });
          
              return ultimaPatente;
          }
          const ultimaPatente = await obtenerUltimaPatente(user.uid);
          console.log('Última patente encontrada:', ultimaPatente);
          await addDoc(collection(db, 'reservas'), {
              lugar: lugarSeleccionado.toString(),
              hora_inicio: startTime,
              hora_fin: endTime,
              patente: ultimaPatente,
              timestamp: new Date(),
              uid: user.uid,
              usuario: userName,
              activa: false
          });

        const lugarDocRef = doc(db, 'lugares_meyer', lugarSeleccionado.toString());
        await setDoc(lugarDocRef, { disponible: false });

          const message = `Estimado ${userName}, su reserva fue realizada con éxito en el estacionamiento ${lugarSeleccionado} desde ${startTime} hasta ${endTime}.`;
          showDialog('Reserva Exitosa', `${message}`);
          setTimeout(() => {
            // Redirigir a la página de reserva exitosa
            window.location.href = `reserva_exitosa.html?nombre=${encodeURIComponent(userName)}&lugar=${lugarSeleccionado}&hora_inicio=${startTime}&hora_fin=${endTime}`;
        }, 3000);
          fetchDisponibilidadLugares(); // Actualizar disponibilidad después de reservar
      } else {
          showDialog('Error en la reserva', 'Usuario no autenticado.');
      }
  } catch (error) {
      console.error("Error al realizar la reserva:", error);
      showDialog('Error en la reserva', 'No se pudo realizar la reserva. Inténtelo nuevamente.');
  }
}

function showDialog(title, message) {
    document.getElementById('dialog-title').innerText = title;
    document.getElementById('dialog-message').innerText = message;
    document.getElementById('dialog-overlay').style.display = 'flex';
}

function closeDialog() {
    document.getElementById('dialog-overlay').style.display = 'none';
}
