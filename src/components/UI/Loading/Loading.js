import React from 'react';
import Spinner from '../Spinner/Spinner';
import './Loading.css';


const loading = (props) => (
    <div className='Loader'>
    <h2>{props.msg}</h2>
    <Spinner />
    </div>
);

export default loading;