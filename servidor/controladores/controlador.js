const conexion = require('../lib/conexionBD');

function listarCompetencias(req, res){
    console.log('llegue al controlador');
    let sql = `select * from competencia`

    conexion.query(sql, function(error, resultado){
        if (error){
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
        }
        let response = {
            'competencias': resultado.length
        };
        res.send(JSON.stringify(response))
    })
}

module.exports = {
    listarCompetencias : listarCompetencias
}