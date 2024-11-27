import React from 'react';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './Respaldo.css';

const Respaldo = () => {
  //commit
  const handleCommit = async () => {
    try {
      //obtener los documentos de la colección 
      const solicitudSnapshot = await getDocs(collection(db, 'solicitud'));

      //copiar con el mismo ID
      solicitudSnapshot.forEach(async (docSnapshot) => {
        await setDoc(doc(db, 'respaldo', docSnapshot.id), docSnapshot.data());
      });

      alert('Respaldo completado exitosamente con los mismos IDs');
    } catch (error) {
      console.error("Error al realizar el respaldo:", error);
      alert('Error al realizar el respaldo');
    }
  };

  //rollback
  const handleRollback = async () => {
    try {
      // obtener los documentos de 'respaldo'
      const respaldoSnapshot = await getDocs(collection(db, 'respaldo'));

      // eliminar
      respaldoSnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, 'respaldo', docSnapshot.id));
      });

      alert('Rollback completado: todos los documentos en "respaldo" han sido eliminados');
    } catch (error) {
      console.error("Error al realizar el rollback:", error);
      alert('Error al realizar el rollback');
    }
  };

  return (
    <div className="respaldo-container">
      <h2>Respaldo de Datos</h2>
      <div className="button-container">
        <button className="respaldo-button commit" onClick={handleCommit}>
          Commit
        </button>
        <button className="respaldo-button rollback" onClick={handleRollback}>
          Rollback
        </button>
      </div>
    </div>
  );
};

export default Respaldo;
