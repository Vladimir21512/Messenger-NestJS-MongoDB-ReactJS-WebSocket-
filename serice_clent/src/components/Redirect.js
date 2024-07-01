import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import {AUTH_ROUTE, LOGIN_ROUTE} from "../router/path";

const Redirect = () => {
    const history = useNavigate()
    useEffect(()=>{
        history(LOGIN_ROUTE)
    },[])
    return (
        <>
        </>
    );
};

export default Redirect;