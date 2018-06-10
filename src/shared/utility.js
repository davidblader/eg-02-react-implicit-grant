export const updateObject = (oldObject, updatedProperties) => {
    // We are specially handling top level elements named 'accounts' and 'envelopes'
    // Both are arrays of objects. We are only copying it 
    // here. Update it some other way.
    
    let newObject =  {
        ...oldObject,
        ...updatedProperties
    };

    if (oldObject.accounts) {
        newObject.accounts = newObject.accounts.map(a => ({...a}))
    }
    if (updatedProperties.accounts) {
        // It must be the entire array
        newObject.accounts = updatedProperties.accounts.map(a => ({...a}))       
    }

    if (oldObject.envelopes) {
        newObject.envelopes = newObject.envelopes.map(a => ({...a}))
    }
    if (updatedProperties.envelopes) {
        // It must be the entire array
        newObject.envelopes = updatedProperties.envelopes.map(a => ({...a}))       
    }
    
    return newObject;
};

/**
 * This method returns true if the use is currently authenticated
 * including a non-expired access token
 * @param {*} state The state from the Redux store
 */
export const isAuthenticated = ( state ) => {
    const authenticated1 = state.dsAuth.token && state.dsAuth.accountId
        , tokenBufferTime = 60 * 60 * 1000// 1 hour in milliseconds
        , now = Date.now()
        , tokenIsFresh = state.dsAuth.expirationDate && 
            state.dsAuth.expirationDate > (now + tokenBufferTime)
    return authenticated1 && tokenIsFresh
}
    
export const checkValidity = ( value, rules ) => {
    let isValid = true;
    if ( !rules ) {
        return true;
    }

    if ( rules.required ) {
        isValid = value.trim() !== '' && isValid;
    }

    if ( rules.minLength ) {
        isValid = value.length >= rules.minLength && isValid
    }

    if ( rules.maxLength ) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if ( rules.isEmail ) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test( value ) && isValid
    }

    if ( rules.isNumeric ) {
        const pattern = /^\d+$/;
        isValid = pattern.test( value ) && isValid
    }

    return isValid;
}
