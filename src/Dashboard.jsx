import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Importar los estilos

const Dashboard = () => {
  const location = useLocation();
  const userData = location.state?.userData; // Recibe los datos del usuario
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Redirige al login al cerrar sesión
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">Bienvenido al Dashboard</h1>
        {userData ? (
          <div>
            <p className="dashboard-user-info">
              <strong>Nombre:</strong> {userData.nombre}
            </p>
            <p className="dashboard-user-info">
              <strong>Email:</strong> {userData.correo}
            </p>
            <p className="dashboard-user-info">
              <strong>Tipo de Usuario:</strong> {userData.tipo_usuario}
            </p>
            {/* Añadir más información si es necesario */}
          </div>
        ) : (
          <p>No se encontró información adicional del usuario.</p>
        )}
        <button className="dashboard-logout" onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Dashboard;
