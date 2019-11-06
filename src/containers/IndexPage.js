import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Form, Input, Image, Loader, Segment, Dimmer, Label} from 'semantic-ui-react';
import {ListRoomRows} from '../components/ListRoomRows';
// import {SearchingTab} from '../components/SearchingTab';
import 'semantic-ui-css/semantic.min.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import {encrypt} from '../components/sha256';


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

export class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadedRooms: false,
            isLoadedParam: false,
            roomDetailOpen: false,
            rooms: [],
            roomIds: [],
            status: [],
            statusIds: [],
            roomTypeOther: [],
            roomTypeOtherIds: [],
            listoption: [],
            listoptionIds: [],
            roomidselected: '',
            statusSelected: ''
        };

        [
            'getListRoomDetails',
            'UpdateCheckInRoom',
            'handleChangeRoomIDSelect',
            'handleChangeStatusIDSelect',
            'getListStatus',
            'renderSearchForm',
            'renderListRooms',
            'getroomTypeOther',
            'getlistoption',
            'handleClearSearching',
            'CheckoutRoom',
            'getIPAddress',
            'sha256'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    async getListRoomDetails(filter) {
        console.log("getListRoomDetails");
        this.setState({
            isLoadedRooms: false,
        });
        await fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=listRoomsDetail")
            .then(res => res.json())
            .then(
                (result) => {
                    let strs = [];
                    let ids = [];
                    let tmp = [];
                    let tmp2 = {};
                    console.log(result);
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        console.log(tmp)
                        strs.push(tmp);
                        tmp2 = {};
                        tmp2['key'] = tmp['roomid'];
                        tmp2['text'] = tmp['roomDescription'];
                        tmp2['value'] = tmp['roomid'];
                        ids.push(tmp2);
                    }
                    // debugger;
                    if (filter) {
                        let newstr = strs.filter(function (item) {
                            return item[filter.id] == filter.value;
                        });
                        this.setState({
                            isLoadedRooms: true,
                            rooms: newstr,
                            roomIds: ids
                        });
                    } else {
                        this.setState({
                            isLoadedRooms: true,
                            rooms: strs,
                            roomIds: ids
                        });
                    }
                }, (error) => {
                    this.setState({
                        isLoadedRooms: false,
                    });
                }
            )
    }

    getListStatus() {
        fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=listStatus")
            .then(res => res.json())
            .then(
                (result) => {
                    let strs = [];
                    let ids = [];
                    let tmp = [];
                    let tmp2 = {};
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        strs.push(tmp);
                        tmp2 = {};
                        tmp2['key'] = tmp['statusId'];
                        tmp2['text'] = tmp['description'];
                        tmp2['value'] = tmp['statusId'];
                        ids.push(tmp2);
                    }
                    this.setState({
                        isLoadedParam: true,
                        status: strs,
                        statusIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoadedParam: false,
                    });
                }
            )
    }

    getlistoption() {
        fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=listoption")
            .then(res => res.json())
            .then(
                (result) => {
                    let strs = [];
                    let ids = [];
                    let tmp = [];
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        strs.push(tmp);
                        ids.push(tmp['optionId']);
                    }
                    this.setState({
                        isLoadedParam: true,
                        listoption: strs,
                        listoptionIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoadedParam: false,
                    });
                }
            )
    }

    getroomTypeOther() {
        fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=PricebyOther")
            .then(res => res.json())
            .then(
                (result) => {
                    let strs = [];
                    let ids = [];
                    let tmp = [];
                    let tmp2 = {};
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        strs.push(tmp);
                        tmp2 = {};
                        tmp2['key'] = tmp['roomType'];
                        tmp2['text'] = tmp['description'];
                        tmp2['value'] = tmp['roomType'];
                        ids.push(tmp2);
                    }
                    this.setState({
                        isLoadedParam: true,
                        roomTypeOther: strs,
                        roomTypeOtherIds: ids
                    });
                }, (error) => {
                    this.setState({
                        isLoadedParam: false,
                    });
                }
            )
    }

    async UpdateCheckInRoom(id, checkinTime, roomClass, options, totalOptionPrice, roomId, noteText) {
        console.log(noteText);
        let formatted_date = '';
        if (isMobile.iOS()) {
            formatted_date = checkinTime;
        } else {
            let current_datetime = checkinTime;
            formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        }

        let encoded = "checkinTime=" + formatted_date +
            "&roomClass=" + roomClass +
            "&options=" + options +
            "&noteText=" + noteText +
            "&totalOptionPrice=" + totalOptionPrice;

        await fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=checkin&id=' + id, {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            let isSuccess = false;
            await response.json().then(function (data) {
                console.log(data);
                data['result'] == 'error' ? msgerr = JSON.stringify(data["error"]["message"]) : isSuccess = true;
            });

            let stt = response.status;
            if (stt == 200) {
                if (!msgerr) {
                    toast.success("Đặt phòng " + roomId + " thành công!", {position: toast.POSITION.TOP_RIGHT});
                } else {
                    toast.error("Error:" + JSON.stringify(msgerr));
                }
            } else {
                toast.error("Something is wrong, please check log for detail!");
            }

        }).then(() => {
            this.handleClearSearching();
        })
    }

    async CheckoutRoom(id, checkinTime, roomClass, options, totalOptionPrice, roomId, action, checkoutTime, totalRoomPrice, totalPrice, noteText) {
        console.log("CheckoutRoom index page");
        console.log(id);
        console.log(checkinTime);
        console.log(roomClass);
        console.log(options);
        console.log(totalOptionPrice);
        console.log(roomId);
        console.log(action);
        console.log(checkoutTime);
        console.log(noteText);

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
            "&roomId=" + roomId +
            "&options=" + options +
            "&totalOptionPrice=" + totalOptionPrice +
            "&totalRoomPrice=" + totalRoomPrice +
            "&totalPrice=" + totalPrice +
            "&noteText=" + noteText +
            "&checkoutTime=" + formattedcheckout_date;

        if (action == "checkout") {
            await fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=checkout&id=' + id, {
                method: 'POST',
                body: encoded,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            }).then(async function (response) {
                let msgerr = '';
                let result = [];
                await response.json().then(function (data) {
                    data['result'] == 'error' ? msgerr = JSON.stringify(data["error"]["message"]) : result = data['data'];
                });

                let stt = response.status;
                if (stt == 200) {
                    if (!msgerr) {
                        toast.success("Thanh toán " + roomId + " thành công!", {position: toast.POSITION.TOP_RIGHT});
                    } else {
                        toast.error("Error:" + JSON.stringify(msgerr));
                    }
                } else {
                    toast.error("Something is wrong, please check log for detail!");
                }

            }).then(() => {
                this.handleClearSearching();
            })
        }
    }

    handleClearSearching() {
        this.setState({
            roomidselected: '',
            statusSelected: '',
        });
        this.getListRoomDetails();
    }

    handleChangeRoomIDSelect(event, val = null) {
        if (val == null)
            return;
        this.setState({
            roomidselected: val['value'],
            statusSelected: ''
        }, () => {
            let filter = {'id': 'roomid', 'value': val['value']};
            this.getListRoomDetails(filter);
        });
    }

    handleChangeStatusIDSelect(event, val = null) {
        if (val == null)
            return;
        this.setState({
            statusSelected: val['value'],
            roomidselected: ''
        }, () => {
            let filter = {'id': 'status', 'value': val['value']};
            this.getListRoomDetails(filter);
        });
    }

    renderSearchForm() {
        if (this.state.isLoadedParam == false) {
            return (<Segment>
                <Dimmer active inverted>
                    <Loader size='large'>Loading</Loader>
                </Dimmer>
                <Image src='images/loader.png'/>
            </Segment>);
        }

        let listRoomIds = this.state.roomIds;
        let listStatusIds = this.state.statusIds;
        let styleDisable = {'pointerEvents': ''};
        // debugger;
        if (!this.state.isLoadedRooms || !this.state.isLoadedParam) {
            styleDisable = {'pointerEvents': 'none'};
        }
        var newlistRoomIds = '';
        if (listRoomIds.length > 0) {
            listRoomIds.map((item) => {
                let tmp = {
                    title: item.key,
                    description: item.text
                }
                item['title'] = item.key;
                item['description'] = item.text;
            });
        }
        return (
            <Segment padded style={styleDisable}>
                {/*{listRoomIds.length > 0 && <SearchingTab listRoomId={listRoomIds}/>}*/}
                {/*<Input fluid icon='search plus' action='Search' placeholder='Search...'/>*/}
                <Label attached='top left' onClick={this.handleClearSearching}>Refresh</Label>
                <br/>
                <Form.Group widths='equal'>
                    <Form.Select
                        fluid
                        icon=''
                        label='Lọc theo Phòng'
                        value={this.state.roomidselected}
                        onChange={this.handleChangeRoomIDSelect}
                        options={listRoomIds}
                        placeholder='RoomIDs'
                    />
                    <Form.Select
                        fluid
                        icon=''
                        label='Lọc theo trạng thái'
                        value={this.state.statusSelected}
                        options={listStatusIds}
                        onChange={this.handleChangeStatusIDSelect}
                        placeholder='Status'
                    />
                </Form.Group>
            </Segment>
        );
    }

    renderListRooms() {
        const {rooms, statusIds, roomTypeOtherIds, listoptionIds, listoption} = {...this.state};

        if (this.state.isLoadedRooms == false) {
            return (<Segment>
                <Dimmer active inverted>
                    <Loader size='large'>Loading</Loader>
                </Dimmer>
                <Image src='images/loader.png'/>
            </Segment>);
        }

        return (
            <Segment padded>
                <Label attached='top'>Room List</Label>
                <ListRoomRows roomsInfo={rooms}
                              statusList={statusIds}
                              roomTypeOther={roomTypeOtherIds}
                              listoptionIds={listoptionIds}
                              listoption={listoption}
                              UpdateCheckInRoom={this.UpdateCheckInRoom}
                              CheckoutRoom={this.CheckoutRoom}
                />
            </Segment>
        );
    }

    async sha256(message) {
        console.log(encrypt("bangth"));
    }


    getIPAddress() {
        // var https = require('https');
        // var callback = function(err, ip){
        //     if(err){
        //         return console.log(err);
        //     }
        //     console.log('Our public IP is', ip);
        //     // do something here with the IP address
        // };
        // https.get({
        //     host: 'api.ipify.org',
        // }, function(response) {
        //     var ip = '';
        //     response.on('data', function(d) {
        //         ip += d;
        //     });
        //     response.on('end', function() {
        //         if(ip){
        //             callback(null, ip);
        //         } else {
        //             callback('could not get public ip address :(');
        //         }
        //     });
        // });
        // sessionStorage.setItem('key', 'value');

        fetch("https://api.ipify.org/?format=json", {
            method: "GET",
            // body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        ipadd: result["ip"],
                    })
                }, (error) => {
                    console.log(error);
                }
            )
    }

    componentDidMount() {
        console.log(this.props.userInfo);
        this.getIPAddress();
        this.getListRoomDetails();
        this.getListStatus();
        this.getroomTypeOther();
        this.getlistoption();
    }

    render() {
        // console.log(this.state.statusIds);
        // console.log(this.state.statusSelected);
        return (
            <div>
                {/*<ToastContainer style={{fontSize: '20px', textAlign: 'center'}}/>*/}
                <Form>
                    {this.renderSearchForm()}
                    {this.renderListRooms()}
                </Form>
                <br/><br/>
            </div>
        );
    }
}

IndexPage.propTypes = {
    userInfo: PropTypes.object
}