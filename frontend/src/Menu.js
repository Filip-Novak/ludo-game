import React from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import UserStore from "./stores/UserStore";
import MenuButton from "./MenuButton";
import ChangePswrd from "./ChangePswrd";
import Statistics from "./Statistics"
import SubmitButton from "./SubmitButton";
import Game from './Game/Game';/**/

class Menu extends React.Component{
   constructor(props) {
        super(props);
        this.state={
            buttonDisabled: false,
        }
   }

    async doLogout() {

        this.setState({
            buttonDisabled: true
        })

        try {
            let res = await fetch('/logout', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            let result = await res.json();
            if (result && result.success){
                UserStore.isLoggedIn = false;
                UserStore.username = '';
            } else if (result && result.success === false) {
                alert(result.msg);
                this.setState({
                    buttonDisabled: false
                })
            }
        }
        catch(e){
            console.log(e)
        }
    }

    render() {
        return (
            <div className="menu">
                <Router>
                    <Route path="/" exact render={() => {
                        return (
                            <div className="column">
                                <div className="row-play">
                                    <Link to='/play'>
                                        <MenuButton
                                            text={'Play'}
                                            disabled={this.state.buttonDisabled}
                                        />
                                    </Link>
                                </div>
                                <div className="row-stat">
                                    <Link to='/statistics'>
                                        <MenuButton
                                            text = {'Statistics'}
                                            disabled={this.state.buttonDisabled}
                                        />
                                    </Link>
                                </div>
                                <div className="row-pswrd">
                                    <Link to='/changePassword'>
                                        <MenuButton
                                            text = {'Change password'}
                                            disabled={this.state.buttonDisabled}
                                        />
                                    </Link>
                                </div>
                                <div className="row-logout">
                                    <SubmitButton
                                        text = {'Log out'}
                                        disabled={this.state.buttonDisabled}
                                        onClick={ () => this.doLogout() }
                                    />
                                </div>
                            </div>
                        );
                    }}/>

                    <Switch>
                        <Route exact path="/play" component={Game}/>
                        <Route exact path="/statistics" component={Statistics} />
                        <Route exact path="/changePassword" component={ChangePswrd} />
                    </Switch>
                </Router>
            </div>
        );
   }
}

export default Menu;
