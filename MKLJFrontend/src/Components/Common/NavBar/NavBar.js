import React from 'react';
import { NavLink } from 'react-router-dom';
// https://react-icons.netlify.com/
import {IoIosHome,IoIosImage, IoIosLogIn, IoIosKey, IoIosToday, IoIosList} from 'react-icons/io';
import './NavBar.css';

const NavItem = ({ to, children, ...rest }) => {
  return (
    <NavLink activeClassName="activeNav" exact to={to}>{children}</NavLink>
  );
};

export default ({auth, unSetAuth})=>{
  console.log(auth);
  if(!auth.logged){
    return(
      <nav>
        <NavItem to="/">&nbsp;Home</NavItem>
        <NavItem to="/mostrar">&nbsp;Negocios</NavItem>
        <NavItem to="/eventos">&nbsp;Eventos</NavItem>
        <NavItem to="/login">&nbsp;Iniciar Sesión</NavItem>
      </nav>
    )
  } else {
    return (
      <nav>
        <NavItem to="/">&nbsp;Home</NavItem>
        <NavItem to="/backneg">&nbsp;Negocio</NavItem>
        <NavItem to="/backlog">&nbsp;Evento</NavItem>
        <NavItem to="/signin">&nbsp;Nuevo Usuario</NavItem>
      </nav>
    )
  }
}
