// ES6
// ES5 var React = require('react');
// var Component = React.Component;
import React, { Component } from 'react';
import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import axios from 'axios';
import { paxios } from '../../../../Utilities';
import { timingSafeEqual } from 'crypto';

/*
  module.exports = class Login .....
*/
export default class DetailAdd extends Component {
  constructor() {
    super();
    //definición del estado inicial
    this.state = {
      selectedFile: null,
      descripcion:'',
      informacion: '',
      fecha: "",
      foto: null,
      error: false
    };
    //Para el autobinding
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSaveBtnClick = this.onSaveBtnClick.bind(this);
  }

  handleFile(e)
  {
    let imagen = e.target.files[0];
    this.setState({imagen: imagen});
  }

  fileSelectedHandler = event =>{
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  onChangeHandler(e) {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  }
  onSaveBtnClick(e) {
    const { descripcion, informacion, fecha, foto  } = this.state;
    paxios.post('/api/things', { descripcion, informacion, fecha, foto })
      .then(({ data }) => {
        this.props.history.goBack();
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Error al crear nuevo evento" });
      })
  }

  render() {
    return (
      <section>
        <h1></h1>
        <section className="main fix640">
          <Campo
            caption="Descripción"
            value={this.state.descripcion}
            name="descripcion"
            onChange={this.onChangeHandler}
          />
         <Campo
            caption="Informacion"
            value={this.state.informacion}
            name="informacion"
            onChange={this.onChangeHandler}
          />
          <Campo
            caption="Fecha"
            value={this.state.fecha}
            name="fecha"
            onChange={this.onChangeHandler}
          />
          <Campo
            caption="Foto"
            type= "file"
            value={this.state.foto}
            name="imagen"
            onChange={this.onChangeHandler}
            />
         
          {(this.state.error && true) ? (<div className="error">{this.state.error}</div>) : null}
          <section className="action">
            <Button
              caption="Crear Evento"
              onClick={this.onSaveBtnClick}
              customClass="primary"
            />
            <br></br>
            <Button
              caption="Cancelar"
              customClass="secondary"
              onClick={(e) => { this.props.history.goBack() }}
            />
          </section>
        </section>
      </section>
    );
  }
}