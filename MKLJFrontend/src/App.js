import React , {Component} from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import { setJWT, setUnAuthHandler, getLocalStorage, setLocalStorage, removeLocalStorage } from './Utilities';
import { AnimatedSwitch } from 'react-router-transition';
import { pageTransitions as transition, mapGlideStyles as mapStyles } from './Transition';
import PrivateRoute from './PrivateRoute';

import NavBar from './Components/Common/NavBar/NavBar';
import Home from './Components/Pages/Public/Home/Home';
import Login from './Components/Pages/Public/Login/Login';

import Sigin from './Components/Pages/Public/Signin/Sigin';
import Dashboard from  './Components/Pages/Private/Dashboard/Dashboard';
import Backlog  from './Components/Pages/Private/Backlog/Backlog';
import Backneg  from './Components/Pages/Private/Backneg/Backneg';
import DetailNegAdd from './Components/Pages/Private/Detailneg/DetailNegAdd';
import DetailNegUpdate from './Components/Pages/Private/Detailneg/DetailNegUpdate';
import DetailNegDelete from './Components/Pages/Private/Detailneg/DetailNegDelete';
import Mostrar  from './Components/Pages/Public/ProductosDisponibles/mostrar';
import Eventos  from './Components/Pages/Public/ProductosDisponibles/eventos';
import DetailAdd from './Components/Pages/Private/Detail/DetailAdd';
import DetailUpdate from './Components/Pages/Private/Detail/DetailUpdate';
import DetailDelete from './Components/Pages/Private/Detail/DetailDelete';
import Cuentas from './Components/Pages/Public/Signin/cuentas';
import CuentasUpdate from './Components/Pages/Public/Signin/cuentasUpdate';
import CuentasDelete from './Components/Pages/Public/Signin/cuentasDelete';


class App extends Component {
  constructor(){
    super();
    // verificar los datos de local storage
    this.state =  {
      "auth":( JSON.parse(getLocalStorage('auth')) ||
      {
        logged: false,
        token: false,
        user: {}
      })
    };
    this.setAuth = this.setAuth.bind(this);
    this.setUnAuth = this.setUnAuth.bind(this);

    setJWT(this.state.auth.token);
    setUnAuthHandler(this.setUnAuth);
  } // constructor


  setUnAuth(error){
    this.setAuth(false,{});
  }

  setAuth(token, user){
    setJWT(token);
    let _auth = {
      logged: token && true,
      token: token,
      user: user
    };
    setLocalStorage('auth', JSON.stringify(_auth));
    this.setState({
      auth: _auth
    });
  }

  render(){
    return (
      <Router>
        <section className="container">
        <NavBar auth={this.state.auth} />
          <AnimatedSwitch
            {... transition}
            mapStyles={mapStyles}
            className="switch-wrapper"
          >
              <Route path="/" exact render={(props) => (<Home {...props} auth={this.state.auth} setUnAuth={this.setUnAuth} />)} />
              <Route path="/login" render={ (props)=>(<Login {...props} auth={this.state.auth} setAuth={this.setAuth} />) } />
              <Route path="/Eventos" component={Eventos}/>
              <Route path="/Mostrar" component={Mostrar}/>
              <PrivateRoute path="/signin"  auth={this.state.auth} component={Sigin} />
              <PrivateRoute path="/main" auth={this.state.auth} component={Dashboard} />
              <Route path="/backneg" component={Backneg} />
              <PrivateRoute path="/negocioadd" auth={this.state.auth} component={DetailNegAdd} />
              <PrivateRoute path="/negocioupdate/:id" auth={this.state.auth} component={DetailNegUpdate} />
              <PrivateRoute path="/negocioDelete/:id" auth={this.state.auth} component={DetailNegDelete} />
              <Route path="/backlog" component={Backlog} />
              <PrivateRoute path="/detailadd" auth={this.state.auth} component={DetailAdd} />
              <PrivateRoute path="/detailupdate/:id" auth={this.state.auth} component={DetailUpdate} />
              <PrivateRoute path="/detailDelete/:id" auth={this.state.auth} component={DetailDelete} />
              <PrivateRoute path="/cuentas" auth={this.state.auth} component={Cuentas} />
              <PrivateRoute path="/cuentasUpdate/:id" auth={this.state.auth} component={CuentasUpdate} />
              <PrivateRoute path="/cuentasDelete/:id" auth={this.state.auth} component={CuentasDelete} />
          </AnimatedSwitch>
        </section>
      </Router>
    );
  }
}
export default App;
