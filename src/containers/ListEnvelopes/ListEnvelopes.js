import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import CheckToken from '../../hoc/CheckToken/CheckToken';
import Button from '../../components/UI/Button/Button';
import Envelopes from '../../components/Envelopes/Envelopes' 
import { isAuthenticated } from '../../shared/utility'

class ListEnvelopes extends Component {
    state = {
        envelopes: null
    }

    componentDidMount() {
        // If no envelopes then initiate fetch
        if (!this.props.startingUp
            && this.props.isAuthenticated 
            && this.props.envelopes.length === 0
            && !this.props.listEnvError) {
            this.props.listEnvelopesStart(
                this.props.baseUrlCors, 
                this.props.token, 
                this.props.accountId);
        }
    }

    refreshList  = () => {
        this.props.listEnvelopesStart(
            this.props.baseUrlCors, 
            this.props.token, 
            this.props.accountId)
    }

    render () {
        let errorMessage = null;
        if ( this.props.listEnvError ) {
            errorMessage = (
                <h3>Problem: {this.props.listEnvError}</h3>
            );
        }

        return (
            <CheckToken>
                <div className='ListEnvelopes'>
                    {errorMessage}
                    <p><Button clicked={this.refreshList}>Refresh envelope list</Button></p>
                    <Envelopes envelopes={this.props.envelopes} />
                </div>
            </CheckToken>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: isAuthenticated(state),
        baseUrlCors: state.dsAuth.baseUrlCors,
        token: state.dsAuth.token,
        accountId: state.dsAuth.accountId,
        envelopes: state.listEnv.envelopes,
        listEnvError: state.listEnv.listEnvError,
        startingUp: state.dsAuth.startingUp,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        listEnvelopesStart: (baseUrlCors, token, accountId) => 
            dispatch(actions.listEnvelopesStart(baseUrlCors, token, accountId))
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( ListEnvelopes );