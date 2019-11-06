import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {IndexPage} from './containers/IndexPage';
import {LoginPage} from './containers/LoginPage';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';
import {
    Dimmer, Image,
    Loader, Segment
} from 'semantic-ui-react';
import {ToastContainer} from "react-toastify";

class ThaiBinhHotel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTokenValid: false,
            userInfo: {
                token: sessionStorage.getItem('tokenTBh'),
                email: sessionStorage.getItem('emailTBh'),
                ipAddress: ""
            },
            isChecking: true,
        };
        [
            'checkTokenValid',
            'getIPAndCheckToken',
            'setTokenValid'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    setTokenValid(username, token) {
        // debugger;
        let userInfo = {...this.state.userInfo};
        userInfo.email = username;
        userInfo.token = token
        this.setState({
            isTokenValid: true,
            userInfo: userInfo
        });
    }

    getIPAndCheckToken() {
        this.setState({
            isChecking: true,
        });
        fetch("https://api.ipify.org/?format=json", {
            method: "GET",
            // body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => res.json())
            .then(
                (result) => {
                    console.log(result["ip"]);

                    let userInfo = {...this.state.userInfo};
                    userInfo['ipAddress'] = result["ip"]
                    this.setState({
                        userInfo: userInfo
                    });

                    if (!this.state.userInfo.token) {
                        this.setState({
                            isChecking: false
                        });
                        return;
                    }

                    this.checkTokenValid(result["ip"])
                }, (error) => {
                    console.log(error);
                }
            )
    }

    async checkTokenValid(ipAddress) {
        // let token = sessionStorage.getItem('tokenTBh');
        // let email = sessionStorage.getItem('emailTBh');
        // let ipAddress = this.getIPAddress();
        let encoded = "token=" + this.state.userInfo.token +
            "&email=" + this.state.userInfo.email +
            "&ipAddress=" + ipAddress;

        console.log(encoded);

        let isValid = false;
        fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=checkToken', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            await response.json().then(function (data) {
                console.log(data);
                data['result'] == 'error' ? msgerr = JSON.stringify(data["error"]) : isValid = true;
            });
        }).then(() => {
            if (isValid) {
                this.setState({
                    isTokenValid: true,
                    isChecking: false
                });
            } else {
                this.setState({
                    isTokenValid: false,
                    isChecking: false
                });
            }
        })
    }

    componentDidMount() {
        // sessionStorage.setItem('tokenTBh', 'fb28ea0172706c801ce7d4e1d4edcb5f');
        // sessionStorage.setItem('emailTBh', 'bang.th@mobivi.vn');
        if (!this.state.userInfo.token) {
            this.setState({
                isTokenValid: false,
                isChecking: false
            });
        }
        this.getIPAndCheckToken();
    }

    render() {
        let isTokenValid = this.state.isTokenValid;
        if (this.state.isChecking) {
            // return <Loader size="massive" active inline='centered'>System is checking your permission...</Loader>
            return <Segment>
                <Dimmer active inverted>
                    <Loader size='large'>System is checking your permission...</Loader>
                </Dimmer>
                <Image src='images/loader.png'/>
            </Segment>
        }
        return (
            <div>
                <ToastContainer style={{fontSize: '20px', textAlign: 'center'}}/>
                {isTokenValid ?
                    <IndexPage userInfo={this.state.userInfo}/>
                    :
                    <LoginPage ipAddress={this.state.userInfo.ipAddress} setTokenValid={this.setTokenValid}/>}
            </div>
        )
    }
}

ReactDOM.render(<ThaiBinhHotel/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
