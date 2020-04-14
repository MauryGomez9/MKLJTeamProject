import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './Backlog.css';
import { IoIosShuffle, IoIosMenu, IoIosCash} from 'react-icons/io';
import { naxios } from '../../../../Utilities';

function ListItem(props){
  return(
    <div key={props._id}>
      <b>
        <Link to={`/detail/${props._id}`}>{props.desc}</Link>
      </b>
    </div>
  );
}

class List extends Component{
  constructor(){
    super();
    this.state = {
      things:[],
      isLoading: false,
      error: false,
    }
  }
  componentDidMount(){
      this.setState({isLoading:true});
      naxios.get('/api/eventos/')
        .then( (resp)=>{
          this.setState({things:resp.data, isLoading:false});
        })
        .catch( (err)=>{
          alert(err);
        })
      ;
  }

 
  render(){
    const items = this.state.things.map(
        (thing)=>{
          return (
            <div className="thingItem" key={thing._id}>
              <span>{thing.descripcion}</span>
              <span>{thing.informacion}</span>
              <span>{thing.fecha}</span>
              <span>{thing.foto}</span>
            </div>);
        }
      );
    return (
      <div className="listHolder">
        <div className="inicio"><h1>Actividades Semanales</h1></div>
      <div className="cantidades">
      <h2>Eventos: {this.state.things.length}</h2>
      <p><b>Ven y conoce las actividades que presentan nuestros negocios afiliados.</b></p>
      <p><b>A continuacion te presentamos las actividades de esta semana.</b></p>
      </div>
      <div>
        {items}
      </div>
      { (this.state.isLoading)? "...Cargando": null }
      </div>
    )
  }
}

export default List;
