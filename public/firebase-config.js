import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Configuración de Firebase
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
const auth = getAuth(app);
const db = getFirestore(app);

// Hacer Firebase accesible globalmente
window.firebaseAuth = auth;
window.firebaseDb = db;

// Función para registrar al usuario
window.registrar = function() {
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    const auth = window.firebaseAuth;
    if (!auth) {
        console.error("Firebase Auth no está inicializado correctamente.");
        return;
    }

    createUserWithEmailAndPassword(auth, correo, contrasena)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuario registrado:", user);

            // Envía el correo de verificación después de registrar al usuario
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    console.log("Correo de verificación enviado");
                    document.getElementById("mensajeReserva").textContent = "Usuario registrado con éxito. Verifica tu correo electrónico.";

                    // Guardar información adicional en Firestore
                    return addDoc(collection(db, 'users'), {
                        userId: user.uid,
                        name: nombre,
                        telefono: telefono,
                        correo: correo,
                        createdAt: new Date().toISOString()
                    });
                })
                .then(() => {
                    console.log("Información adicional guardada en Firestore");
                    // Redirige a la página de login después de 3 segundos
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 3000);
                })
                .catch((error) => {
                    console.error("Error al enviar correo de verificación:", error);
                    document.getElementById("mensajeReserva").textContent = "Error al enviar correo de verificación: " + error.message;
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error al registrar el usuario:", errorCode, errorMessage);
            document.getElementById("mensajeReserva").textContent = "Error al registrar el usuario: " + errorMessage;
        });
};

// Función para validar la confirmación de contraseña
function validarConfirmacionContrasena() {
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;

    if (contrasena !== confirmarContrasena) {
        document.getElementById('confirmarContrasena').setCustomValidity('Las contraseñas no coinciden');
    } else {
        document.getElementById('confirmarContrasena').setCustomValidity('');
    }
}
