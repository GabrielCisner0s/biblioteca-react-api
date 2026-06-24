const URL = "https://biblioteca-api.onrender.com/libros";

export const obtenerLibros = async () => {
  const res = await fetch(URL);
  return await res.json();
};

export const agregarLibro = async (libro) => {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(libro)
  });

  return await res.json();
};

export const actualizarLibro = async (id, libro) => {
  const res = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(libro)
  });

  return await res.json();
};

export const eliminarLibro = async (id) => {
  const res = await fetch(`${URL}/${id}`, {
    method: "DELETE"
  });

  return await res.json();
};
