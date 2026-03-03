import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import dayjs from 'dayjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const ICONOS = {
  "sueldo": "💵", "comida": "🍔", "transporte": "🚌", "alquiler": "🏠",
  "servicios": "⚡", "ocio": "🎬", "salud": "🏥", "educación": "📚", "otros": "📦"
};

function App() {
  const API_URL = "http://localhost:5181/api";

  const [transacciones, setTransacciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mesFiltro, setMesFiltro] = useState((dayjs().month() + 1).toString());
  const [montoVisual, setMontoVisual] = useState("");

  const [nuevoGasto, setNuevoGasto] = useState({
    monto: 0, descripcion: '', fecha: dayjs().format('YYYY-MM-DD'), categoriaId: 0
  });

  // Función única de carga
  const cargarDatos = async () => {
    try {
      const resT = await axios.get(`${API_URL}/Transacciones`);
      const resC = await axios.get(`${API_URL}/Categorias`);
      setTransacciones(resT.data);
      setCategorias(resC.data);
      console.log("Categorías cargadas desde la API:", resC.data.length);
    } catch (e) {
      console.error("Error conectando a la API");
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const guardarGasto = async (e) => {
    e.preventDefault();
    if (nuevoGasto.categoriaId === 0) return alert("Seleccioná categoría");
    
    try {
      await axios.post(`${API_URL}/Transacciones`, {
        ...nuevoGasto,
        categoriaId: parseInt(nuevoGasto.categoriaId)
      });
      setMontoVisual("");
      setNuevoGasto({ monto: 0, descripcion: '', fecha: dayjs().format('YYYY-MM-DD'), categoriaId: 0 });
      cargarDatos();
    } catch (e) { alert("Error al guardar"); }
  };

  const transaccionesFiltradas = transacciones.filter(t => (dayjs(t.fecha).month() + 1).toString() === mesFiltro);
  
  const totalIngresos = transaccionesFiltradas.filter(t => t.categoria?.nombre?.toLowerCase().includes("sueldo")).reduce((acc, t) => acc + t.monto, 0);
  const totalGastos = transaccionesFiltradas.filter(t => !t.categoria?.nombre?.toLowerCase().includes("sueldo")).reduce((acc, t) => acc + t.monto, 0);

  const datosGrafico = transaccionesFiltradas.filter(t => !t.categoria?.nombre?.toLowerCase().includes("sueldo")).reduce((acc, t) => {
    const nom = t.categoria?.nombre || "Otros";
    acc[nom] = (acc[nom] || 0) + t.monto;
    return acc;
  }, {});

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded">
        <h2 className="fw-bold m-0">WalletFlow 🚀</h2>
        <button onClick={cargarDatos} className="btn btn-sm btn-outline-primary">🔄 Recargar Todo</button>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm mb-4">
            <h5>Nuevo Registro</h5>
            <form onSubmit={guardarGasto}>
              <input className="form-control mb-2" placeholder="Monto" value={montoVisual} onChange={e => {
                const val = e.target.value.replace(/\D/g, "");
                setMontoVisual(new Intl.NumberFormat('de-DE').format(val));
                setNuevoGasto({...nuevoGasto, monto: parseFloat(val) || 0});
              }} required />
              <input className="form-control mb-2" placeholder="Detalle" value={nuevoGasto.descripcion} onChange={e => setNuevoGasto({...nuevoGasto, descripcion: e.target.value})} required />
              <input type="date" className="form-control mb-2" value={nuevoGasto.fecha} onChange={e => setNuevoGasto({...nuevoGasto, fecha: e.target.value})} />
              <select className="form-select mb-3" value={nuevoGasto.categoriaId} onChange={e => setNuevoGasto({...nuevoGasto, categoriaId: e.target.value})} required>
                <option value="0">Seleccionar categoría...</option>
                {categorias.map(c => (
                  <option key={c.categoriaId} value={c.categoriaId}>
                    {ICONOS[c.nombre.toLowerCase()] || "📦"} {c.nombre}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary w-100">Guardar</button>
            </form>
          </div>
          <div className="card p-3 shadow-sm">
            <h6 className="text-center">GASTOS</h6>
            {Object.keys(datosGrafico).length > 0 ? <Pie data={{
              labels: Object.keys(datosGrafico),
              datasets: [{ data: Object.values(datosGrafico), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }]
            }} /> : <p className="small text-center text-muted">Sin datos</p>}
          </div>
        </div>

        <div className="col-md-8">
          <div className="row mb-3 text-center">
            <div className="col-4"><div className="bg-white p-2 shadow-sm rounded">Ingresos: <b className="text-success">${totalIngresos}</b></div></div>
            <div className="col-4"><div className="bg-white p-2 shadow-sm rounded">Gastos: <b className="text-danger">${totalGastos}</b></div></div>
            <div className="col-4"><div className="bg-white p-2 shadow-sm rounded">Neto: <b>${totalIngresos - totalGastos}</b></div></div>
          </div>

          <div className="card shadow-sm overflow-hidden">
            <div className="p-3 bg-light d-flex justify-content-between">
              <b>Movimientos</b>
              <select className="form-select w-auto form-select-sm" value={mesFiltro} onChange={e => setMesFiltro(e.target.value)}>
                {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <table className="table table-hover mb-0">
              <thead><tr><th>Fecha</th><th>Detalle</th><th>Categoría</th><th className="text-end">Monto</th></tr></thead>
              <tbody>
                {transaccionesFiltradas.map(t => (
                  <tr key={t.transaccionId}>
                    <td>{dayjs(t.fecha).format('DD/MM')}</td>
                    <td>{t.descripcion}</td>
                    <td>{ICONOS[t.categoria?.nombre.toLowerCase()] || "💰"} {t.categoria?.nombre}</td>
                    <td className="text-end">${t.monto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;