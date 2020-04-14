// ES6
// ES5 var React = require('react');
// var Component = React.Component;
import React, { Component } from 'react';
import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import { naxios } from '../../../../Utilities';
import { NavLink } from 'react-router-dom';
import '../../../Common/NavBar/NavBar.css';
import { IoLogoWindows } from 'react-icons/io';

/*
  module.exports = class Login .....
*/
export default class Signin extends Component{
  constructor(){
    super();
    //definición del estado inicial
    this.state = {
      email:'',
      password:'',
      error:false
    };
    //Para el autobinding
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSiginBtnClick = this.onSiginBtnClick.bind(this);
  }

  home(e)
  {
    e.preventDefault();
    window.location='/cuentas';
  }
  onChangeHandler(e){
    const {name, value} = e.target;
    //validar
    this.setState({...this.state,[name]:value});
  }
  onSiginBtnClick(e){
    const {email, password} = this.state;
    naxios.post('/api/security/signin', { email, password })
    .then(({data})=>{
      console.log(data);
      this.props.history.push("/login");
    })
    .catch((error)=>{
      console.log(error);
      this.setState({error:"Error al crear cuenta. Intente nuevamente."})
    })
  }

  render(){
    return (
      
      <section className="inicio">
        
        <div className="fix640">
          <h1>Crear Cuenta</h1>
        </div>
        
        <section className="main fix640">
         <Campo
          caption="Correo Electrónico"
          value={this.state.email}
          name="email"
          onChange={this.onChangeHandler}
         />
          <Campo
            caption="Contraseña"
            type="password"
            value={this.state.password}
            name="password"
            onChange={this.onChangeHandler}
          />
          {(this.state.error && true)?(<div className="error">{this.state.error}</div>):null}
          <section className="action">
              <Button
                caption="Crear Cuenta"
                onClick={this.onSiginBtnClick}
                customClass="btnsuccess"
              />

              <Button
                to='/cuentas'
                caption="Cuentas"
                onClick={this.home}
                customClass="btnsuccess"
              />
          </section>
        
        </section>
      </section>
    );
  }
}

/*
              <Button
                caption="Iniciar Sesión"
                customClass="link"
                onClick={(e)=>{this.props.history.push('/login')}}
              />
*/
