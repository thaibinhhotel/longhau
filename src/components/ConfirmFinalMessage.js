import React, {Component} from 'react'
import {Button, Header, Icon, Modal, Loader, Dimmer} from 'semantic-ui-react'
import PropTypes from "prop-types";
import {toast} from "react-toastify";

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

export class ConfirmFinalMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: true,
            checkoutInfo: this.props.checkoutInfo
        };

        this.checkoutRoomSubmit = this.checkoutRoomSubmit.bind(this);
    }

    // componentDidMount() {
    //     this.getCheckoutInfo();
    // }
    //
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps);
    // }

    handleOpen = () => {
        this.setState({modalOpen: true});
        // this.props.getRoomCheckoutInfo();
    }

    handleClose = () => this.setState({modalOpen: false})

    async checkoutRoomSubmit() {

    }

    render() {
        // this.getCheckoutInfo();
        console.log(this.props.checkoutInfo);


        return (
            <Modal
                trigger={<Button style={{display: (this.props.roominfo.status == 0 ? '' : 'none')}} primary
                                 onClick={this.handleOpen}>CheckOut</Button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
                basic
                size='small'
                centered
            >
                <Header icon='browser' content='Check final list.'/>

                    <Modal.Content>
                        <h3>
                            This website uses cookies to ensure the best user experience.

                        </h3>
                        <Modal.Actions>
                            <Button color='green' inverted>
                                <Icon name='checkmark'/> Confirm & CheckOut
                            </Button>
                            <Button color='green' onClick={this.handleClose}  inverted>
                                <Icon name='checkmark'/> Close
                            </Button>
                        </Modal.Actions>
                    </Modal.Content>
            </Modal>
        )
    }
}

ConfirmFinalMessage.propTypes = {
    checkoutInfo: PropTypes.object,
    CheckoutRoom: PropTypes.func,
    getRoomCheckoutInfo: PropTypes.func
}