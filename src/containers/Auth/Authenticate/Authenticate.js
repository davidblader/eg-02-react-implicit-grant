import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';

/**
 * This element immediately starts the DocuSign authentication process
 */
class Authenticate extends Component {
    componentDidMount () {
        this.props.onSetAuthRedirectPath('/');
        this.props.onDSAuth();
    }

    render () {
        return <Redirect to="/"/>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetAuthRedirectPath: (path) => dispatch( actions.setAuthRedirect( path ) ),
        onDSAuth: () => dispatch( actions.dsAuthStart() ),
    };
};

export default connect(null, mapDispatchToProps)(Authenticate);