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
    });
}

function obtenerPeliculas(req, res){
    let idCompetencia = req.params.id;

    conexion.query(`SELECT * FROM competencia WHERE id = ${idCompetencia}`, function(error, resultado, fields){
        if(resultado.length == 0){
            return res.status(404).json('No existe la competencia');
        }
        let nombre = resultado[0].nombre;
        let genero = resultado[0].genero_id;
        let director = resultado[0].director_id;
        let actor = resultado[0].actor_id;
        let sql = `SELECT pelicula.id, pelicula.titulo, pelicula.poster FROM `;

        if(genero && director && actor) {
            sql += `competencia JOIN pelicula ON pelicula.genero_id = competencia.genero_id JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id
            JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id
            WHERE competencia.id = ${idCompetencia} and director_pelicula.director_id = ${director} and actor_pelicula.actor_id = ${actor} `}

        else if(genero && actor){
            sql += `competencia JOIN pelicula on pelicula.genero_id = competencia.genero_id
            join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id
            WHERE pelicula.genero_id = ${genero} and actor_pelicula.actor_id = ${actor} and competencia.id = ${idCompetencia} `
        }
        else if(genero && director){
            sql += `competencia JOIN pelicula on pelicula.genero_id = competencia.genero_id join director_pelicula on pelicula.id = director_pelicula.pelicula_id
            WHERE competencia.genero_id = ${genero} and director_pelicula.director_id = ${director} `
        }
        else if(actor && director){
            sql += `pelicula join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id join director_pelicula on pelicula.id = director_pelicula.pelicula_id
            join competencia on competencia.actor_id = actor_pelicula.actor_id where actor_pelicula.actor_id = ${actor} and director_pelicula.director_id = ${director} `
        }
        else if(genero){
            sql += `competencia JOIN pelicula on pelicula.genero_id = competencia.genero_id WHERE competencia.genero_id = ${genero} `
        }
        else if(director){
           sql += `pelicula join director_pelicula on pelicula.id = director_pelicula.pelicula_id join competencia on director_pelicula.director_id = competencia.director_id
           where director_pelicula.director_id = ${director} `
        }
        else if(actor){
            sql += `pelicula join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id join competencia on competencia.actor_id = actor_pelicula.actor_id
            where actor_pelicula.actor_id = ${actor} `
        }
        else if (nombre){
            sql += `pelicula `
        }

        sql += `ORDER BY RAND();`
        conexion.query(sql, function(err, result, field){

            let response = {
                'peliculas': result,
                'competencia': nombre
            };
            res.json(response)
        })
    })
}

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

    let queryComprobacion = `SELECT distinct pelicula.id from pelicula JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id 
    JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id
    JOIN genero on pelicula.genero_id = genero.id`;

    if (genero || director || actor) queryComprobacion += ` where `;

    if (genero !== '0') {
        queryComprobacion += `pelicula.genero_id = ${genero} `;
    }

    if (director !== '0') {
        if(genero !== '0') queryComprobacion += `and `;
        queryComprobacion += `director_pelicula.director_id = ${director} `;
    }

    if (actor !== '0') {
        if(director !== '0' || genero !== '0') queryComprobacion += `and `;
        queryComprobacion += `actor_pelicula.actor_id = ${actor} `;
    }

    conexion.query(`SELECT nombre FROM competencia WHERE nombre = "${nueva_competencia}"`, function(error, resultado, fields){
        if(resultado.length !== 0){
            return res.status(422).json('Esa competencia ya existe!');
        }
        if(nueva_competencia <= 0 || nueva_competencia == null){
            return res.status(422).json('Para crear una competencia deberas ingresar un titulo!'); 
        }
            conexion.query(queryComprobacion, function(err, result, field){
                if( nueva_competencia == null && result.length < 2)
                {
                    console.log("No se puede crear esta competencia por falta de opciones!");
                    return res.status(422).json('No es posible crear esta competencia por falta de opciones!');
                }
                else if(nueva_competencia !== null && !genero && !actor && !director){
                    conexion.query(`INSERT INTO competencia (${columnas}) values (${valores});`, function(error, resultado, fields){
                        res.json(resultado)  
                    })
                }
                conexion.query(`INSERT INTO competencia (${columnas}) values (${valores});`, function(error, resultado, fields){
                    res.json(resultado)
                });
        });
     })

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