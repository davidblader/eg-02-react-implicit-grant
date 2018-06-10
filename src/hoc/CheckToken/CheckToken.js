import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import Aux from '../../hoc/Aux/Aux';
import { isAuthenticated } from '../../shared/utility'

class CheckToken extends Component {

    componentDidMount() {
        // Don't do anything if starting up...
        if (!this.props.startingUp) {
            // If not authenticated or current token doesn't have an hour of life 
            // left, then:
            //   1. Save current route so we can be returned here.
            //   2. Ask user to authenticate. 
            if (!this.props.isAuthenticated) {
                this.props.onSetAuthRedirectPath(this.props.history.location.pathname);
                this.props.history.push('/dsAuthenticate');
            }
        }
    }

    componentDidUpdate(){
        if (!this.props.startingUp) {
            // If not authenticated or current token doesn't have an hour of life 
            // left, then:
            //   1. Save current route so we can be returned here.
            //   2. Ask user to authenticate. 
            if (!this.props.isAuthenticated) {
                this.props.onSetAuthRedirectPath(this.props.history.location.pathname);
                this.props.history.push('/dsAuthenticate');
            }
        }    
    }

    render () {
        return (<Aux>{this.props.children}</Aux>);
    }
};

const mapStateToProps = state => {
    return {
        startingUp: state.dsAuth.startingUp,
        isAuthenticated: isAuthenticated(state)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetAuthRedirectPath: (path) => dispatch( actions.setAuthRedirect( path ) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( withRouter(CheckToken) );