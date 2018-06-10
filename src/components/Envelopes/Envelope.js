import React from 'react';
import moment from 'moment';

const envelope = ( props ) => {
    const sent = moment(props.env.createdDateTime).format("dddd, MMMM Do YYYY, h:mm:ss a");
    return (
    <div className='Envelope' key='{prop.env.evelopeId}'>
        <p className='subject'>{props.env.emailSubject}</p>
        <p className='status'>Status: {props.env.status}</p>
        <p className='sent'>Sent: {sent}</p>
    </div>
    )
}

export default envelope;