var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');

module.exports = function(db){
  var userColl = db.collection('users');
  var userModel = {}

  //Obtiene el usuario por correo electrónico
  userModel.obtenerPorCorreo = function( email, handler) {
    var query = {"email": email};
    userColl.findOne(query, (err, user)=>{
      if(err){
        console.log(err);
        return handler(err, null);
      }
      if(!user){
        return handler(new Error("No se encontró el usuario"), null);
      }
      return handler(null, user);
    });
  }

  //Ingresa un nuevo usuario a la colección de Usuario
  userModel.agregarNuevo = (email, password, handler) => {
    var newUser = Object.assign({}, {
      email:email,
      password: genPassword(password),
      dateCreated: new Date().getTime(),
      active: true,
      lastPasswords:[],
      roles:["public"]
      }
      );
    userColl.insertOne(newUser, (err, result)=>{
      if(err){
        console.log(err);
        return handler(err, null);
      }
      if(result.insertedCount == 0){
        return handler(new Error("No se guardo el usuario"), null);
      }
      return handler(null, result.ops[0]);
    })
  } // agregarNuevo

  userModel.changePassword = (email, pswd, id, active, handler) => {
    console.log("Valor es"+active);
    var querys = {"_id": new ObjectID(id)};
    var query = {email: email};

    var projection = {"password":1, "active":active,  "lastPasswords":1};
    /*userColl.findOne(query, {"projection": projection}, (err,user)=>{
        if(err){
          console.log(err);
          return handler(err, null);
        }
        if(!user){
          return handler(new Error("No se encontró usuario"), null);
        }
        if(!user.active){
          return handler(new Error("Usuario Inactivo"), null);
        }
        
        if(bcrypt.compareSync(pswd, user.password)){
          return handler(new Error("Debe usar una contraseña no utilizada anteriormente"), null);
        }*/
        var pswdHash = genPassword(pswd);

        //console.log(id);
        console.log(email);
        console.log(pswdHash);
       // console.log(fechaUpdate);
        //console.log(active);
        var update = { "$set":{"password": pswdHash, "active": active, "fechaUpdate": new Date()}};
        userColl.updateOne(querys, update, (err, rst) => {
          if(err){
            console.log(err);
            return handler(err, null);
          }
          return handler(null, rst);
        }); //updateOne

  } //changePassword
  function genPassword(rawPassword){
    var hashedPassword = bcrypt.hashSync(rawPassword, 10);
    return hashedPassword;
  }

  userModel.comparePasswords = (rawPassword, dbPassword)=>{
    return bcrypt.compareSync(rawPassword, dbPassword);
  }
  return userModel;
}
