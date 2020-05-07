const express = require('express');
const cors = require('cors');
const app = express();
const controlador = require('../servidor/controladores/controlador');

app.use(cors());

app.get('/competencias', controlador.listarCompetencias);

app.get('/competencias/:id/peliculas', controlador.obtenerPeliculas);
//app.get('/competencias/:id/voto', controlador.agregarVoto);
app.post('competencias/:id/voto', controlador.recibirVoto);


//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = 8080,
ip = '0.0.0.0'

app.listen(puerto, ip, function () {
  console.log( `Escuchando en el ip ${ip} en el puerto ${puerto}`);
});