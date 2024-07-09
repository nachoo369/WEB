import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';


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
const auth = getAuth(app);
document.addEventListener('DOMContentLoaded', async function() {
    const user = await verificarEstadoAutenticacion();

    if (user) {
        const reservas = await obtenerReservasUsuario(user.uid); // Obtener reservas del usuario actual

        const reservasBody = document.getElementById('reservas-body');
        reservas.forEach(reserva => {
            const reservaData = reserva.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reserva.id}</td>
                <td>${reservaData.usuario}</td>
                <td>${formatDate(reservaData.timestamp)}</td>
                <td>${reservaData.hora_inicio}</td>
                <td>${reservaData.hora_fin}</td>
                <td>${reservaData.lugar}</td>
                <td>${reservaData.patente}</td>
                <td>${reservaData.activa ? 'Activa' : 'Inactiva'}</td>
                <!-- Agrega más columnas según sea necesario -->
            `;
            reservasBody.appendChild(row);
        });
    } else {
        console.error('Usuario no autenticado');
        // Manejar el caso de usuario no autenticado, redirigir o mostrar un mensaje adecuado
    }
});

// Función para verificar el estado de autenticación del usuario
async function verificarEstadoAutenticacion() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, user => {
            resolve(user); // Devuelve el usuario si está autenticado, o null si no lo está
        });
    });
}

// Función para obtener las reservas del usuario desde Firestore
async function obtenerReservasUsuario(userId) {
    try {
        const q = query(collection(db, 'reservas'), where('uid', '==', userId));
        const reservasSnapshot = await getDocs(q);
        return reservasSnapshot.docs; // Devuelve los documentos de reservas encontrados
    } catch (error) {
        console.error('Error al obtener reservas del usuario:', error);
        return [];
    }
}

// Función para formatear la fecha según tus necesidades
function formatDate(timestamp) {
    const date = timestamp.toDate(); // Convertir el timestamp a objeto Date
    return date.toLocaleDateString('es-CL'); // Formato de fecha en español
}