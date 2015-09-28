#!/bin/env node
//  OpenShift sample Node application

var restify = require('restify');
 
var server = restify.createServer({
  name: 'sdserver',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var vagas = [];

//server functions
function echo(req, res, next) {
    res.send(req.params);
    return next();
}

function upCase(req, res, next) {
    var up = req.params;
    res.send(up.name.toUpperCase());
    return next();
}

function sum(req, res, next) {
    var op1 = parseInt(req.params.op1);
    var op2 = parseInt(req.params.op2);
    var resultado = op1+op2;
    res.send(JSON.stringify(resultado));
    return next();
}

function vaga(req, res, next) {
    if (vagas.length == 0) {
        res.send(JSON.parse('"Nao ha vagas."'));
        return next();
    }
    else {
        res.send(vagas);
        return next();
    }
}

function inserirVaga(req, res, next) {
    var vaga = req.body;
    if (vagas.length == 0) {
        vaga.id = 1;
    }
    else {
        vaga.id = (vagas[vagas.length - 1].id) + 1;
    }
    vagas.push(vaga);
    res.send(JSON.parse('"Vaga inserida com sucesso."'));
    return next();
}

function ocuparVaga(req, res, next) {
    var vaga;
    var id;
    for (var i = 0; i < vagas.length; i++){
        if (req.params.id == vagas[i].id){
            vaga = vagas[i];
            id = i;
        }
    }

    if(vaga == undefined){
        res.send(JSON.parse('"Vaga inexistente."'));
        return next();
    }
    else{
        vagas.splice(id, 1);
        res.send(JSON.parse('"Vaga ocupada com sucesso."'));
        return next();
    }
}



//server gateways
server.get('/echo/:name', echo);

server.get('/toUpper/:name', upCase);

server.get('/sum/:op1/:op2', sum);

server.get('/vaga', vaga);

server.put('/vaga', inserirVaga);

server.del('/vaga/:id', ocuparVaga);

//initialize server
server.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function () {
    console.log('%s listening at %s', server.name, server.url);
});
