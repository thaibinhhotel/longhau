import React from 'react'
import {Button, Form, Header, Image, Label, Modal, Input} from 'semantic-ui-react'
import PropTypes from "prop-types";
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import {ListOption} from '../components/ListOption';
import 'semantic-ui-css/semantic.min.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';


Moment.locale('vn');
momentLocalizer();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

export class RoomDetailCheckout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            CheckinTimeSelected: (this.props.roominfo.fromTime ? new Date(this.props.roominfo.fromTime.replace(/[A-Za-z]/g, ' ')) : new Date()),
            roomCurrentClass: (this.props.roominfo.roomCurrentClass ? this.props.roominfo.roomCurrentClass : ''),
            optionListSelected: (this.props.roominfo.moreOptionId ? JSON.parse(this.props.roominfo.moreOptionId) : ''),
            roomDetailOpen: false,
            isSubmiting: false,
            CheckinDate: (this.props.roominfo.fromTime ? this.props.roominfo.fromTime.substr(0, 10) : ((new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1) + "-" + (new Date()).getDate())),
            CheckinTime: (this.props.roominfo.fromTime ? this.props.roominfo.fromTime.substr(11, 5) : ((new Date()).getHours() + ":" + ((new Date()).getMinutes())))
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
            'handleChangeInputTime'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    async checkinRoomSubmit() {
        // window.location.reload(true);
        await this.setState({
            isSubmiting: true
        });
        let action = 'checkin';
        let roomId = this.props.roominfo.roomid;
        let id = this.props.roominfo.id;
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

        await this.props.UpdateCheckInRoom(id, checkinTime, roomClass, options, totalOptionPrice, roomId);
        // await sleep(5000);
        await this.setState({
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

    onChangePickedTime(val) {
        this.setState({
            CheckinTimeSelected: val
        });
    }

    handleChangeTypeIDSelect(event, val = null) {
        if (val == null)
            return;
        this.setState({
            roomCurrentClass: val['value']
        });
    }

    handleChangeOption(data = []) {
        this.setState({
            optionListSelected: data
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
        this.setState({
            CheckinDate: data.value
        });
    }

    handleChangeInputTime(val, data) {
        this.setState({
            CheckinTime: data.value
        });
    }

    render() {
        const {roominfo, roomTypeOther} = this.props;
        let imgsrc = roominfo.roomid ? 'images/room' + roominfo.roomid + '.png' : 'images/room101.png';
        let CheckinDate = this.state.CheckinDate;
        let CheckinTime = this.state.CheckinTime;
        // console.log(this.state.CheckinTimeSelected);
        // console.log(this.props.roominfo);

        // if (isMobile.iOS() && roominfo.fromtime) {}

        return (
            <Modal style={{width: '100%'}} open={this.state.roomDetailOpen} closeIcon
                   onClose={() => {
                       this.setState({roomDetailOpen: false})
                   }}
                   trigger={<a className="image fit"><img style={{boxShadow: '10px 10px 5px #ccc'}}
                                                          onClick={this.handleShowModal}
                                                          src="images/hotelico.jpeg" alt="Hotel"/></a>}>
                <Modal.Header>Room Detail</Modal.Header>
                <Modal.Content image scrolling style={{height: '450%'}}>
                    <Image size='medium' src={imgsrc} wrapped/>
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
                                <div style={{width: '100%'}}><Input style={{width: '50%'}}
                                                                    onChange={this.handleChangeInputDate}
                                                                    value={CheckinDate} type="date"
                                                                    name="CheckinDate"/>
                                    <Input style={{width: '50%'}} onChange={this.handleChangeInputTime}
                                           value={CheckinTime} type="time" name="CheckinTime"/>
                                </div>
                            }
                        </div>
                        <hr/>
                        <div>
                            <label>
                                <b>Room Type:</b>
                            </label>
                            <Form.Select
                                fluid
                                icon=''
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
                    <Button primary onClick={this.checkinRoomSubmit} disabled={this.state.isSubmiting}>
                        CheckIn
                    </Button>
                    <Button primary onClick={this.handleHideModal} disabled={this.state.isSubmiting}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}


RoomDetailCheckout.propTypes = {
    roominfo: PropTypes.object,
    statusList: PropTypes.array,
    roomTypeOther: PropTypes.array,
    listoptionIds: PropTypes.array,
    listoption: PropTypes.array,
    UpdateCheckInRoom: PropTypes.func
}