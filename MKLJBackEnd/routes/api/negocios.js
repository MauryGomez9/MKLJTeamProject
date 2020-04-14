const express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

// JSON -> Javascript Object Notation

function negociosInit(db){
// json.org

var  negociosColl = db.collection('negocios');

var negociosCollection = [];

var negociosStruct = {
  "nombre":'',
  "informacion": '',
  "foto": '',
  "by":{},
  "dd":'NA',
  "type":""
};


router.get('/', (req, res, next)=>{
  negociosColl.find().toArray((err, negocios)=>{
    if(err) return res.status(200).json([]);
    return res.status(200).json(negocios);
  });//find toArray
  ///res.status(200).json(negociosCollection);
});

  router.get('/page', (req, res, next) => {
    var by = {"by._id": new ObjectID(req.user._id)};
    getnegocios(1, 50, res, by);
  });

  router.get('/page/:p/:n', (req, res, next) => {
    var by = { "by._id": new ObjectID(req.user._id) };
    var page = parseInt(req.params.p);
    var items = parseInt(req.params.n);
    getnegocios(page, items, res , by);
  });

  router.get('/page/:p/:n/:dd', (req, res, next) => {
    var by = { "by._id": new ObjectID(req.user._id) };
    var page = parseInt(req.params.p);
    var items = parseInt(req.params.n);
    var dd = req.params.dd;
    getnegocios(page, items, res, by, dd);
  });

  async function getnegocios(page, items, res, by, dd) {
    var query = by;
    if(!!dd){
      by.dd = dd;
    }
    var options = {
      "limit": items,
      "skip":((page-1) * items),
      "projection":{
        "nombre":1,"type":1,"visited":1
      },
      "sort": [["fecha",-1]]
    };
    let a = negociosColl.find(query,options)
    let totalnegocios = await a.count();
    a.toArray((err, negocios) => {
      if (err) return res.status(200).json([]);
      return res.status(200).json({ negocios, totalnegocios});
    });//find toArray
  }


router.get('/:id', (req, res, next)=>{
  var query = {"_id": new ObjectID(req.params.id)}
  negociosColl.findOne(query, (err, doc)=>{
    if(err) {
      console.log(err);
      return res.status(401).json({"error":"Error al extraer documento"});
    }
    return res.status(200).json(doc);
  }); //findOne
});// get ById

// CRUD Crear, Leer (Read), Actualizar (Update) ,Eliminar (Delete)
// REST
// GET  consultas  Read, lectura
// POST Crear  - Insert C
// PUT  Update - Actualizar
// DELETE  Delete - ELiminar

router.post('/', (req, res, next)=>{
  var {_id, email} = req.user;
  var newElement = Object.assign({},
    negociosStruct,
    req.body,
    {
      "fecha": new Date().getTime(),
      "by": {
        "_id": new ObjectID(_id),
        "email": email
      }
    }
  );

  //negociosCollection.push(newElement);
  //res.status(200).json(newElement);
  negociosColl.insertOne(newElement, {} , (err, result)=>{
    if(err){
      console.log(err);
      return res.status(404).json({"error":"No se pudo Insertar One negocio"});
    }
    return res.status(200).json({"n": result.insertedCount,"obj": result.ops[0]});
  });//insertOne
}); // post /
// http://localhost:3000/api/negocios/1236183491


router.put('/:idElemento', (req, res, next) => {
  var query = {"_id": new ObjectID(req.params.idElemento)};
  var update = { "$set": req.body, "$inc":{"visited": 1}};

  negociosColl.updateOne(query, update, (err, rst) => {
    if(err){
      console.log(err);
      return res.status(400).json({"error": "Error al actualizar documento"});
    }
    return res.status(200).json(rst);
  }); //updateOne
  // res.status(200).json({"o":originalObject, "m": modifiedObject });
});// put /


// router.delete('/:id/:soft', (req, res, next) => {
router.delete('/:id', (req, res, next) => {
  //var id = parseInt(req.params.id);
  var query = {"_id": new ObjectID(req.params.id)}
  negociosColl.removeOne(query, (err, result) => {
    if(err) {
      console.log(err);
      return res.status(400).json({"error":"Error al eliminar documento"});
    }
    return res.status(200).json(result);
  });
  //var soft = req.params.soft;
  // negociosCollection = negociosCollection.filter( (e, i) => {
  //   return (e.id !== id );
  // } ); //
  // res.status(200).json({ 'msg': 'Elemento ' + id + ' fué eleminido!!!' });
});// put /

 return router;
}
module.exports = negociosInit;