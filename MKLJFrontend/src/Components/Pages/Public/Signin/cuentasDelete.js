import React, { Component } from 'react';
import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import { paxios } from '../../../../Utilities';


export default class DetailDelete extends Component {
  constructor() {
    super();
    //definición del estado inicial
    this.state = {
      descripcion: '',
      precio: 0,
      peso: 0.00,
      categoria: '',
      error: false
    };
    //Para el autobinding
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSaveBtnClick = this.onSaveBtnClick.bind(this);
  }


  onChangeHandler(e) {
    const { name, value } = e.target;
    //validar
    this.setState({ ...this.state, [name]: value });
  }
  onSaveBtnClick(e) {
    const { descripcion,precio} = this.state;
    paxios.delete(`/api/security/${this.props.match.params.id}`, { descripcion, precio })
      .then(({ data }) => {
        this.props.history.push("/cuentas");
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Error al eliminar cuenta" });
      })
  }

  render() {
    console.log(this.state);
    return (
      <section>
        <h1>{this.props.match.params.id}</h1>
        <section className="main fix640">
          {(this.state.error && true) ? (<div className="error">{this.state.error}</div>) : null}
          <section className="action">
            <Button
              caption="Eliminar producto"
              onClick={this.onSaveBtnClick}
              customClass="primary"
            />
            <br></br>
            <Button
              caption="Cancelar"
              customClass="secondary"
              onClick={(e) => { this.props.history.push('/cuentas') }}
            />
          </section>
        </section>
      </section>
    );
  }
}
