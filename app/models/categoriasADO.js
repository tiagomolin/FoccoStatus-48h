const getCategorias = function(par,callback) {
   
    const plsql = `BEGIN :ret := FOCCO_STATUS.RETORNA_CATEGORIAS(pi_usu_id=> ${par.usuId} ) ; END;`
   
    var oracledb = require('oracledb')
    var conn = require('../../config/oracle/database')

    conn().then(function(connection) {
        return connection.execute(
                            plsql,
                        { ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING , maxSize: 32000} }
                    )
        .then(function(result) {
                callback(null,result.outBinds)
                return connection.close();
            })
            .catch(function(err) {
                callback(err,null)
                return connection.close();
            });
        })
        .catch(function(err) {
            callback(err,null)
            return connection.close();
        }); 
}


const getCategoriasExec = function(par,callback){
    
    getCategorias(par,function(err,result){

        if (err){
            callback(err,null)
        }else{
            
            const sql = result.ret
        
            var oracledb = require('oracledb')
            oracledb.maxRows = 100
            var conn = require('../../config/oracle/database')
            
            conn().then(function(connection) {
                return connection.execute(
                        sql,
                        [],
                        {outFormat: oracledb.OBJECT})
                .then(function(result) {
                        callback(null,result.rows )
                        return connection.close();
                    })
                    .catch(function(err) {
                        callback(err,null)
                        return connection.close();
                    });
                })
                .catch(function(err) {
                    callback(err,null)
                    return connection.close();
                }); 

        }

    })
    
}

module.exports = {getCategorias: getCategorias,
    getCategoriasExec: getCategoriasExec}