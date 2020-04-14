import React, {Component} from 'react';
import Button from '../../../Common/Btns/Buttons';
import './Home.css';
import { IoIosLogOut } from 'react-icons/io';


export default class Home extends Component{
  
  render() {
    
    return (
        <div className="home">
          <div>
          <h1>BIENVENIDO A TURISTICA HN</h1>
          </div>

            <div>&nbsp;</div>
            <div className="btnout">
            {(this.props.auth.logged) ? (<div className="half"><Button customClass="fond" onClick={(e) => { this.props.setUnAuth(false)}}><IoIosLogOut/>&nbsp;Salir</Button></div>):null}
            
            </div>
        </div>
    
    );
    
  }
}
  





