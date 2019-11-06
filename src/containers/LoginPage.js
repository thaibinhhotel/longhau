import React from 'react';
import PropTypes from 'prop-types';
import {ListRoomRows} from "../components/ListRoomRows";
import {
    Button,
    Form,
    Header,
    Image,
    Input,
    Label,
    Modal,
    Segment,
    Statistic,
    TextArea,
    Confirm, Loader, Dimmer
} from 'semantic-ui-react';
import {encrypt} from '../components/sha256';
import {toast} from 'react-toastify';

export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errUserMsg: {
                content: "",
            },
            errPassMsg: {
                content: "",
            },
            errpinCode: {
                content: "",
            },
            userInfo: {
                token: '',
                email: '',
                ipAddress: ''
            },
            userName: '',
            passWord: '',
            pinCode: '',
            isVerified: false,
            isChecking: false
        };
        [
            'submitLogin',
            'handleChangeUser',
            'handleChangePass',
            'verifyEmail',
            'handleChangePinCode'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    handleChangePinCode(event, data) {
        this.setState({
            pinCode: data.value
        });
    }

    handleChangeUser(event, data) {
        this.setState({
            userName: data.value
        });
    }

    handleChangePass(event, data) {
        this.setState({
            passWord: data.value
        });
    }

    componentDidMount() {
        console.log(this.props.ipAddress);
    }

    verifyEmail() {
        this.setState({
            isChecking: true
        });
        let username = this.state.userName;

        let encoded = "email=" + username +
            "&ipAddress=" + this.props.ipAddress;

        console.log(encoded);
        let isValid = false;
        fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=verifyemail', {
            method: 'POST',
            body: encoded,
            headers: {"Content-type": "application/x-www-form-urlencoded"}
        }).then(async function (response) {
            let msgerr = '';
            await response.json().then(function (data) {
                console.log(data);
                data['result'] == 'error' ? msgerr = JSON.stringify(data["error"]) : isValid = true;
                if (!msgerr) {
                    toast.success("Please check your email to get PIN code!", {position: toast.POSITION.TOP_RIGHT});
                } else {
                    toast.error(msgerr);
                }
            });
        }).then(() => {
            this.setState({
                isChecking: false
            });
            if (isValid) {
                this.setState({
                    isVerified: true
                });
            }
        })
    }

    submitLogin() {
        this.setState({
            isChecking: true
        });
        console.log(this.state.passWord)
        let passWordHash = encrypt(this.state.passWord);
        let username = this.state.userName;
        let pincode = this.state.pinCode;

        let encoded = "email=" + username +
            "&pass=" + passWordHash +
            "&pincode=" + pincode +
            "&ipAddress=" + this.props.ipAddress;

        console.log(encoded);
        let isValid = false;
        let token = "";
        fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=login', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            // debugger;
            await response.json().then(function (data) {
                console.log(data);
                data['result'] == 'error' ? msgerr = JSON.stringify(data["error"]) : isValid = true;
                if (!msgerr) {
                    token = data['token'];
                    sessionStorage.setItem('tokenTBh', data['token']);
                    sessionStorage.setItem('emailTBh', username);
                    toast.success("Login Successfully!", {position: toast.POSITION.TOP_RIGHT});
                } else {
                    toast.error(msgerr);
                }
            });
        }).then(() => {
            this.setState({
                isChecking: false
            });
            if (isValid) {
                this.props.setTokenValid(username, token);
            }
        })
    }

    render() {
        return (
            <Segment>
                <Form>
                    <Form.Input
                        error={this.state.errUserMsg.content != "" ? this.state.errUserMsg : null}
                        fluid
                        onChange={this.handleChangeUser}
                        value={this.state.userName}
                        label='User_Name:'
                        name="username"
                        placeholder='Your Email'
                    />
                    {this.state.isVerified && <Form.Input
                        style={{display: this.state.isVerified ? '' : 'none'}}
                        error={this.state.errPassMsg.length > 0 ? this.state.errPassMsg : null}
                        fluid
                        onChange={this.handleChangePass}
                        value={this.state.passWord}
                        type="password"
                        label='Password:'
                        placeholder='Put Your Password here...'
                    />}

                    {this.state.isVerified && <Form.Input
                        error={this.state.errpinCode.length > 0 ? this.state.errpinCode : null}
                        fluid
                        onChange={this.handleChangePinCode}
                        value={this.state.pinCode}
                        type="number"
                        label='Pin Code:'
                        placeholder='Put your Pin code here...'
                    />}
                    {this.state.isVerified ?
                        <Button fluid size="large" onClick={this.submitLogin} disabled={this.state.isChecking} primary
                                type='submit'>
                            Submit
                        </Button>
                        :
                        <Button fluid size="large" onClick={this.verifyEmail} disabled={this.state.isChecking} primary
                                type='submit'>
                            Verify
                        </Button>
                    }
                </Form>
            </Segment>
        )
    }
}

LoginPage.propTypes = {
    ipAddress: PropTypes.string,
    setTokenValid: PropTypes.func
}

