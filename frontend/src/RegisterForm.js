import React from "react";
import InputField from './InputField';
import SubmitButton from "./SubmitButton";

class RegisterForm extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            username:'',
            email:'',
            password:'',
            buttonDisabled: false
        }
    }

    setInputValue(property, val) {
        val = val.trim();    /*odstrani medzery zo zaciatku a konca*/

        if(property === 'email') {
            if (val.length > 25) {
                return;
            }
        } else if (val.length > 15) {
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
                email: '',
                password: '',
                buttonDisabled: false
            })
        } else if (type === 2) {
            this.setState({
                username: '',
                buttonDisabled: false
            })
        } else if (type === 3) {
            this.setState({
                email: '',
                buttonDisabled: false
            })
        }
    }

    async doRegistration() {
        if(!this.state.username) {
            return;
        }

        if(!this.state.email) {
            return;
        }

        if(!this.state.password) {
            return;
        }

        var re = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/ ;
        if(!re.test(this.state.email)) {
            alert('An error occurred, invalid email !!!');
            this.resetForm(3);
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {
            let res = await fetch('/registration', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                })
            });

            let result = await res.json();
            if(result && result.success) {
               window.confirm(result.msg);
               this.resetForm(1);
            } else if(result && result.success === false) {

                alert(result.msg);
                if (result.badName && result.badEmail) {
                    this.resetForm(1);
                } else if (result.badName) {
                    this.resetForm(2);
                } else if (result.badEmail) {
                    this.resetForm(3);
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
            <div className="registerForm">
                Registration
                <InputField
                    type='text'
                    placeholder='Username'
                    value={this.state.username ? this.state.username : ''}
                    onChange={ (val) => this.setInputValue('username', val) }
                />
                <InputField
                    type='email'
                    placeholder='Email'
                    value={this.state.email ? this.state.email : ''}
                    onChange={ (val) => this.setInputValue('email', val) }
                />
                <InputField
                    type='password'
                    placeholder='Password'
                    value={this.state.password ? this.state.password : ''}
                    onChange={ (val) => this.setInputValue('password', val) }
                />

                <SubmitButton
                    text='Register'
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doRegistration() }
                />
            </div>
        );
    }
}

export default RegisterForm;