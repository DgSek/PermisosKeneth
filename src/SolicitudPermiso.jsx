import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker'; // Importa el componente
import 'react-datepicker/dist/react-datepicker.css'; // Importa los estilos
import './SolicitudPermiso.css';

const SolicitudPermiso = () => {
  const location = useLocation();
  const { id_usuario, nombre, puesto: puestoEmpleado } = location.state || {};

  const [motivoFalta, setMotivoFalta] = useState('');
  const [nombreJefe, setNombreJefe] = useState('');
  const [puestoJefe, setPuestoJefe] = useState('');
  const [horarioLaboral, setHorarioLaboral] = useState('');
  const [fecha, setFecha] = useState('');
  const [autorizacion, setAutorizacion] = useState('');
  const [tipoPermiso, setTipoPermiso] = useState('');
  const [jefeAutoriza, setJefeAutoriza] = useState('');
  const [diasSolicitados, setDiasSolicitados] = useState([null, null]); // Selección de rango de fechas
  const [archivosAdjuntos, setArchivosAdjuntos] = useState([]);
  const [puesto, setPuesto] = useState(puestoEmpleado || '');

  useEffect(() => {
    if (!puesto && id_usuario) {
      const obtenerPuesto = async () => {
        try {
          const empleadoDoc = await getDoc(doc(db, 'empleados', id_usuario));
          if (empleadoDoc.exists()) {
            setPuesto(empleadoDoc.data().puesto || '');
          }
        } catch (error) {
          console.error("Error al obtener el puesto del empleado:", error);
        }
      };
      obtenerPuesto();
    }
  }, [id_usuario, puesto]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setArchivosAdjuntos((prevFiles) => [...prevFiles, ...files]);
  };

  const resetForm = () => {
    setMotivoFalta('');
    setNombreJefe('');
    setPuestoJefe('');
    setHorarioLaboral('');
    setFecha('');
    setAutorizacion('');
    setTipoPermiso('');
    setJefeAutoriza('');
    setDiasSolicitados([null, null]);
    setArchivosAdjuntos([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'solicitud'), {
        id_usuario,
        nombre_empleado: nombre,
        puesto_empleado: puesto,
        motivo_falta: motivoFalta,
        nombre_jefe_inmediato: nombreJefe,
        puesto_jefe_inmediato: puestoJefe,
        horario_laboral: horarioLaboral,
        fecha_solicitud: fecha,
        dias_solicitados: {
          inicio: diasSolicitados[0] ? diasSolicitados[0].toISOString().split('T')[0] : null,
          fin: diasSolicitados[1] ? diasSolicitados[1].toISOString().split('T')[0] : null,
        },
        autorizacion_goce_sueldo: autorizacion,
        tipo_permiso: tipoPermiso,
        jefe_autoriza_permiso: jefeAutoriza,
        archivos_adjuntos: archivosAdjuntos.map((file) => file.name),
      });
      alert('Solicitud enviada exitosamente');
      resetForm();
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert('Error al enviar la solicitud');
    }
  };

  return (
    <div className="solicitud-permiso">
      <h2>Solicitud de Permiso</h2>
      <p>Ingresa los datos que se solicitan</p>
      <form
        className="form-permiso"
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        }}
      >
        <div className="form-group">
          <label>Nombre del empleado</label>
          <input type="text" value={nombre || ''} readOnly />
          <label>Motivo de la falta</label>
          <input type="text" value={motivoFalta} onChange={(e) => setMotivoFalta(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Puesto del empleado</label>
          <input type="text" value={puesto} readOnly />
          <label>Nombre del jefe inmediato</label>
          <input type="text" value={nombreJefe} onChange={(e) => setNombreJefe(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Horario de trabajo</label>
          <input type="text" value={horarioLaboral} onChange={(e) => setHorarioLaboral(e.target.value)} />
          <label>Puesto del jefe inmediato</label>
          <input type="text" value={puestoJefe} onChange={(e) => setPuestoJefe(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fecha de la solicitud</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <label>Selecciona autorización</label>
          <select value={autorizacion} onChange={(e) => setAutorizacion(e.target.value)}>
            <option value="">Selecciona</option>
            <option value="Con goce de sueldo">Con goce de sueldo</option>
            <option value="Sin goce de sueldo">Sin goce de sueldo</option>
          </select>
        </div>
        <div className="form-group">
          <label>Selecciona un tipo de permiso</label>
          <select value={tipoPermiso} onChange={(e) => setTipoPermiso(e.target.value)}>
            <option value="">Selecciona</option>
            <option value="Sindical">Sindical</option>
            <option value="Personal">Personal</option>
          </select>
          <label>Jefe que autoriza el permiso</label>
          <input type="text" value={jefeAutoriza} onChange={(e) => setJefeAutoriza(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Días solicitados (Rango)</label>
          <DatePicker
            className="datepicker-range" /* Añadimos la clase CSS */
            selectsRange
            startDate={diasSolicitados[0]}
            endDate={diasSolicitados[1]}
            onChange={(update) => setDiasSolicitados(update)}
            isClearable
            placeholderText="Selecciona un rango de fechas"
          />
        </div>
        <div className="botones-container">
          <label className="btn-adjuntar">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            Adjuntar archivo
          </label>
          <button type="submit" className="btn-enviar">Enviar</button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudPermiso;