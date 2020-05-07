const conexion = require('../lib/conexionBD');

function listarCompetencias(req, res){
    console.log('llegue al controlador');
    let sql = `select * from competencia`

    conexion.query(sql, function(error, resultado, fields){
        res.json(resultado)
    });
}

function obtenerPeliculas(req, res){
    console.log('entre a la competencia')
    let idCompetencia = req.params.id;

    conexion.query(`SELECT id FROM competencia WHERE id = ${idCompetencia}`, function(error, resultado, fields){
        if(resultado.length == 0){
            return res.status(404).json('No existe la competencia');
        }
        let sql = `SELECT pelicula.id, pelicula.titulo, pelicula.poster, competencia.nombre FROM pelicula, competencia where competencias.competencia.id = ${idCompetencia} ORDER BY RAND() LIMIT 2;`

        conexion.query(sql, function(error, resultado, fields){
        let nombreCompetencia = resultado[0].nombre
        let response = {
            'peliculas': resultado,
            'competencia': nombreCompetencia,
        };
        //console.log(response)
        res.json(response)
    })
})}

function recibirVoto(req, res){
    let idCompetencia = req.params.id
    let idRecibido = req.body;
    let idPelicula = idRecibido.idPelicula
    console.log(idPelicula);

    console.log("Entre al voto");

    conexion.query(`SELECT id FROM competencia WHERE id = ${idCompetencia}`, function(error, resultado, fields){
        if(resultado.length == 0){
            return res.status(404).json('No existe la competencia');}
            conexion.query('INSERT INTO voto (competencia_id, pelicula_id, cantidad_votos) VALUES (?, ?, 1)', [idCompetencia, idPelicula], function(err, result, field){
                let response = {
                    'idCompetencia': result,
                    'idPelicula': nombreCompetencia,
                };
                //console.log(response)
                res.json(response)
        })
})}


module.exports = {
    listarCompetencias : listarCompetencias,
    obtenerPeliculas: obtenerPeliculas,
    recibirVoto: recibirVoto,
}