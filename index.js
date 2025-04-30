const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

const DATA_FILE = './tareas.json';

// Leer tareas desde archivo
function leerTareas() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Guardar tareas
function guardarTareas(tareas) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tareas, null, 2));
}

// Rutas API
app.get('/tareas', (req, res) => {
  res.json(leerTareas());
});

app.post('/tareas', (req, res) => {
  const tareas = leerTareas();
  tareas.push(req.body);
  guardarTareas(tareas);
  res.status(201).json({ mensaje: 'Tarea agregada' });
});

app.patch('/tareas/:id', (req, res) => {
  let tareas = leerTareas();
  const id = parseInt(req.params.id);
  tareas = tareas.map(t => t.id === id ? { ...t, hecho: !t.hecho } : t);
  guardarTareas(tareas);
  res.json({ mensaje: 'Tarea actualizada' });
});

app.delete('/tareas/:id', (req, res) => {
  let tareas = leerTareas();
  const id = parseInt(req.params.id);
  tareas = tareas.filter(t => t.id !== id);
  guardarTareas(tareas);
  res.json({ mensaje: 'Tarea eliminada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
