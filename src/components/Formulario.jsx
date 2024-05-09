import Mensajes from './Mensajes';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const Formulario = ({ setEstado, idMetro }) => {
  const [error, setError] = useState(false);
  const [mensaje, setMensaje] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    sector: '',
    salida: '',
    llegada: '',
    maquinista: '',
    detalles: '',
  });
  //Efecto que se ejecuta cuando se da click en actualizar una ruta, en el componente listar
  useEffect(() => {
    if (idMetro) {
      (async function (idMetro) {
        try {
          const respuesta = await (
            await fetch(
              `https://apimetro-production.up.railway.app/api/metro/${idMetro}`
            )
          ).json();
          const { _id, nombre, sector, salida, llegada, maquinista, detalles } =
            respuesta.data;
          setForm({
            ...form,
            nombre,
            sector,
            salida,
            llegada,
            maquinista,
            detalles,
            _id,
          });
        } catch (error) {
          console.log(error);
        }
      })(idMetro);
    }
  }, [idMetro]);
  //evento que actua cuando se preciona click en registrar ruta
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).includes('') || Object.entries(form).length == 0) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
      return;
    }
    try {
      if (form._id) {
        const URL = `https://apimetro-production.up.railway.app/api/metro/${form._id}`;
        await fetch(URL, {
          method: 'PUT',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' },
        });
        setEstado(true);
        setForm({});
        setTimeout(() => {
          setEstado(false);
          setForm({});
        }, 1000);
        console.log('Ruta actualizada');
      } else {
        //se declara la url del API
        const URL = `https://apimetro-production.up.railway.app/api/metro`;
        //se asigna un identificador unico a cada formulario
        //form.id = uuidv4();
        //solicitud a la url con fetch
        await fetch(URL, {
          //se especifica el tipo de solicitud
          method: 'POST',
          //se convierte el objeto form en un objeto tipo JSON para hacerlo el cuerpo de la solicitud
          body: JSON.stringify(form),
          // establece los encabezados de la solicitud
          headers: { 'Content-Type': 'application/json' },
        });
        setMensaje(true);
        setEstado(true);
        setTimeout(() => {
          setMensaje(false);
          setEstado(false);
          setForm({});
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    // actualiza el valor del estado form, con los que ingresa el usuario
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Mensajes tipo={'bg-red-900'}>validar campos</Mensajes>
      <div>
        <label
          htmlFor="nombre"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Nombre:{' '}
        </label>
        <input
          id="nombre"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Nombre de la ruta"
          name="nombre"
          value={form.nombre || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="sector"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Sector:{' '}
        </label>
        <input
          id="sector"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Sector de la ruta"
          name="sector"
          value={form.sector || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="salida"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Punto de salida:{' '}
        </label>
        <input
          id="salida"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Punto de salida"
          name="salida"
          value={form.salida || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="llegada"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Punto de llegada:{' '}
        </label>
        <input
          id="llegada"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Punto de llegada"
          name="llegada"
          value={form.llegada || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="maquinista"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Nombre del maquinista:{' '}
        </label>
        <input
          id="maquinista"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Nombre del maquinista"
          name="maquinista"
          value={form.maquinista || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="detalles"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Detalles:{' '}
        </label>
        <textarea
          id="detalles"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          name="detalles"
          value={form.detalles || ''}
          onChange={handleChange}
        />
      </div>
      {error && <Mensajes tipo="bg-red-900">"Existen campos vacios"</Mensajes>}
      {mensaje && <Mensajes tipo="bg-green-900">"Registro existoso"</Mensajes>}
      <input
        type="submit"
        className="bg-sky-900 w-full p-3
        text-white uppercase font-bold rounded-lg
        hover:bg-red-900 cursor-pointer transition-all"
        value={form._id ? 'Actualizar ruta' : 'Registrar ruta'}
      />
    </form>
  );
};
