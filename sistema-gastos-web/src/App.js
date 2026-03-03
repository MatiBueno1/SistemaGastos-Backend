import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [transacciones, setTransacciones] = useState([]);
  const [categorias, setCategorias] = useState([]); // Necesitamos las categorías para el desplegable

  // Estado para capturar los datos del formulario
  const [nuevoGasto, setNuevoGasto] = useState({
    monto: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    categoriaId: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    // Pedimos las dos cosas al mismo tiempo
    axios.get('http://localhost:5181/api/Transacciones').then(r => setTransacciones(r.data));
    axios.get('http://localhost:5181/api/Categorias').then(r => setCategorias(r.data));
  };

  // Función para manejar el envío del formulario
  const guardarGasto = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Enviamos el objeto al endpoint POST de C#
    axios.post('http://localhost:5181/api/Transacciones', nuevoGasto)
      .then(() => {
        alert("¡Gasto guardado!");
        cargarDatos(); // Recargamos la tabla para ver el nuevo gasto
        setNuevoGasto({ monto: '', descripcion: '', fecha: new Date().toISOString().split('T')[0], categoriaId: '' }); // Limpiamos el form
      })
      .catch(error => console.error("Error al guardar:", error));
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px', margin: 'auto' }}>
      <h1>💸 Gestión de Gastos</h1>

      {/* --- FORMULARIO PARA CARGAR GASTOS --- */}
      <form onSubmit={guardarGasto} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Registrar nuevo gasto</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <input 
            type="number" placeholder="Monto" required
            value={nuevoGasto.monto} 
            onChange={(e) => setNuevoGasto({...nuevoGasto, monto: e.target.value})} 
          />
          <input 
            type="text" placeholder="Descripción" required
            value={nuevoGasto.descripcion} 
            onChange={(e) => setNuevoGasto({...nuevoGasto, descripcion: e.target.value})} 
          />
          <input 
            type="date" required
            value={nuevoGasto.fecha} 
            onChange={(e) => setNuevoGasto({...nuevoGasto, fecha: e.target.value})} 
          />
          <select 
            required
            value={nuevoGasto.categoriaId}
            onChange={(e) => setNuevoGasto({...nuevoGasto, categoriaId: e.target.value})}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat.categoriaId} value={cat.categoriaId}>{cat.nombre}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
            Guardar Gasto
          </button>
        </div>
      </form>

      {/* --- TABLA DE RESULTADOS --- */}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {transacciones.map(t => (
            <tr key={t.transaccionId}>
              <td>{new Date(t.fecha).toLocaleDateString()}</td>
              <td>{t.descripcion}</td>
              <td>{t.categoria?.nombre}</td>
              <td style={{ color: 'red', fontWeight: 'bold' }}>${t.monto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;