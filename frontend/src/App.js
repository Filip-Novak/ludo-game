import React from 'react';
import { observer } from 'mobx-react'
import UserStore from './stores/UserStore';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Menu from './Menu';
import figures from './images/figures.png';
/*import './App.css';*/
import Game from './Game/Game';/**/

class App extends React.Component{

  async componentDidMount() {

    try {
      let res = await fetch('/isLoggedIn', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      let result = await res.json();
      if (result && result.success){
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
      } else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      }
    }
    catch(e){
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
    }
  }

  render() {
    /*if(UserStore.loading){
      return (
          <div className="app">
            <div className='container'>
              <div className='cont-loading'>
                <div className='loading'>
                  Loading, please wait...
                </div>
              </div>
            </div>
          </div>
      );
    } else {
      if (UserStore.isLoggedIn) {
        return (
            <div className="app">
              <div className='container'>
                  <Menu />
              </div>
            </div>
        );
      }
      return (
          <div className="app">
            <div className='container'>

              <h1>Ludo game!</h1>

                <div className='row'>
                  <div className='col-log' >
                    <LoginForm />
                  </div>
                  <div className='col-img' >
                    <img src={figures} className="figures-image" alt="Figures" />
                  </div>
                  <div className='col-reg' >
                    <RegisterForm />
                  </div>
                </div>
            </div>
          </div>
      );
    }*/
    return (
        <div className="app">
           <Game />
        </div>
    );
  }
}

export default observer(App);
