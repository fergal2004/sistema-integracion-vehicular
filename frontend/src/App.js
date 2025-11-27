import React, { useState } from 'react';
import { Search, Car, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Datos del formulario
  const [formData, setFormData] = useState({ email: '', ruc: '', placa: '' });
  
  // Datos de respuesta
  const [contribuyente, setContribuyente] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);
  const [puntos, setPuntos] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Paso 1: Verificar RUC (SRI)
  const verificarRuc = async () => {
    if (!formData.ruc || !formData.email) {
      setError("Ingrese RUC y Email"); return;
    }
    setLoading(true); setError('');
    
    try {
      // Simulamos la respuesta del backend
      await new Promise(r => setTimeout(r, 1000));
      const mockData = { nombre: "JUAN PEREZ", tipo: "PERSONA NATURAL", valido: true };
      
      if (mockData.valido && mockData.tipo === "PERSONA NATURAL") {
        setContribuyente(mockData);
        setStep(2);
      } else {
        setError("El RUC no es válido o no es Persona Natural.");
      }
    } catch (err) {
      setError("Error de conexión con el servicio SRI.");
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Consultar Vehículo (SRI) y Puntos (ANT Cache)
  const consultarFinal = async () => {
    if (!formData.placa) {
      setError("Ingrese la placa"); return;
    }
    setLoading(true); setError('');

    try {
      // Simulación de llamadas al Backend
      await new Promise(r => setTimeout(r, 1500));
      
      setVehiculo({ marca: "TOYOTA", modelo: "COROLLA", anio: 2022, placa: formData.placa });
      setPuntos({ total: 30, estado: "Recuperado desde Caché (ANT)" }); 
      
      setStep(3);
    } catch (err) {
      setError("Error consultando datos vehiculares.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">Consulta Unificada</h1>
          <p className="text-gray-500 text-sm">Integración SRI + ANT</p>
        </div>

        {/* Barra de Progreso */}
        <div className="flex justify-between mb-8 px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} style={{height: '8px', flex: 1, margin: '0 4px', borderRadius: '99px', backgroundColor: s <= step ? '#2563EB' : '#E5E7EB'}}></div>
          ))}
        </div>

        {/* Paso 1: RUC y Email */}
        {step === 1 && (
          <div className="space-y-4">
            <div style={{marginBottom: '1rem'}}>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input type="email" name="email" style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.5rem', marginTop: '0.25rem'}} placeholder="usuario@mail.com" onChange={handleInputChange} />
            </div>
            <div style={{marginBottom: '1rem'}}>
              <label className="block text-sm font-medium text-gray-700">RUC (Persona Natural)</label>
              <input type="text" name="ruc" style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.5rem', marginTop: '0.25rem'}} placeholder="1712345678001" onChange={handleInputChange} />
            </div>
            <button onClick={verificarRuc} disabled={loading} style={{width: '100%', backgroundColor: '#2563EB', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center'}}>
              {loading ? <Loader className="animate-spin" /> : "Verificar Contribuyente"}
            </button>
          </div>
        )}

        {/* Paso 2: Placa */}
        {step === 2 && (
          <div className="space-y-6">
            <div style={{backgroundColor: '#F0FDF4', padding: '1rem', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem', border: '1px solid #DCFCE7', marginBottom: '1rem'}}>
              <CheckCircle color="#16A34A" />
              <div>
                <p style={{fontWeight: 'bold', color: '#166534', margin: 0}}>Contribuyente Verificado</p>
                <p style={{fontSize: '0.875rem', color: '#15803D', margin: 0}}>{contribuyente?.nombre}</p>
              </div>
            </div>
            
            <div style={{marginBottom: '1rem'}}>
              <label className="block text-sm font-medium text-gray-700">Matrícula / Placa</label>
              <input type="text" name="placa" style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.5rem', marginTop: '0.25rem', textTransform: 'uppercase'}} placeholder="ABC-1234" onChange={handleInputChange} />
            </div>
            
            <button onClick={consultarFinal} disabled={loading} style={{width: '100%', backgroundColor: '#4F46E5', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center'}}>
              {loading ? <Loader className="animate-spin" /> : "Consultar Vehículo y Puntos"}
            </button>
          </div>
        )}

        {/* Paso 3: Resultados */}
        {step === 3 && (
          <div className="space-y-4">
            <div style={{backgroundColor: 'white', border: '1px solid #eee', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#4338CA', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '0.5rem'}}>
                <Car size={20} /> Información Vehicular
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem'}}>
                <span style={{color: '#6B7280'}}>Placa:</span> <span style={{fontWeight: '500'}}>{vehiculo?.placa}</span>
                <span style={{color: '#6B7280'}}>Marca:</span> <span style={{fontWeight: '500'}}>{vehiculo?.marca}</span>
                <span style={{color: '#6B7280'}}>Modelo:</span> <span style={{fontWeight: '500'}}>{vehiculo?.modelo}</span>
              </div>
            </div>

            <div style={{backgroundColor: 'white', border: '1px solid #eee', borderRadius: '0.5rem', padding: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#EA580C', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '0.5rem'}}>
                <AlertTriangle size={20} /> Puntos Licencia (ANT)
              </div>
              <div style={{textAlign: 'center', padding: '0.5rem'}}>
                <span style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#1F2937'}}>{puntos?.total}</span>
                <p style={{fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', marginTop: '0.25rem'}}>{puntos?.estado}</p>
              </div>
            </div>

            <button onClick={() => setStep(1)} style={{width: '100%', color: '#6B7280', fontSize: '0.875rem', marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>Nueva Consulta</button>
          </div>
        )}

        {error && <p style={{color: '#EF4444', fontSize: '0.875rem', textAlign: 'center', marginTop: '1rem', backgroundColor: '#FEF2F2', padding: '0.5rem', borderRadius: '0.25rem'}}>{error}</p>}
      </div>
    </div>
  );
}