// Inicializar Firebase si no está inicializado
if (!firebase.apps.length) {
    const firebaseConfig = {
        apiKey: "AIzaSyDPQHtLTQCPoQSAROQHKpFcDN-xuKkYlzg",
        authDomain: "tallerii-4104d.firebaseapp.com",
        projectId: "tallerii-4104d",
        storageBucket: "tallerii-4104d.appspot.com",
        messagingSenderId: "809208530029",
        appId: "1:809208530029:web:e823b1a85e167ec9cbab64",
        measurementId: "G-0E1TRG4GFF"
    };
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

console.log("Conexión a Firebase establecida correctamente.");

// Función para verificar si el usuario está autenticado
function checkAuth() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            console.log('El usuario está autenticado:', user.uid);
            // Verificar en Firestore si el usuario existe en la colección 'users'
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        console.log('El usuario existe en Firestore.');
                    } else {
                        console.log('El usuario no existe en Firestore.');
                    }
                })
                .catch((error) => {
                    console.error('Error al consultar Firestore:', error);
                });
        } else {
            console.log('El usuario no está autenticado.');
        }
    });
}

// Llamar a la función para verificar la autenticación
checkAuth();


// Función para manejar el envío del formulario
function submitForm(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const color = document.getElementById('color').value;
    const modelo = document.getElementById('modelo').value;
    const patente = document.getElementById('patente').value;

    // Obtener usuario actual
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error('Usuario no autenticado.');
        return;
    }

    // Objeto con datos del vehículo
    const vehiculoData = {
        color: color,
        modelo: modelo,
        patente: patente,
        userId: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Agregar vehículo a la colección vehiculos
    db.collection('vehiculos').add(vehiculoData)
        .then((docRef) => {
            console.log('Vehículo registrado con ID: ', docRef.id);
            showDialog('Éxito', 'Vehículo registrado correctamente.');
            setTimeout(() => {
                window.location.href = 'sede.html';
            }, 3000);
        })
        .catch((error) => {
            console.error('Error al registrar vehículo: ', error);
            showDialog('Error', 'Hubo un problema al registrar el vehículo.');
        });
}

// Función para mostrar un cuadro de diálogo
function showDialog(title, message) {
    const dialogOverlay = document.getElementById('dialog-overlay');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogMessage = document.getElementById('dialog-message');

    dialogTitle.textContent = title;
    dialogMessage.textContent = message;

    dialogOverlay.style.display = 'block';

    const closeButton = document.getElementById('dialog-close-btn');
    closeButton.addEventListener('click', () => {
        dialogOverlay.style.display = 'none';
    });
}