import  React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { IoIosSync, IoMdAddCircle, IoIosAddCircleOutline } from 'react-icons/io';
import {Link} from 'react-router-dom';


import { paxios } from '../../../../Utilities';

import "./Backneg.css";

export default class BackloNeggAdd extends Component {
  constructor(props){
    super();
    this.state={
      negocios:[],
      hasMore:true,
      page:1,
      itemsToLoad:10
    }
    this.loadMore = this.loadMore.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount(){
    console.log(this.props);
  }
  loadMore(page){
    const items  = this.state.itemsToLoad;
    const uri = `/api/negocios/page/${page}/${items}/NA`;
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
  handleClick(key){
    const { dd, type } = this.props.match.params;
    let body = { dd, type};
    paxios.put(`/api/negocios/${key}`, body)
    .then(
      ({data})=>{
        this.props.history.goBack();
      }
    )
    .catch(
      (err)=>{
        console.log(err);
      }
    );
  }

  render() {
  const items = this.state.negocios.map(
    (negocio)=>{
      return (
        <div className="negocioItem" key={negocio._id}>
          <span>{negocio.descripcion}</span>
          <span className="updatenegocio" onClick={()=>{this.handleClick(negocio._id);}}>
              <IoIosAddCircleOutline size="2em"/>
          </span>
        </div>);
    }
  );

  if(!items.length) items.push(
    <div className="negocioItem" key="pbBackLogAddOne">
      <span>Nuevo negocio</span>
      <Link to="/detailadd"><IoMdAddCircle size="2.5em" /></Link>
    </div>);

  return (
    <section>
      <h1>
        Añadir nuevo producto
      </h1>
      <div className="backneg" ref={(ref)=> this.scrollParentRef = ref}>
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
