
import React from 'react';
import DateTimePicker from 'react-bootstrap-date-time-picker';
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/react-bootstrap-date-time-picker/lib/react-bootstrap-date-time-picker.css'

export class test extends React.Component {
    render() {
        const dates = this.dates;

        return <DateTimePicker/>
    }
}