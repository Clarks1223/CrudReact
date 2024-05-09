import logoMetro from '../assets/tren.webp';
import Mensajes from './Mensajes';
import { useState, useEffect } from 'react';

const Listar = ({ estado, setIdMetro }) => {
  //Declaro los estados
  const [rutas, setRutas] = useState([]);
  const [eliminado, setEliminado] = useState(false);
  //Efecto para cargar todos los datos de la BD
  useEffect(() => {
    if (estado || rutas.length >= 0) {
      (async function () {
        try {
          const respuesta = await (
            await fetch('https://apimetro-production.up.railway.app/api/metro')
          ).json();
          setRutas(respuesta.data);
          //console.log('Lo que llega ahora', respuesta.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [estado, eliminado]);
  // eliminar una ruta
  const handleDelete = async (id) => {
    try {
      //alerta al usuario si desea eliminar las rutas
      const confirmar = confirm(
        'Quieres eliminar la ruta, esta accion no se puede revertir'
      );
      //si la confirmacion es positiva
      if (confirmar) {
        //realiza el fetch con el metodo delte
        const URL = `https://apimetro-production.up.railway.app/api/metro/${id}`;
        //se realiza el fech para eliminar la ruta
        await fetch(URL, { method: 'DELETE' });
        //crea un nuevo arreglo con las rutas y saca la ruta que se elimino
        const nuevasRutas = rutas.filter((ruta) => ruta._id !== id);
        //guarda las rutas
        setRutas(nuevasRutas);
        //actualiza las rutas
        alert('Ruta eliminada');
        setEliminado(!eliminado);
      }
    } catch (error) {
      console.log('No se ha eliminado la ruta');
    }
  };
  return (
    <>
      {rutas.length === 0 ? (
        <Mensajes tipo={'bg-green-900'}>"No existe rutas creadas"</Mensajes>
      ) : (
        rutas.map((ruta) => (
          <div
            key={ruta._id}
            className="p-2 rounded-xl sm:flex gap-12 bg-gray-200 shadow-xl mb-5"
          >
            <img
              src={logoMetro}
              alt="art cover"
              className="sm:w-3/12 object-cover rounded-lg"
            />

            <div className="h-auto p-3 w-full">
              <h4 className="text-2xl font-semibold text-cyan-900">
                {ruta.nombre}
              </h4>
              <hr className="w-full border border-gray-300 my-2" />
              <p className="text-gray-500">Sector: {ruta.sector}</p>
              <p className="text-gray-500">Punto de salida: {ruta.salida}</p>
              <p className="text-gray-500">Punto de llegada: {ruta.llegada}</p>
              <p className="text-gray-500">Maquinista: {ruta.maquinista}</p>
              <p className="text-gray-500">Detalles: {ruta.detalles}</p>
              <div className="flex justify-between mt-3 lg:justify-end md:justify-end gap-3">
                <button
                  className="bg-sky-900 text-white px-6 py-1 rounded-full"
                  onClick={() => {
                    setIdMetro(ruta._id);
                  }}
                >
                  Actualizar
                </button>
                <button
                  className="bg-red-900 text-white px-6 py-1 rounded-full"
                  onClick={() => {
                    handleDelete(ruta._id);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default Listar;
