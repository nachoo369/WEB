import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, sendEmailVerification} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

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
            const auth = getAuth();
            console.log("Usuario registrado:", user);

            // Envía el correo de verificación después de registrar al usuario
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    console.log("correo enviado")
                }).catch((error) => {
                    console.log("no funca")
                })
        })
        .then(() => {
            console.log("Correo de verificación enviado correctamente");
            document.getElementById("mensajeReserva").textContent = "Usuario registrado con éxito. Verifica tu correo electrónico.";
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000); // Redirige a la página de login después de 3 segundos
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Error al registrar el usuario:", errorCode, errorMessage);
            document.getElementById("mensajeReserva").textContent = `Error: ${errorMessage}`;
        });
}


//function verificarCorreo(){
    //var user = firebase.auth().currentUser;
    //user.sendEmailVerification().then(function(){
   //     console.log("correo enviado")

   // }).catch(function(error){
   //     console.log("no se envio")
   // });
//}

