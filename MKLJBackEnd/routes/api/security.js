const express = require('express');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

function initSecurity (db){
  var userColl = db.collection('users');
  var userModel =  require('./users')(db);

  //configurar el passport local
  passport.use(
      new LocalStrategy(
        {
          usernameField:'email',
          passwordField:'password'
        },
        (email, pswd, next)=>{
            //--
          if ((email ||'na') === 'na' || (pswd ||'na') == 'na') {
            console.log("Valores de correo y contraseña no vienen");
            return next(null, false, {"Error":"Credenciales Incorrectas"});
          }
          userModel.obtenerPorCorreo(email, (err, user) => {
            if (err) {
              console.log(err);
              console.log("Tratando de Ingresar con cuenta inexistente " + email);
              return next(null, false, { "Error": "Credenciales Incorrectas" });
            }
            //Ver si la cuenta está activa
            if (!user.active) {
              console.log("Tratando de Ingresar con cuenta suspendida " + email);
              return next(null, false, { "Error": "Credenciales Incorrectas" });
            }
            if (!userModel.comparePasswords(pswd, user.password)) {
              console.log("Tratando de Ingresar con contraseña incorrecta " + email);
              return next(null, false, { "Error": "Credenciales Incorrectas" });
            }
            delete user.password;
            delete user.lastPasswords;
            delete user.active;
            delete user.dateCreated;

            return next(null, user, { "Status": "Ok" });
          });
            //---
        }
      )
  );


  router.get('/:id', (req, res, next)=>{
    var query = {"_id": new ObjectID(req.params.id)}
    userColl.findOne(query, (err, doc)=>{
      if(err) {
        console.log(err);
        return res.status(401).json({"error":"Error al extraer documento"});
      }
      return res.status(200).json(doc);
    }); //findOne
  });// get ById

  
    router.get('/', (req, res, next)=>{
      userColl.find().toArray((err, things)=>{
        if(err) return res.status(200).json([]);
        return res.status(200).json(things);
      });//find toArray
      ///res.status(200).json(thingsCollection);
    });

  router.post('/login', (req, res, next)=>{
    passport.authenticate(
        'local',
        {session:false},
        (err, user, info) => {
          if(user){
            req.login(user, {session:false}, (err)=>{
              if(err){
                return res.status(400).json({"Error":"Error al iniciar sesión"});
              }
              const token = jwt.sign(user, 'cuandolosgatosnoestanlosratonesfiestahacen');
              return res.status(200).json({user, token});
            });
          }else{
            return res.status(400).json({info});
          }
        }
    )(req, res);
  }); //login

  router.post('/signin', (req, res ,next)=>{
    var email = req.body.email || 'na';
    var pswd = req.body.password || 'na';
    if( email ==='na' || pswd == 'na') {
      return res.status(400).json({"Error":"El correo y la contreseña son necesarios"});
    }
    if (!(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(email)) {
      return res.status(400).json({ "Error": "El correo electrónico debe ser uno válido" });
    }
    if (! (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z\.!@#$%]{8,32}$/).test(pswd)){
      return res.status(400).json({ "Error": "La contraseña debe contener al menos una Mayúscula, una Minúscula, un número y un signo especial ! @ # $ % y mínimo 8 caracteres" });
    }
    userModel.agregarNuevo(email, pswd, (err, newUser)=>{
      if(err){
        return res.status(400).json({ "Error": "No se pudo crear nueva cuenta" });
      }
      delete newUser.password;
      return res.status(200).json(newUser);
    });
  }); // signin

/*
  router.put('/:idElemento', (req, res, next) => {
    var query = {"_id": new ObjectID(req.params.idElemento)};
    var update = { "$set": req.body, "$inc":{"visited": 1}};
    userColl.updateOne(query, update, (err, rst) => {
      if(err){
        console.log(err);
        return res.status(400).json({"error": "Error al actualizar documento"});
      }
      return res.status(200).json(rst);
    }); 
  });// put /*/
  router.put('/:idElemento', (req, res, next) => {
  
    var email = req.body.email || 'na';
    var password = req.body.password || 'na';
    var active = req.body.active;
    var fechaUpdate = new Date();
    var id = req.params.idElemento;


    console.log(id);
    console.log(email);
    console.log(password);
    console.log(fechaUpdate);
   // console.log(active);

    userModel.changePassword(email, password, id, active, (err, newUser)=>{
      if(err){
        
        return res.status(400).json({ "Error": "No se pudo actualizar" });
      }

      return res.status(200).json(newUser);
    });
  


  });// put /

  router.delete('/:id', (req, res, next) => {
    //var id = parseInt(req.params.id);
    var query = {"_id": new ObjectID(req.params.id)}
    userColl.removeOne(query, (err, result) => {
      if(err) {
        console.log(err);
        return res.status(400).json({"error":"Error al eliminar documento"});
      }
      return res.status(200).json(result);
    });
    //var soft = req.params.soft;

  });// put /
  return router;
}

module.exports = initSecurity;
