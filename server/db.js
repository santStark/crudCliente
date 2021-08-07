async function connect() {

    console.log('a', global.connection);
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const strConn = require("./strConn.js");
    const connection = await mysql.createConnection(strConn.strConn);
    console.log('Conectou no MySql');
    global.connection = connection;
    return connection;

}

//************Get All***************************** */

async function getPais() {

    try {

        const [rows] = await global.connection.query('select * from pais');
        return rows;

    } catch (err) {

        return err;

    }

}

async function getEstados() {

    try {

        const [rows] = await global.connection.query('select e.id, e.estado, e.uf, p.pais from estado e, pais p where e.pais = p.id');
        return rows;

    } catch (err) {

        return err;

    }

}

async function getCidades() {

    try {

        const [rows] = await global.connection.query('select c.id, c.cidade, e.estado, e.uf from cidade c, estado e where c.estado = e.id;');
        return rows;

    } catch (err) {

        return err;

    }

}

async function getClientes() {

    try {

        const [rows] = await global.connection.query(
            `
            select c.id, c.nome, c.sexo, c.dataNasc, c.endereco, cc.cidade, e.uf, p.pais, c.ativo 
            from cliente c, cidade cc, estado e, pais p
            where c.cidade = cc.id
            and cc.estado = e.id
            and e.pais = p.id;
            `
        );
        return rows;

    } catch (err) {

        return err;

    }

}

//*************Get ID******************************* */

async function getEstadoID(id) {

    try {

        const [rows] = await global.connection.query('select e.id, e.estado, e.uf, e.pais as idpais, p.pais from estado e, pais p where e.pais = p.id and e.id = ' + id);
        return rows;

    } catch (err) {

        return err;

    }

}

async function getPaisID(id) {

    try {

        const [rows] = await global.connection.query('select * from pais where id = ' + id);
        return rows;

    } catch (err) {

        return err;

    }

}

async function getCidadeID(id) {

    try {

        const [rows] = await global.connection.query('select c.id, c.cidade, e.estado, e.uf, c.estado idestado from cidade c, estado e where c.estado = e.id and c.id = ' + id);
        return rows;

    } catch (err) {

        return err;

    }

}

async function getClienteID(id) {

    try {

        const [rows] = await global.connection.query(
            `
            select c.id, c.nome, c.sexo, c.dataNasc, c.endereco, c.cidade idcidade, cc.cidade, e.uf, p.pais , c.ativo 

            from cliente c, cidade cc, estado e, pais p

            where c.cidade = cc.id

            and cc.estado = e.id

            and e.pais = p.id

            and c.id = `+ id
        );
        return rows;

    } catch (err) {

        console.info(err)
        return err;

    }

}


//*************Del******************************* */

async function delPaisID(id) {

    try {

        await global.connection.query('delete from pais where id = ' + id);
        return ['true'];

    } catch (err) {

        return err;

    }

}

async function delEstadoID(id) {

    try {

        await global.connection.query('delete from estado where id = ' + id);
        return ['true'];

    } catch (err) {

        return err;

    }

}

async function delCidadeID(id) {

    try {

        await global.connection.query('delete from cidade where id = ' + id);
        return ['true'];

    } catch (err) {

        return err;

    }

}

async function delClienteID(id) {

    try {

        await global.connection.query('delete from cliente where id = ' + id);
        return ['true'];

    } catch (err) {

        return err;

    }

}

//*************Update********************************** */

async function setPais(obj) {

    try {

        let query = 'aaa';

        if (obj.id > 0) {

            query =
                `UPDATE pais
            SET
            pais = '${obj.pais}' 
            WHERE id = ${obj.id};`;

        } else {
            query =
                `INSERT INTO pais(pais)
            VALUES('${obj.pais}')`;
        }

        await global.connection.query(query);
        return ['true'];

    } catch (err) {

        return err;

    }

}

async function setEstado(obj) {

    try {

        let query = 'aaa';

        if (obj.id > 0) {

            query =
                `UPDATE estado
            SET
            estado = '${obj.estado}',
            uf = '${obj.uf}',
            pais = ${obj.pais}
            WHERE id = ${obj.id};`;

        } else {
            query =
                `INSERT INTO estado(estado, uf, pais)
            VALUES('${obj.estado}', '${obj.uf}','${obj.pais}')`;
        }

        await global.connection.query(query);
        return ['true'];

    } catch (err) {

        return err;

    }

}

async function setCidade(obj) {

    try {

        let query = 'aaa';

        if (obj.id > 0) {

            query =
                `UPDATE cidade
            SET
            cidade = '${obj.cidade}', 
            estado = ${obj.estado} 
            WHERE id = ${obj.id};`;

        } else {
            query =
                `INSERT INTO cidade(cidade,estado)
            VALUES('${obj.cidade}',${obj.estado})`;
        }

        await global.connection.query(query);
        return ['true'];

    } catch (err) {

        return err;

    }

}


async function setCliente(obj) {

    try {

        let query = 'aaa';

        if (obj.id > 0) {

            query =
                `UPDATE cliente
            SET
            nome = '${obj.nome}',
            sexo = '${obj.sexo}',
            dataNasc = '${obj.dataNasc}',
            endereco = '${obj.endereco}',
            cidade = ${obj.cidade},
            ativo = ${obj.ativo}
            WHERE id = ${obj.id};`;

        } else {
            query =
                `INSERT INTO cliente(nome,sexo,dataNasc,endereco,cidade,ativo)
            VALUES('${obj.nome}','${obj.sexo}','${obj.dataNasc}','${obj.endereco}',${obj.cidade},${obj.ativo})`;
        }

        await global.connection.query(query);
        return ['true'];

    } catch (err) {

        return err;

    }

}

module.exports = {
    connect,

    getPais,
    getPaisID,
    delPaisID,
    setPais,

    getEstados,
    getEstadoID,
    delEstadoID,
    setEstado,

    getCidades,
    getCidadeID,
    delCidadeID,
    setCidade,

    getClientes,
    getClienteID,
    delClienteID,
    setCliente,


};

