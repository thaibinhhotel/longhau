import React from 'react'
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
} from 'semantic-ui-react'
import PropTypes from "prop-types";
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import {ListOption} from '../components/ListOption';
import {ConfirmFinalMessage} from '../components/ConfirmFinalMessage';
import 'semantic-ui-css/semantic.min.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import {ListRoomRows} from "./ListRoomRows";

Moment.locale('vn')
momentLocalizer()

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

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

export class RoomDetailCheckin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            CheckinTimeSelected: (this.props.roominfo.fromTime ? new Date(this.props.roominfo.fromTime.replace(/[A-Za-z]/g, ' ')) : new Date()),
            CheckoutTimeSelected: (this.props.roominfo.toTime ? new Date(this.props.roominfo.toTime.replace(/[A-Za-z]/g, ' ')) : new Date()),
            roomCurrentClass: (this.props.roominfo.roomCurrentClass ? this.props.roominfo.roomCurrentClass : ''),
            optionListSelected: (this.props.roominfo.moreOptionId ? JSON.parse(this.props.roominfo.moreOptionId) : ''),
            roomDetailOpen: false,
            isSubmiting: false,
            CheckinDate: (this.props.roominfo.fromTime ? this.props.roominfo.fromTime.substr(0, 10) : ((new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1) + "-" + (new Date()).getDate())),
            CheckinTime: (this.props.roominfo.fromTime ? this.props.roominfo.fromTime.substr(11, 5) : ((new Date()).getHours() + ":" + ((new Date()).getMinutes()))),
            CheckoutDate: (this.props.roominfo.toTime ? this.props.roominfo.toTime.substr(0, 10) : ((new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1) + "-" + (new Date()).getDate())),
            CheckoutTime: (this.props.roominfo.toTime ? this.props.roominfo.toTime.substr(11, 5) : ((new Date()).getHours() + ":" + ((new Date()).getMinutes()))),
            checkoutInfo: {
                checkinTime: '',
                checkoutTime: '',
                roomClass: '',
                totalOptionPrice: 0,
                totalRoomPrice: 0,
                totalPrice: 0,
                CheckinTimeSelected: '',
                CheckoutTimeSelected: '',
            },
            noteText: this.props.roominfo.noteText,
        };

        [
            'checkinRoomSubmit',
            'getStatusDes',
            'onChangePickedTime',
            'handleChangeTypeIDSelect',
            'handleChangeOption',
            'handleShowModal',
            'handleHideModal',
            'handleChangeInputDate',
            'handleChangeInputTime',
            'handleChangeInputCheckoutDate',
            'handleChangeInputCheckoutTime',
            'onChangePickedCheckoutTime',
            'CheckoutRoom',
            'getCheckoutInfo',
            'checkoutRoomSubmit',
            'disableCheckout'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    show = () => this.setState({open: true})
    handleConfirm = () => this.setState({open: false})
    handleCancel = () => this.setState({open: false})

    checkoutRoomSubmit() {
        this.setState({
            isSubmiting: true,
        });
        let action = 'checkout';
        let roomId = this.props.roominfo.roomid;
        let id = this.props.roominfo.id;
        let noteText = this.state.noteText;
        let checkinTime = '';
        let checkoutTime = '';
        if (isMobile.iOS()) {
            checkinTime = this.state.CheckinDate + " " + this.state.CheckinTime;
            checkoutTime = this.state.CheckoutDate + " " + this.state.CheckoutTime;
        } else {
            checkinTime = this.state.CheckinTimeSelected;
            checkoutTime = this.state.CheckoutTimeSelected;
        }
        let roomClass = this.state.roomCurrentClass;
        let options = JSON.stringify(this.state.optionListSelected);

        let totalOptionPrice = 0;
        for (let i = 0; i < this.state.optionListSelected.length; i++) {
            totalOptionPrice = totalOptionPrice + this.state.optionListSelected[i].total;
        }

        let totalRoomPrice = this.state.checkoutInfo.totalRoomPrice;
        let totalPrice = this.state.checkoutInfo.totalPrice;

        if (!checkinTime) {
            toast.error('Bạn chưa chọn giờ vào!');
            this.setState({
                isSubmiting: false
            });
            return;
        }
        if (!checkoutTime) {
            toast.error('Bạn chưa chọn giờ ra!');
            this.setState({
                isSubmiting: false
            });
            return;
        }
        if (!roomClass) {
            toast.error('Bạn chưa chọn loại phòng!');
            this.setState({
                isSubmiting: false
            });
            return;
        }

        this.props.CheckoutSubmitRoom(id, checkinTime, roomClass, options, totalOptionPrice, roomId, action, checkoutTime, totalRoomPrice, totalPrice, noteText);
    }

    async checkinRoomSubmit() {
        this.setState({
            isSubmiting: true
        });
        let action = 'checkin';
        let roomId = this.props.roominfo.roomid;
        let id = this.props.roominfo.id;
        let noteText = this.state.noteText;

        let checkinTime = '';
        if (isMobile.iOS()) {
            checkinTime = this.state.CheckinDate + " " + this.state.CheckinTime;
            console.log(checkinTime)
        } else {
            checkinTime = this.state.CheckinTimeSelected;
        }
        let roomClass = this.state.roomCurrentClass;
        let options = JSON.stringify(this.state.optionListSelected);

        let totalOptionPrice = 0;
        for (let i = 0; i < this.state.optionListSelected.length; i++) {
            totalOptionPrice = totalOptionPrice + this.state.optionListSelected[i].total;
        }

        if (!checkinTime) {
            toast.error('Bạn chưa chọn giờ vào!');
            this.setState({
                isSubmiting: false
            });
            return;
        }
        if (!roomClass) {
            toast.error('Bạn chưa chọn loại phòng!');
            this.setState({
                isSubmiting: false
            });
            return;
        }

        await this.props.UpdateCheckInRoom(id, checkinTime, roomClass, options, totalOptionPrice, roomId, noteText);
        // await sleep(5000);
        this.setState({
            roomDetailOpen: false,
            isSubmiting: false
        });
    }

    getStatusDes(status = '') {
        let stt = this.props.statusList;
        for (var i = 0; i < stt.length; i++) {
            if (stt[i].key == status) {
                return stt[i].text;
            }
        }
    }

    disableCheckout() {
        let checkoutInfo = {...this.state.checkoutInfo};
        checkoutInfo.totalPrice = 0;
        this.setState({
            checkoutInfo: checkoutInfo
        });
    }

    onChangePickedTime(val) {
        this.disableCheckout();
        this.setState({
            CheckinTimeSelected: val
        });
    }

    onChangePickedCheckoutTime(val) {
        this.disableCheckout();
        this.setState({
            CheckoutTimeSelected: val
        });
    }

    handleChangeTypeIDSelect(event, val = null) {
        if (val == null)
            return;
        this.disableCheckout();
        this.setState({
            roomCurrentClass: val['value']
        });
    }

    handleChangeOption(data = []) {
        let checkoutInfo = {...this.state.checkoutInfo};
        let total = 0;
        for (var i = 0; i < data.length; i++) {
            total = total + data[i].total;
        }
        checkoutInfo['totalPrice'] = checkoutInfo["totalRoomPrice"] + total;
        this.setState({
            optionListSelected: data,
            checkoutInfo: checkoutInfo
        });
    }

    handleShowModal() {
        this.setState({
            roomDetailOpen: true
        });
    }

    handleHideModal() {
        this.setState({
            roomDetailOpen: false
        });
    }

    handleChangeInputDate(val, data) {
        this.disableCheckout();
        this.setState({
            CheckinDate: data.value
        });
    }

    handleChangeInputCheckoutDate(val, data) {
        this.disableCheckout();
        this.setState({
            CheckoutDate: data.value
        });
    }

    handleChangeInputCheckoutTime(val, data) {
        this.disableCheckout();
        this.setState({
            CheckoutTime: data.value
        });
    }

    handleChangeInputTime(val, data) {
        this.disableCheckout();
        this.setState({
            CheckinTime: data.value
        });
    }

    getCheckoutInfo() {
        this.setState({
            isSubmiting: true,
        });
        let action = 'getTotalConfirm';
        let roomId = this.props.roominfo.roomid;
        let id = this.props.roominfo.id;
        let checkinTime = '';
        let checkoutTime = '';
        if (isMobile.iOS()) {
            checkinTime = this.state.CheckinDate + " " + this.state.CheckinTime;
            checkoutTime = this.state.CheckoutDate + " " + this.state.CheckoutTime;
        } else {
            checkinTime = this.state.CheckinTimeSelected;
            checkoutTime = this.state.CheckoutTimeSelected;
        }
        let roomClass = this.state.roomCurrentClass;
        let options = JSON.stringify(this.state.optionListSelected);

        let totalOptionPrice = 0;
        for (let i = 0; i < this.state.optionListSelected.length; i++) {
            totalOptionPrice = totalOptionPrice + this.state.optionListSelected[i].total;
        }

        if (!checkinTime) {
            toast.error('Bạn chưa chọn giờ vào!');
            this.setState({
                isSubmiting: false
            });
            return;
        }
        if (!checkoutTime) {
            toast.error('Bạn chưa chọn giờ ra!');
            this.setState({
                isSubmiting: false
            });
            return;
        }

        if (checkinTime > checkoutTime) {
            toast.error('Giờ ra phải sau giờ vào!');
            this.setState({
                isSubmiting: false
            });
            return;
        }

        if (!roomClass) {
            toast.error('Bạn chưa chọn loại phòng!');
            this.setState({
                isSubmiting: false
            });
            return;
        }

        this.CheckoutRoom(id, checkinTime, roomClass, options, totalOptionPrice, roomId, action, checkoutTime);
    }

    async CheckoutRoom(id, checkinTime, roomClass, options, totalOptionPrice, roomId, action, checkoutTime) {
        let formatted_date = '';
        let formattedcheckout_date = '';
        if (isMobile.iOS()) {
            formatted_date = checkinTime;
            formattedcheckout_date = checkoutTime;
        } else {
            let current_datetime = checkinTime;
            let current_Checkoutdatetime = checkoutTime;
            formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
            formattedcheckout_date = current_Checkoutdatetime.getFullYear() + "-" + (current_Checkoutdatetime.getMonth() + 1) + "-" + current_Checkoutdatetime.getDate() + " " + current_Checkoutdatetime.getHours() + ":" + current_Checkoutdatetime.getMinutes() + ":" + current_Checkoutdatetime.getSeconds();
        }

        // console.log(formatted_date);
        // console.log(formattedcheckout_date);

        let encoded = "checkinTime=" + formatted_date +
            "&roomClass=" + roomClass +
            "&options=" + options +
            "&totalOptionPrice=" + totalOptionPrice +
            "&checkoutTime=" + formattedcheckout_date;
        let result = '';
        if (action == "getTotalConfirm") {
            await fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=checkoutinfo', {
                method: 'POST',
                body: encoded,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            }).then(async function (response) {
                let msgerr = '';

                await response.json().then(function (data) {
                    data['result'] == 'error' ? msgerr = JSON.stringify(data["error"]["message"]) : result = data['data'];
                });
                let stt = response.status;
                if (stt == 200) {
                    if (!msgerr) {
                        console.log(result);
                    } else {
                        toast.error("Error:" + JSON.stringify(msgerr));
                    }
                } else {
                    toast.error("Something is wrong, please check log for detail!");
                }

            }).then(() => {
                this.setState({
                    checkoutInfo: {
                        checkinTime: checkinTime,
                        checkoutTime: checkoutTime,
                        roomClass: roomClass,
                        totalOptionPrice: totalOptionPrice,
                        totalRoomPrice: result['roomPrice'],
                        totalPrice: result['totalPrice'],
                        CheckinTimeSelected: formatted_date,
                        CheckoutTimeSelected: formattedcheckout_date,
                    },
                    isSubmiting: false
                });
            })
        }
    }

    render() {
        const {roominfo, roomTypeOther} = this.props;
        let imgsrc = roominfo.roomid ? 'images/room' + roominfo.roomid + '.png' : 'images/room101.png';

        return (
            <Modal style={{width: '100%'}} open={this.state.roomDetailOpen} closeIcon
                   onClose={() => {
                       this.setState({roomDetailOpen: false})
                   }}
                   trigger={<a className="image fit"><img style={{boxShadow: '10px 10px 5px #ccc'}}
                                                          onClick={this.handleShowModal}
                                                          src="images/hotelico.jpeg" alt="Hotel"/></a>}>
                <Modal.Header>
                    <Statistic style={{marginLeft: '30%'}} horizontal size='tiny'>
                        <Statistic.Value style={{
                            color: "#00bfff",
                            fontWeight: 'bold'
                        }}>{formatNumber(this.state.checkoutInfo.totalPrice)}</Statistic.Value>
                        <Statistic.Label>vnd</Statistic.Label>
                    </Statistic>.
                </Modal.Header>
                <Modal.Content image scrolling style={{height: '450%'}}>
                    <Image size='large' src={imgsrc} wrapped>
                        <Form>
                            <TextArea placeholder='Ghi chú...' style={{minHeight: 100}}
                                      value={this.state.noteText} onChange={(event, data) => {
                                this.setState({noteText: data.value})
                            }}/>
                        </Form>
                    </Image>
                    <Modal.Description style={{width: '100%'}}>
                        <Header>{roominfo.roomDescription}</Header>
                        <b>
                            Status: {this.getStatusDes(roominfo.status)}
                        </b>
                        <hr/>
                        <label>
                            <b>Checkin:</b>
                        </label>
                        <div>
                            {!isMobile.iOS() ? <DateTimePicker value={this.state.CheckinTimeSelected}
                                                               onChange={this.onChangePickedTime}/> :
                                <div style={{width: '100%'}}><Input size='huge' style={{width: '50%'}}
                                                                    onChange={this.handleChangeInputDate}
                                                                    value={this.state.CheckinDate} type="date"
                                                                    name="CheckinDate"/>
                                    <Input size='huge' style={{width: '50%'}} onChange={this.handleChangeInputTime}
                                           value={this.state.CheckinTime} type="time" name="CheckinTime"/>
                                </div>
                            }
                        </div>
                        <Segment padded style={{display: this.props.roominfo.status == 0 ? '' : 'none'}}>
                            <div>
                                <label>
                                    <b style={{color: "#00bfff"}}>CheckOut:</b>
                                </label>
                                {!isMobile.iOS() ? <DateTimePicker value={this.state.CheckoutTimeSelected}
                                                                   onChange={this.onChangePickedCheckoutTime}/> :
                                    <div style={{width: '100%'}}><Input size='huge' style={{width: '50%'}}
                                                                        onChange={this.handleChangeInputCheckoutDate}
                                                                        value={this.state.CheckoutDate} type="date"
                                                                        name="CheckoutDate"/>
                                        <Input size='huge' style={{width: '50%'}}
                                               onChange={this.handleChangeInputCheckoutTime}
                                               value={this.state.CheckoutTime} type="time" name="CheckoutTime"/>
                                    </div>
                                }
                                <br/>
                                <Button primary style={{float: 'left', width: '45%'}} size="large"
                                        onClick={this.getCheckoutInfo} disabled={this.state.isSubmiting}>
                                    Check Price:
                                </Button>
                                {this.state.isSubmiting ?
                                    <Input size='large' loading icon='user' disabled
                                           value={formatNumber(this.state.checkoutInfo.totalRoomPrice)}
                                           label={{basic: true, content: 'vnd'}}
                                           labelPosition='right'
                                           iconPosition='left' style={{width: "40%"}} placeholder='Search...'/>
                                    :
                                    <Input size="large" icon='money bill alternate outline' disabled
                                           value={formatNumber(this.state.checkoutInfo.totalRoomPrice)}
                                           label={{basic: true, content: 'vnd'}}
                                           labelPosition='right'
                                           iconPosition='left' style={{width: "40%"}} placeholder='Search...'/>
                                }
                            </div>
                        </Segment>
                        <hr/>
                        <div>
                            <label>
                                <b>Room Type:</b>
                            </label>
                            <Form.Select
                                fluid
                                icon=''
                                size="huge"
                                // label='Room Type:'
                                value={this.state.roomCurrentClass}
                                options={roomTypeOther}
                                onChange={this.handleChangeTypeIDSelect}
                                placeholder='Type'
                            />
                        </div>
                        <hr/>
                        <Label as='a' color='teal' ribbon>
                            Thêm Sản Phẩm:
                        </Label>
                        <ListOption listoptionIds={this.props.listoptionIds}
                                    listoption={this.props.listoption}
                                    onChangeOption={this.handleChangeOption}
                                    optionListSelected={this.state.optionListSelected ? this.state.optionListSelected : []}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={this.show}
                            disabled={this.state.isSubmiting || this.state.checkoutInfo.totalPrice == 0}
                            style={{display: (this.props.roominfo.status == 0 ? '' : 'none')}}>
                        CheckOut
                    </Button>
                    <Button primary onClick={this.checkinRoomSubmit} disabled={this.state.isSubmiting}>
                        {this.props.roominfo.status == 1 ? "CheckIn" : "Update"}
                    </Button>
                    <Button primary onClick={this.handleHideModal} disabled={this.state.isSubmiting}>
                        Close
                    </Button>
                </Modal.Actions>
                <Confirm
                    open={this.state.open}
                    content={this.state.isSubmiting ?
                        <Dimmer active inverted>
                            <Loader size='large'>Hệ thống đang xử lý.</Loader>
                        </Dimmer>
                        :
                        <div style={{textAlign: 'center'}}>
                            <Segment>
                                <h3>
                                    <table>
                                        <tbody>
                                        {!isMobile.iOS() ?
                                            [<tr key='1'>
                                                <td>Giờ vào:</td>
                                                <td>{this.state.checkoutInfo.CheckinTimeSelected}</td>
                                            </tr>,
                                                <tr key='2'>
                                                    <td>Giờ ra:</td>
                                                    <td>{this.state.checkoutInfo.CheckoutTimeSelected}</td>
                                                </tr>]
                                            :
                                            [<tr key='3'>
                                                <td>Giờ vào:</td>
                                                <td>{this.state.checkoutInfo.CheckinTimeSelected}</td>
                                            </tr>,
                                                <tr key='4'>
                                                    <td>Giờ ra:</td>
                                                    <td>{this.state.checkoutInfo.CheckoutTimeSelected}</td>
                                                </tr>
                                            ]}
                                        <tr>
                                            <td>Tiền ở:</td>
                                            <td>{formatNumber(this.state.checkoutInfo.totalRoomPrice)}</td>
                                        </tr>
                                        <tr>
                                            <td>Tiền khác:</td>
                                            <td>{formatNumber((this.state.checkoutInfo.totalPrice - this.state.checkoutInfo.totalRoomPrice))}</td>
                                        </tr>
                                        <tr>
                                            <td>Tổng tiền:</td>
                                            <td>{formatNumber(this.state.checkoutInfo.totalPrice)}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </h3>
                            </Segment>
                        </div>
                    }
                    header='Confirm CheckOut'
                    onCancel={this.handleCancel}
                    onConfirm={this.checkoutRoomSubmit}
                />
            </Modal>
        );
    }
}


RoomDetailCheckin.propTypes = {
    roominfo: PropTypes.object,
    statusList: PropTypes.array,
    roomTypeOther: PropTypes.array,
    listoptionIds: PropTypes.array,
    listoption: PropTypes.array,
    UpdateCheckInRoom: PropTypes.func,
    CheckoutSubmitRoom: PropTypes.func
}