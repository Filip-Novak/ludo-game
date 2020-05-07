import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import MenuButton from "./MenuButton";
import SubmitButton from "./SubmitButton";
import InputField from "./InputField";
import UserStore from "./stores/UserStore";
import Menu from "./Menu";

class ChangePswrd extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            username: UserStore.username,
            oldPassword:'',
            newPassword1:'',
            newPassword2:'',
            buttonDisabled: false
        }
    }

    setInputValue(property, val) {
        val = val.trim();
        if (val.length > 15) {
            return;
        }
        this.setState({
            [property]: val
        })
    }

   resetForm(type) {
        if (type === 1) {
            this.setState({
                oldPassword:'',
                newPassword1:'',
                newPassword2:'',
                buttonDisabled: false
            })
        } else if (type === 2) {
            this.setState({
                oldPassword:'',
                buttonDisabled: false
            })
        } else if (type === 3) {
            this.setState({
                newPassword1:'',
                newPassword2:'',
                buttonDisabled: false
            })
        }
    }

    async doChangePswrd() {
        if(!this.state.oldPassword) {
            return;
        }
        if(!this.state.newPassword1) {
            return;
        }
        if(!this.state.newPassword2) {
            return;
        }
        if(this.state.newPassword1 !== this.state.newPassword2){
            alert('Error, your new password and confirmation password do not match !!!');
            this.resetForm(3);
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {
            let res = await fetch('/changePassword', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.newPassword1
                })
            });

            let result = await res.json();
            if(result && result.success) {
                window.confirm(result.msg);
                this.resetForm(1);
            } else if(result && result.success === false) {
                alert(result.msg);
                this.resetForm(2);
            }
        } catch(e) {
            console.log(e);
            this.resetForm(1);
        }
    }

    render() {
        return (
                <Router>
                    <Route path="/changePassword" exact render={() => {
                        return (
                            <div className="changePswrd">
                                <div className="changeForm">
                                    <div className="row-Pswrd">
                                        <label title="Password">Password</label>
                                        <InputField
                                            type='password'
                                            placeholder='Password'
                                            value={this.state.oldPassword ? this.state.oldPassword : ''}
                                            onChange={ (val) => this.setInputValue('oldPassword', val) }
                                        />
                                    </div>
                                    <div className="row-NewPswrd">
                                        <label title="New password">New password</label>
                                         <InputField
                                             type='password'
                                             placeholder='New password'
                                             value={this.state.newPassword1 ? this.state.newPassword1 : ''}
                                             onChange={ (val) => this.setInputValue('newPassword1', val) }
                                         />
                                    </div>
                                    <div className="row-ConfPswrd">
                                         <label title="Confirm new password">Confirm new password</label>
                                         <InputField
                                             type='password'
                                             placeholder='Confirm password'
                                             value={this.state.newPassword2 ? this.state.newPassword2 : ''}
                                             onChange={ (val) => this.setInputValue('newPassword2', val) }
                                         />
                                    </div>
                                    <div className="row-ChangeBtn">
                                        <SubmitButton
                                            text='Change Password'
                                            disabled={this.state.buttonDisabled}
                                            onClick={ () => this.doChangePswrd() }
                                        />
                                    </div>
                                </div>
                                <div className="backBtn">
                                    <Link to='/'>
                                        <MenuButton
                                            text = {'Back'}
                                            disabled={this.state.buttonDisabled}
                                        />
                                    </Link>
                                </div>
                            </div>
                        );
                    }}/>

                    <Switch>
                        <Route exact path="/" component={Menu} />
                    </Switch>
                </Router>
        );
    }
}

export default ChangePswrd;