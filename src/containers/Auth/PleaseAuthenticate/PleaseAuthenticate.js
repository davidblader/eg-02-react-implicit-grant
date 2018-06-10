import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import * as actions from '../../../store/actions/index';

class PleaseAuthenticate extends Component {

    state = {
    }

    doAuthHandler = () => {
        this.props.onDSAuth();
    }

    render () {
        return (
            <div className='PleaseAuthenticate'>
                <h2>First, please Authenticate with DocuSign</h2>
                <div className='marginTop'>
                    <Button
                        clicked={this.doAuthHandler}
                        btnType="Success">Authenticate!
                    </Button>
                </div>
            </div>
        );
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onDSAuth: () => dispatch( actions.dsAuthStart() ),
    };
};

export default connect( null, mapDispatchToProps )( PleaseAuthenticate );