const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let libros = [
  {
    id: 1,
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    anio: 1943,
    disponible: true
  }
];

app.get("/libros", (req, res) => {
  res.json(libros);
});

app.get("/libros/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const libro = libros.find(l => l.id === id);

  if (!libro) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  res.json(libro);
});

app.post("/libros", (req, res) => {
  const { id, titulo, autor, anio, disponible } = req.body;

  if (!id || !titulo || !autor || !anio) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  if (titulo.trim() === "" || autor.trim() === "") {
    return res.status(400).json({ error: "Título o autor vacío" });
  }

  if (anio < 1900) {
    return res.status(400).json({ error: "Año inválido" });
  }

  const existe = libros.find(l => l.id === id);
  if (existe) {
    return res.status(400).json({ error: "ID duplicado" });
  }

  const nuevoLibro = { id, titulo, autor, anio, disponible };
  libros.push(nuevoLibro);

  res.json(nuevoLibro);
});

app.put("/libros/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = libros.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  const { titulo, autor, anio, disponible } = req.body;

  if (!titulo || !autor || anio < 1900) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  libros[index] = {
    id,
    titulo,
    autor,
    anio,
    disponible
  };

  res.json(libros[index]);
});


app.delete("/libros/:id", (req, res) => {
  const id = parseInt(req.params.id);

  libros = libros.filter(l => l.id !== id);

  res.json({ mensaje: "Libro eliminado" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});