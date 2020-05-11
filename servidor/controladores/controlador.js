const conexion = require('../lib/conexionBD');

function listarCompetencias(req, res){
    let sql = `select * from competencia`

    conexion.query(sql, function(error, resultado, fields){
        res.json(resultado)
    });
}

function obtenerCompetencia(req, res){
    let idCompetencia = req.params.id;
    let sql = `select competencia.nombre as nombre, genero.nombre as genero_nombre, actor.nombre as actor_nombre, director.nombre as director_nombre 
    from competencia left join genero on competencia.genero_id = genero.id left join actor on competencia.actor_id = actor.id
    left join director on competencia.director_id = director.id where competencia.id = ${idCompetencia};`

    conexion.query(sql, function(error, resultado, fields){
        res.json(resultado[0]);
    })
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
    console.log(req.body)
    let nueva_competencia = req.body.nombre;
    let genero = req.body.genero;
    let director = req.body.director;
    let actor = req.body.actor;
    let filtros = {};
    let sql;

    if(req.body.nombre) filtros.nombre = nueva_competencia;
    if(req.body.genero !== '0') filtros.genero_id = genero;
    if(req.body.director !== '0') filtros.director_id = director;
    if(req.body.actor !== '0') filtros.actor_id = actor;

    let columnas = "";
    for( const filtroColumna in filtros){
            columnas += `${filtroColumna}, `
    }
    columnas = columnas.slice(0,-2);

    let valores = "";
    for(const valorColumna in filtros){
        valores += `"${filtros[valorColumna]}", `
    }
    valores = valores.slice(0, -2);

    sql = `INSERT INTO competencia (${columnas}) values (${valores});`

    conexion.query(`SELECT nombre FROM competencia WHERE nombre = "${nueva_competencia}"`, function(error, resultado, fields){
        if(resultado.length !== 0){
            return res.status(422).json('Esa competencia ya existe!');
        }
        if(nueva_competencia <= 0 || nueva_competencia == null){
            return res.status(422).json('Para crear una competencia deberas ingresar un titulo!');
        }
        conexion.query(sql, function(error, resultado, fields){
            console.log(resultado);
            res.json(resultado)
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

function eliminarCompetencia(req, res){
    let idCompetencia = req.params.id;
    let queryTablaVoto = `DELETE from voto where competencia_id = ${idCompetencia}`;
    let queryTablaCompetencia = `DELETE FROM competencia WHERE id = ${idCompetencia}`;

    conexion.query(queryTablaVoto, function(error, resultado, fields){
        conexion.query(queryTablaCompetencia, function(err, result, field){
            res.json(result);
        })
    })
}

function editarCompetencia(req, res){
    let idCompetencia = req.params.id;
    let nuevaInfo = req.body.nombre;
    console.log(nuevaInfo);
    let sql = `UPDATE competencia SET nombre = "${nuevaInfo}" WHERE id = ${idCompetencia};`

    conexion.query(sql, function(error, resultado, fields){
        res.json(resultado);
    })
}

module.exports = {
    listarCompetencias : listarCompetencias,
    obtenerCompetencia: obtenerCompetencia,
    obtenerPeliculas: obtenerPeliculas,
    recibirVoto: recibirVoto,
    calcularResultados: calcularResultados,
    obtenerGeneros: obtenerGeneros,
    obtenerDirectores: obtenerDirectores,
    obtenerActores: obtenerActores,
    nuevaCompetencia: nuevaCompetencia,
    reiniciarVotos: reiniciarVotos,
    eliminarCompetencia: eliminarCompetencia,
    editarCompetencia: editarCompetencia,
}