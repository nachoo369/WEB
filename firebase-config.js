import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDPQHtLTQCPoQSAROQHKpFcDN-xuKkYlzg",
    authDomain: "tallerii-4104d.firebaseapp.com",
    projectId: "tallerii-4104d",
    storageBucket: "tallerii-4104d.appspot.com",
    messagingSenderId: "809208530029",
    appId: "1:809208530029:web:e823b1a85e167ec9cbab64",
    measurementId: "G-0E1TRG4GFF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export const db = firebase.firestore()
const db = getFirestore(app); // Inicializar Firestore

// Hacer Firebase accesible globalmente
window.firebaseAuth = auth;

// Función para registrar al usuario
window.registrar = function(event) {
    event.preventDefault();

    var nombre = document.getElementById("nombre").value;
    var telefono = document.getElementById("telefono").value;
    var correo = document.getElementById("correo").value;
    var contrasena = document.getElementById("contrasena").value;

    var auth = window.firebaseAuth;
    if (!auth) {
        console.error("Firebase Auth no está inicializado correctamente.");
        return;
    }

    createUserWithEmailAndPassword(auth, correo, contrasena)
        .then((userCredential) => {
            var user = userCredential.user;
            console.log("Usuario registrado:", user);
            document.getElementById("mensajeReserva").textContent = "Usuario registrado con éxito.";
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000); // 3s
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Error al registrar el usuario:", errorCode, errorMessage);
            document.getElementById("mensajeReserva").textContent = `Error: ${errorMessage}`;
        });

        
        function guardarVehiculo(event) {
            event.preventDefault(); // Prevenir envío por defecto del formulario
          
            // Obtener valores del formulario
            const marca = document.getElementById('marca').value;
            const patente = document.getElementById('patente').value;
            const color = document.getElementById('color').value;
          
            // Validar que los campos no estén vacíos
            if (marca === '' || patente === '' || color === '') {
              alert('Por favor completa todos los campos.');
              return;
            }
          
            // Guardar en Firestore
            addDoc(collection(db, "vehiculos"), {
              marca: marca,
              patente: patente,
              color: color
            })
            .then(function(docRef) {
              console.log("Vehículo registrado con ID: ", docRef.id);
              alert('Vehículo registrado correctamente.');
              // Puedes añadir más lógica aquí después de guardar
            })
            .catch(function(error) {
              console.error("Error al agregar vehículo: ", error);
              alert('Hubo un error al registrar el vehículo. Por favor intenta nuevamente.');
            });
          
            // Limpiar formulario después de guardar
            document.getElementById("vehicleForm").reset();
        }
        
        // Event listener para el envío del formulario
        document.getElementById("vehicleForm").addEventListener("submit", guardarVehiculo);
    onAuthStateChanged(auth, (user) => {
        if (user) {
        // User is signed in, you can access user details here
        console.log("User is signed in");
        const uid = user.uid;
        // Additional logic for signed-in user
        } else {
        // User is signed out
        console.log("User is not signed in");
        // Additional logic for signed-out user
        }
    }  
)}