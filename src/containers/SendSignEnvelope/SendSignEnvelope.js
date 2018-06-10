import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';
import CheckToken from '../../hoc/CheckToken/CheckToken';
import { isAuthenticated } from '../../shared/utility'
import './SendSignEnvelope.css';


class SendSignEnvelope extends Component {
    state = {
        envelopeForm: {
            signer1Name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    label: "Signer's Name"
                },
                value: '', //'Effie Perine',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            signer1Email: {
                elementType: 'input',
                elementConfig: {
                    label: "Signer's email",
                    type: 'email',
                    // placeholder: "Signer's email"
                },
                value: '', // 'effie@detective.agency'
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            count: {
                elementType: 'input',
                elementConfig: {
                    label: 'Number of xylophones ordered',
                    type: 'number',
                    placeholder: 'count'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 1,
                    maxLength: 10,
                    isNumeric: true
                },
                valid: false,
                touched: false
            },
        },
        formIsValid: false
    }

    orderHandler = ( event ) => {
        event.preventDefault();
  
        const formData = {};
        for (let formElementIdentifier in this.state.envelopeForm) {
            formData[formElementIdentifier] = this.state.envelopeForm[formElementIdentifier].value;
        }
        this.props.sendSignEnvelopeStart(
            this.props.baseUrlCors, 
            this.props.token, 
            this.props.accountId, 
            formData);
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedFormElement = updateObject(this.state.envelopeForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.envelopeForm[inputIdentifier].validation),
            touched: true
        });
        const updatedOrderForm = updateObject(this.state.envelopeForm, {
            [inputIdentifier]: updatedFormElement
        });
        
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({envelopeForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render () {
        const formElementsArray = [];
        for (let key in this.state.envelopeForm) {
            formElementsArray.push({
                id: key,
                config: this.state.envelopeForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                        <Input 
                            key={formElement.id}
                            label={formElement.config.elementConfig.label}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>Order</Button>
            </form>
        );
        return (
            <CheckToken>
                <div className='SendEnv'>
                    <h4>Enter your Envelope Information</h4>
                    {form}
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
        sendEnvError: state.sendSignEnv.error,
        startingUp: state.dsAuth.startingUp,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        sendSignEnvelopeStart: (baseUrlCors, token, accountId, envData) => 
            dispatch(actions.sendSignEnvelopeStart(baseUrlCors, token, accountId, envData))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendSignEnvelope);