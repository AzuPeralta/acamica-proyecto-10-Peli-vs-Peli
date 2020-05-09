const conexion = require('../lib/conexionBD');

function listarCompetencias(req, res){
    let sql = `select * from competencia`

    conexion.query(sql, function(error, resultado, fields){
        res.json(resultado)
    });
}

function obtenerPeliculas(req, res){
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
        res.json(response)
    })
})}

function recibirVoto(req, res){
    let idCompetencia = req.params.id
    let idPelicula = req.body.idPelicula;
    //console.log(`Entre a la funcion voto. El id de la peli es ${idPelicula} y el la competencia es ${idCompetencia}`)

    conexion.query(`SELECT id FROM competencia WHERE id = ${idCompetencia}`, function(error, competencia){
        if(competencia.length == 0){
            return res.status(404).json('No existe la competencia');}

        conexion.query(`SELECT id FROM pelicula WHERE id = ${idPelicula}`, function(errorPelicula, pelicula){
            if(pelicula.length == 0){
                return res.status(404).json('No existe la pelicula');
            }
            conexion.query('INSERT INTO voto (competencia_id, pelicula_id, cantidad_votos) VALUES (?, ?, 1)', [idCompetencia, idPelicula], function(err, result, field){
                let response = {
                    'idCompetencia': result,
                    'idPelicula': idPelicula,
                };
                //console.log(response)
                res.json(response)
        })
    })
})
}

function calcularResultados(req, res){
    let idCompetencia = req.params.id;
    let sqlQuery = `SELECT voto.competencia_id, voto.pelicula_id, competencia.nombre, pelicula.id, pelicula.poster, pelicula.titulo,
    COUNT(cantidad_votos) as votos FROM voto join competencia on competencia.id = voto.competencia_id join pelicula on voto.pelicula_id = pelicula.id
    where competencia_id = ${idCompetencia} GROUP BY pelicula_id ORDER BY votos DESC LIMIT 3;`

    conexion.query(`SELECT id FROM competencia WHERE id = ${idCompetencia}`, function(error, competencia){
        if(competencia.length == 0){
            return res.status(404).json('No existe la competencia');}

        conexion.query(sqlQuery, function(error, resultado, fields){
            let competencia_nombre = resultado[0].nombre;

            let response = {
                'competencia': competencia_nombre,
                'resultados': resultado,
            }
            res.json(response);
        })
    })
}

function obtenerGeneros(req, res){
    conexion.query('SELECT * FROM competencias.genero;', function(error, resultado, fields){
        res.json(resultado);
    });
}

function obtenerDirectores(req, res){
    conexion.query('SELECT * FROM competencias.director;', function(error, resultado, fields){
        res.json(resultado);
    });
}

function obtenerActores(req, res){
    conexion.query('SELECT * FROM competencias.actor;', function(error, resultado, fields){
        res.json(resultado);
    });
}

function nuevaCompetencia(req, res){
    let nueva_competencia = req.body.nombre;
    let genero = req.body.genero;
    let director = req.body.director;
    let actor = req.body.actor;
    //console.log(nueva_competencia)
    let parcialQuery = `INSERT INTO competencia SET `

    if (nueva_competencia) parcialQuery += `nombre = "${nueva_competencia}", genero_id = null, director_id = null, actor_id = null`

    if( genero || director || actor) parcialQuery += `, `

    if (genero){
        parcialQuery += `genero_id = ${genero}`
    }

    if(director){
        if(genero) parcialQuery += ` ,`;
        parcialQuery += `director_id = ${director}`;
    }

    if(actor){
        if(genero || director) parcialQuery += ` ,`;
        parcialQuery += `actor_id = ${actor}`;
    }

    console.log(parcialQuery);

    conexion.query(`SELECT nombre FROM competencia WHERE nombre = "${nueva_competencia}"`, function(error, resultado, fields){
        if(resultado.length !== 0){
            return res.status(422).json('Esa competencia ya existe!');
        }
        if(nueva_competencia <= 0 || nueva_competencia == null){
            return res.status(422).json('Para crear una competencia deberas ingresar un titulo!');
        }
        conexion.query(parcialQuery, function(err, result, field){
            console.log(result);
            res.json(result);
        });
    });
}

function reiniciarVotos(req, res){
    let idCompetencia = req.params.id;
    let sql = `DELETE FROM voto WHERE competencia_id = ${idCompetencia};`;

    conexion.query(`SELECT id FROM competencia WHERE id = ${idCompetencia}`, function(error, competencia){
        if(competencia.length == 0){
            return res.status(404).json('No existe la competencia');}
        conexion.query(sql, function(error, resultado, fields){
            res.json(resultado);
        })
    })
}

module.exports = {
    listarCompetencias : listarCompetencias,
    obtenerPeliculas: obtenerPeliculas,
    recibirVoto: recibirVoto,
    calcularResultados: calcularResultados,
    obtenerGeneros: obtenerGeneros,
    obtenerDirectores: obtenerDirectores,
    obtenerActores: obtenerActores,
    nuevaCompetencia: nuevaCompetencia,
    reiniciarVotos: reiniciarVotos,
}