import { useEffect, useState } from "react";
import {
  obtenerLibros,
  agregarLibro,
  actualizarLibro,
  eliminarLibro
} from "./api";

function App() {
  const [libros, setLibros] = useState([]);

  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const [modoOscuro, setModoOscuro] = useState(false);

  const [formulario, setFormulario] = useState({
    id: "",
    titulo: "",
    autor: "",
    anio: "",
    disponible: true
  });

  const [editando, setEditando] = useState(false);

  const cargarLibros = async () => {
    const data = await obtenerLibros();
    setLibros(data);
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const validar = () => {
    if (
      !formulario.id ||
      !formulario.titulo ||
      !formulario.autor ||
      !formulario.anio
    ) {
      setMensaje("Todos los campos son obligatorios");
      return false;
    }

    if (parseInt(formulario.anio) < 1900) {
      setMensaje("El año debe ser mayor o igual a 1900");
      return false;
    }

    return true;
  };

  const guardarLibro = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const libro = {
      ...formulario,
      id: parseInt(formulario.id),
      anio: parseInt(formulario.anio)
    };

    if (editando) {
      await actualizarLibro(libro.id, libro);
      setMensaje("Libro actualizado correctamente");
    } else {
      await agregarLibro(libro);
      setMensaje("Libro agregado correctamente");
    }

    limpiarFormulario();
    cargarLibros();
  };

  const editarLibro = (libro) => {
    setFormulario(libro);
    setEditando(true);
  };

  const borrarLibro = async (id) => {
    if (window.confirm("¿Desea eliminar este libro?")) {
      await eliminarLibro(id);
      setMensaje("Libro eliminado correctamente");
      cargarLibros();
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      id: "",
      titulo: "",
      autor: "",
      anio: "",
      disponible: true
    });

    setEditando(false);
  };

  const librosFiltrados = libros.filter((libro) =>
    libro.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mt-5">

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2>📚 Sistema de Biblioteca</h2>
        </div>

        <div className="card-body">

          {mensaje && (
            <div className="alert alert-info">
              {mensaje}
            </div>
          )}
          
          <form onSubmit={guardarLibro}>
            <div className="row">

              <div className="col-md-2 mb-3">
                <input
                  type="number"
                  name="id"
                  className="form-control"
                  placeholder="ID"
                  value={formulario.id}
                  onChange={handleChange}
                  disabled={editando}
                />
              </div>

              <div className="col-md-3 mb-3">
                <input
                  type="text"
                  name="titulo"
                  className="form-control"
                  placeholder="Título"
                  value={formulario.titulo}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3 mb-3">
                <input
                  type="text"
                  name="autor"
                  className="form-control"
                  placeholder="Autor"
                  value={formulario.autor}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-2 mb-3">
                <input
                  type="number"
                  name="anio"
                  className="form-control"
                  placeholder="Año"
                  value={formulario.anio}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-2 mb-3 d-flex align-items-center">
                <input
                  type="checkbox"
                  name="disponible"
                  checked={formulario.disponible}
                  onChange={handleChange}
                />

                <label className="ms-2">
                  Disponible
                </label>
              </div>
            </div>

            <button
              className={`btn ${
                editando ? "btn-warning" : "btn-success"
              }`}
            >
              {editando ? "Actualizar" : "Agregar"}
            </button>

            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={limpiarFormulario}
            >
              Limpiar
            </button>
          </form>

          <hr />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="🔍 Buscar por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Año</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {librosFiltrados.map((libro) => (
                  <tr key={libro.id}>
                    <td>{libro.id}</td>
                    <td>{libro.titulo}</td>
                    <td>{libro.autor}</td>
                    <td>{libro.anio}</td>

                    <td>
                      {libro.disponible ? (
                        <span className="badge bg-success">
                          Disponible
                        </span>
                      ) : (
                        <span className="badge bg-danger">
                          No disponible
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editarLibro(libro)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => borrarLibro(libro.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {librosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No se encontraron libros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;