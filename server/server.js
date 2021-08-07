const express = require('express');
const bodyParser = require('body-parser');
const db = require("./db.js");
const app = express();
const port = 5000;
const cors = require('cors')

db.connect();

app.use(cors());
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());


//*******PAIS***************** */

app.get('/pais', async (req, res) => {

    db.getPais()
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.get('/paisID/:id?', async (req, res) => {

    db.getPaisID(req.params.id)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.get('/delPaisID/:id?', async (req, res) => {

    db.delPaisID(req.params.id)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.post('/pais', async (req, res) => {

    const obj = {
        id: req.body.id,
        pais: req.body.pais,
    }

    db.setPais(obj)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

//*******ESTADO***************** */

app.get('/estados', async (req, res) => {

    db.getEstados()
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.get('/estadoID/:id?', async (req, res) => {

    db.getEstadoID(req.params.id)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.get('/delEstadoID/:id?', async (req, res) => {

    db.delEstadoID(req.params.id)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.post('/estado', async (req, res) => {

    const obj = {
        id: req.body.id,
        estado: req.body.estado,
        uf: req.body.uf,
        pais: req.body.pais,
    }

    db.setEstado(obj)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

//*******Cidade***************** */

app.get('/cidades', async (req, res) => {

    db.getCidades()
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.get('/cidadeID/:id?', async (req, res) => {

    db.getCidadeID(req.params.id)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.get('/delCidadeID/:id?', async (req, res) => {

    db.delCidadeID(req.params.id)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.post('/cidade', async (req, res) => {

    const obj = {
        id: req.body.id,
        cidade: req.body.cidade,
        estado: req.body.estado,
        
    }

    db.setCidade(obj)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

//*******Cliente***************** */

app.get('/clientes', async (req, res) => {

    db.getClientes()
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.get('/clienteID/:id?', async (req, res) => {

    db.getClienteID(req.params.id)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.get('/delClienteID/:id?', async (req, res) => {

    db.delClienteID(req.params.id)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.post('/cliente', async (req, res) => {

    const obj = {
        id: req.body.id,
        nome: req.body.nome,
        sexo: req.body.sexo,
        dataNasc: req.body.dataNasc,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        ativo: req.body.ativo
    }

    db.setCliente(obj)
        .then((rows) => res.send(rows))
        .catch((err) => res.send([err]));

});

app.listen(port, () => console.log(`servidor no ar porta ${port}`))



