const express = require('express');
const app = express();
const controlador = require('../servidor/controladores/controlador');



app.get('/competencias', controlador.listarCompetencias);






//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = 8080,
ip = '0.0.0.0'

app.listen(puerto, ip, function () {
  console.log( `Escuchando en el ip ${ip} en el puerto ${puerto}`);
});