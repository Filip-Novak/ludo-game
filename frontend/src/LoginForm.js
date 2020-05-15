import React from 'react';
import InputField from './InputField';
import SubmitButton from "./SubmitButton";
import UserStore from "./stores/UserStore";

class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            username:'',
            password:'',
            buttonDisabled: false
        }
    }

    setInputValue(property, val) {
        val = val.trim();    /*odstrani medzery zo zaciatku a konca*/
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
                username: '',
                password: '',
                buttonDisabled: false
            })
        } else if (type === 2) {
            this.setState({
                password: '',
                buttonDisabled: false
            })
        }
    }

    async doLogin() {
        if(!this.state.username) {
            return;
        }
        if(!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        });

        try {
            let res = await fetch('/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            });

            let result = await res.json();
            if(result && result.success) {
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
            } else if(result && result.success === false) {
                alert(result.msg);
                if (result.badPassword) {
                    this.resetForm(2);
                } else {
                    this.resetForm(1);
                }
            }
        } catch(e) {
            console.log(e);
            this.resetForm(1);
        }
    }

    render() {
        return (
            <div className="loginForm">
                Login
                <InputField
                    type='text'
                    placeholder='Username'
                    value={this.state.username ? this.state.username : ''}
                    onChange={ (val) => this.setInputValue('username', val) }
                />
                <InputField
                    type='password'
                    placeholder='Password'
                    value={this.state.password ? this.state.password : ''}
                    onChange={ (val) => this.setInputValue('password', val) }
                />

                <SubmitButton
                    text='Log in'
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doLogin() }
                />
            </div>
        );
    }
}

export default LoginForm;