import  React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {IoIosSync, IoMdAddCircle, IoIosRemove, IoIosSettings } from 'react-icons/io';
import {Link} from 'react-router-dom';



import { paxios } from '../../../../Utilities';

import "./Backneg.css";

export default class Backneg extends Component {
  constructor(){
      super();
      this.state={
          negocios:[],
          negociose: [],
          hasMore: true,
          page:1,
          itemsToLoad:10
      }
      this.loadMore = this.loadMore.bind(this);
      this.componentDidMount = this.componentDidMount.bind((this));
  }



  loadMore(page){
    const items  = this.state.itemsToLoad;
    const uri = `/api/negocios/page/${page}/${items}`;
    paxios.get(uri)
      .then(
        ({data})=>{
          const { negocios, totalnegocios} = data;
          const loadednegocios = this.state.negocios;
          negocios.map((e)=>loadednegocios.push(e));
          if(totalnegocios){
              this.setState({
                "negocios": loadednegocios,
                "hasMore": (page * items < totalnegocios)
              });
          } else {
            this.setState({
              "hasMore": false
            });
          }
        }
        
      )
      .catch(
        (err)=>{
          console.log(err);
        }
      );
  }

  componentDidMount(){
    this.setState({isLoading:true});
    paxios.get('/api/negocios/')
      .then( (resp)=>{
        this.setState({negociose:resp.data, isLoading:false});
      })
      .catch( (err)=>{
        alert(err);
      })
    ;
}

render() {
  
  const items = this.state.negociose.map(
    (negocio)=>{
      let ima = negocio.imagen;
      return (
        <div className="negocioItem" key={negocio._id}>
          
          <span>{negocio.nombre}</span>
          <span className="updatenegocio">
            <Link to={`/negocioupdate/${negocio._id}`}>
              <IoIosSettings size="2em"/>
            </Link>
            <Link to={`/negocioDelete/${negocio._id}`}>
              <IoIosRemove size="2em"/>
            </Link>
          </span>
        </div>);
    }
  );


  if(!items.length) items.push(
    <div className="negocioItem" key="pbBackLogAddOne">
      <span>Nuevo Negocio</span>
    </div>);

  return (
    <section className="inicio">

      <h1>
        Añadir Nuevo Negocio
        <span className="addnegocio">
          <Link to="/negocioadd">
            <IoMdAddCircle size="1.5em" />
          </Link>
        </span>
      </h1>
      <div className="backneg" ref={(ref)=> this.scrollParentRef = ref}>
          <Link to="/negocioadd"><IoMdAddCircle size="2.5em" /></Link>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            useWindow={false}
            getScrollParent={()=>this.scrollParentRef}
            loader={<div key="pbBackLogLoading" className="negocioItem center"><IoIosSync/></div>}
            >
              {items}
          </InfiniteScroll>
          
      </div>
     </section>
   );

   
  }
}
