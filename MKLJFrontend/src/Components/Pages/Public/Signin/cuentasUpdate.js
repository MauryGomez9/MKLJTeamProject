import React, { Component } from 'react';
import Button from '../../../Common/Btns/Buttons';
import Campo from '../../../Common/Campo/Campo';
import { paxios } from '../../../../Utilities';



export default class DetailUpdate extends Component {
  constructor() {
    super();
    //definición del estado inicial
    this.state = {
      email: '',
      password: '',
      fechaUpdate: new Date(),
      estado: '',
      checked: false,
      error: false,
      contador: 0,
    };


    //Para el autobinding
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSaveBtnClick = this.onSaveBtnClick.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
  }

  handleCheckBoxChange= event=>this.setState({
      checked: event.target.checked
  })

   componentDidMount(){
    const { match: {params}} = this.props;
    const uri = `/api/security/${params.id}`;
    paxios.get(uri)
    .then(
      ({data})=>{
        this.setState({...data});
      }
    )
    .catch(
      (err)=>{
        this.setState({error:"No se pudo cargar Thing."});
        console.log(err);
      }
    );
  }
  onChangeHandler(e) {
    const { name, value } = e.target;
    //validar
    this.setState({ ...this.state, [name]: value });
  }
  onSaveBtnClick(e) 
  {
    const { email, password, checked } = this.state;

    if( email ==='na' || password === 'na') {
        return alert("El correo y la contreseña son necesarios");
      }
      if (!(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(email)) {
        return alert( "El correo electrónico debe ser uno válido" );
      }
      if (! (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z\.!@#$%]{8,32}$/).test(password)){
        return alert( "La contraseña debe contener al menos una Mayúscula, una Minúscula, un número y un signo especial ! @ # $ % y mínimo 8 caracteres" );
      }
    let active = false;
    if(checked)
    {
        active=true;
    }
    else
    {
        active=false;
    }

    paxios.put(`/api/security/${this.props.match.params.id}`, { email, password, active})
      .then(({ data }) => {
        this.props.history.push("/cuentas");
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Error al actualizar nuevo Producto" });
      })
  }

  render() {
    this.state.contador++;
    console.log(this.state.active);
    console.log(this.state.contador);
    if(this.state.contador<3)
    {
        this.state.checked = this.state.active;
    }
 
    return (
        
      <section>
          
        <h1>{this.props.match.params.id}</h1>
        <section className="main fix640">
          <Campo
            caption="Email"
            value={this.state.email}
            name="email"
            onChange={this.onChangeHandler}
          />

          <Campo
            caption="Contraseña"
            value={this.state.password}
            name="password"
            onChange={this.onChangeHandler}
          />
        
          <span>Estado de la cuenta: </span>
          <input 
            type="checkbox"
            checked={ this.state.checked}
            name="checked"
            onChange={this.handleCheckBoxChange}
          />

          {(this.state.error && true) ? (<div className="error">{this.state.error}</div>) : null}
          <section className="action">
            <Button
              caption="Actualizar cuenta"
              onClick={this.onSaveBtnClick}
              customClass="primary"
            />
            <br></br>
            <Button
              caption="Cancelar"
              customClass="secondary"
              onClick={(e) => { this.props.history.push('/signin') }}
            />
          </section>
        </section>
      </section>
    );
  }
}
