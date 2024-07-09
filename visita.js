// Importar las librerías necesarias
const admin = require('firebase-admin');
// Obtener referencia a Firestore
const db = admin.firestore();

async function updateUsers() {
  // Referencia a la colección 'users'
  const usersRef = db.collection('users');

  try {
    // Obtener todos los documentos en la colección 'users'
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log('No se encontraron usuarios.');
      return;
    }

    // Iterar sobre cada documento
    snapshot.forEach(doc => {
      const userData = doc.data();
      // Verificar si el campo 'nombre' no existe o está vacío
      if (!userData.nombre || userData.nombre.trim() === '') {
        // Actualizar el campo 'nombre' con el valor 'Usuario Visita'
        doc.ref.update({ nombre: 'Usuario Visita' })
          .then(() => {
            console.log(`Usuario ${doc.id} actualizado a 'Usuario Visita'`);
          })
          .catch(error => {
            console.error(`Error actualizando el usuario ${doc.id}: `, error);
          });
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuarios: ', error);
  }
}

// Ejecutar la función de actualización
updateUsers();