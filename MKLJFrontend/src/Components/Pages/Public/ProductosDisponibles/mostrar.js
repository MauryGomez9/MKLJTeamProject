import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './Backneg.css';
import { IoIosShuffle, IoIosMenu, IoIosCash} from 'react-icons/io';
import { naxios } from '../../../../Utilities';

function ListItem(props){
  return(
    <div key={props._id}>
      <b>
        <Link to={`/detailneg/${props._id}`}>{props.desc}</Link>
      </b>
    </div>
  );
}

class List extends Component{
  constructor(){
    super();
    this.state = {
      negocios:[],
      isLoading: false,
      error: false,
    }
  }
  componentDidMount(){
      this.setState({isLoading:true});
      naxios.get('/api/mostrar/')
        .then( (resp)=>{
          this.setState({negocios:resp.data, isLoading:false});
        })
        .catch( (err)=>{
          alert(err);
        })
      ;
  }

 
  render(){
    const cosas = this.state.negocios.map(
        (negocio)=>{
          return (
            <div className="negocioItem" key={negocio._id}>
              <span>{negocio.nombre}</span>
              <span>{negocio.informacion}</span>
              <span>{negocio.foto}</span>
            </div>);
        }
      );
    return (
      <div className="listHolder">
        <div className="inicio"><h1>Negocios Asociados</h1></div>
      <div className="cantidades">
      <h2>Negocio: {this.state.negocios.length}</h2>
      <p><b>En nuestra App hay una gran variedad de negocios que probablemente tú no conozcas.</b></p>
      <p><b>A continuacion te presentamos los negocios vinculados a nuestra App.</b></p>
      </div>
      <div>
        {cosas}
      </div>
      { (this.state.isLoading)? "...Cargando": null }
      </div>
    )
  }
}

export default List;
