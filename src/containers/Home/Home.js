import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class Home extends Component {
    render () {
        const regularHome = (
            <div className='Home'>
                <h2>Welcome to the DocuSign React Example</h2>
                <p>This example uses your private CORS gateway to communicate with DocuSign.</p>
                <p>The following operations are available:</p>
                <h2><NavLink to='/listEnvelopes'>List Envelopes</NavLink></h2>
                <h2><NavLink to='/SendSignEnvelope'>Send and Sign an Envelope</NavLink></h2>
            </div>
        );

        const badConfig = <h2>Problem: Please set the DocuSign client_id (Integration Key) and other configuration settings.</h2>;

        return this.props.badDsConfig ? badConfig : regularHome;
    }
}

const mapStateToProps = state => {
    return {
        badDsConfig: state.dsAuth.badDsConfig,
    }
}

export default connect( mapStateToProps)( Home );