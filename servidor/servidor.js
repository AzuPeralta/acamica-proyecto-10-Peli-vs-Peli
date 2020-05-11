const express = require('express');
const cors = require('cors');
const app = express();
const controlador = require('../servidor/controladores/controlador');

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/competencias', controlador.listarCompetencias);

app.get('/generos', controlador.obtenerGeneros);

app.get('/directores', controlador.obtenerDirectores);

app.get('/actores', controlador.obtenerActores);

app.post('/competencias', controlador.nuevaCompetencia);

app.delete('/competencias/:id', controlador.eliminarCompetencia);

app.put('/competencias/:id', controlador.editarCompetencia);

app.get('/competencias/:id', controlador.obtenerCompetencia);

app.get('/competencias/:id/peliculas', controlador.obtenerPeliculas);

app.post('/competencias/:id/voto', controlador.recibirVoto);

app.get('/competencias/:id/resultados', controlador.calcularResultados);

app.delete('/competencias/:id/votos', controlador.reiniciarVotos);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = 8080,
ip = '0.0.0.0'

app.listen(puerto, ip, function () {
  console.log( `Escuchando en el ip ${ip} en el puerto ${puerto}`);
});