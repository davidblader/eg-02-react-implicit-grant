import React from 'react';
import Envelope from './Envelope';
import './Envelopes.css';


const envelopes = ( props ) => {

    const envelopeCount = props.envelopes.length;

    return (    
    <div className='Envelopes'>
        <h2>{envelopeCount} envelopes</h2>
        {props.envelopes.map( env => (
            <Envelope key={env.envelopeId} env={env} />
        ) )}
    </div>
    )
}

export default envelopes;