import React, { Component } from 'react';
import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import { paxios } from '../../../../Utilities';


export default class DetailNegUpdate extends Component {
  constructor() {
    super();
    //definición del estado inicial
    this.state = {
      nombre: '',
      informacion: '',
      error: false
    };
    //Para el autobinding
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSaveBtnClick = this.onSaveBtnClick.bind(this);
  }

  componentDidMount(){
    const { match: {params}} = this.props;
    const uri = `/api/negocios/${params.id}`;
    paxios.get(uri)
    .then(
      ({data})=>{
        this.setState({...data});
      }
    )
    .catch(
      (err)=>{
        this.setState({error:"No se pudo cargar el  negocio."});
        console.log(err);
      }
    );
  }
  onChangeHandler(e) {
    const { name, value } = e.target;
    //validar
    this.setState({ ...this.state, [name]: value });
  }
  onSaveBtnClick(e) {
    const { nombre, informacion,  _id } = this.state;
    paxios.put(`/api/negocios/${_id}`, { nombre, informacion})
      .then(({ data }) => {
        this.props.history.push("/backneg");
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Error al actualizar nuevo Negocio" });
      })
  }

  render() {
    console.log(this.state);
    return (
      <section>
        <h1></h1>
        <section className="main fix640">
          <Campo
            caption="Nombre del Negocio"
            value={this.state.nombre}
            name="nombre"
            onChange={this.onChangeHandler}
          />
          <Campo
            caption="Informacion del Negocio"
            value={this.state.informacion}
            name="informacion"
            onChange={this.onChangeHandler}
          />
          {(this.state.error && true) ? (<div className="error">{this.state.error}</div>) : null}
          <section className="action">
            <Button
              caption="Actualizar Negocio"
              onClick={this.onSaveBtnClick}
              customClass="primary"
            />
            <br></br>
            <Button
              caption="Cancelar"
              customClass="secondary"
              onClick={(e) => { this.props.history.push('/backneg') }}
            />
          </section>
        </section>
      </section>
    );
  }
}
