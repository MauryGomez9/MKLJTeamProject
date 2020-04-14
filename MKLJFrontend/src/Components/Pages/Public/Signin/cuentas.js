import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../../Private/Backlog/Backlog.css';
import { IoIosSync, IoMdAddCircle, IoIosRemove, IoIosSettings } from 'react-icons/io';
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
      naxios.get('/api/security/')
        .then( (resp)=>{
          this.setState({things:resp.data, isLoading:false});
        })
        .catch( (err)=>{
          console.log(err)
        })
      ;
  }

 
  render(){
    const items = this.state.things.map(
        (thing)=>{
          return (
            <div className="thingItem" key={thing._id}>
              <span>Id: {thing._id}</span>
              <span>Email: {thing.email}</span>
              <span>Fecha de creación: {thing.dateCreated}</span>
              <span>Roles: {thing.roles}</span>
              <span className="updateThing">
                <Link to={`/cuentasUpdate/${thing._id}`}>
                <IoIosSettings size="2em"/>
                </Link>
                <Link to={`/cuentasDelete/${thing._id}`}>
                <IoIosRemove size="2em"/>
                </Link>
             </span>
              <span className="updateThing" onClick={()=>{this.handleClick(thing._id);}}>
              </span>
            </div>);
        }
      );
    return (
      <div className="listHolder">
      <h1>Cuentas Ari Rescue</h1>
      <h2>Cantidad de Cuentas: {this.state.things.length}</h2>
      <div>
        {items}
      </div>
      { (this.state.isLoading)? "...Cargando": null }
      </div>
    )
  }
}

export default List;
