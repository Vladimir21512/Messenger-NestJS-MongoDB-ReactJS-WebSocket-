import React, {useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'
import {authRoutes} from "../router/routes";
import {publicRoutes} from "../router/routes";
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import Redirect from "./Redirect";

const AppRouter = observer(() => {
    const {user} = useContext(Context);

    return (
        <Routes>
            {user.isAuth ?
                authRoutes.map(({path, Component})=>{
                    return(
                        <Route key={path} exact path={path} element={<Component/>}/>
                    )
                    }
                )
                :
                <>
                    <Route path={'*'} element={<Redirect/>}/>
                </>
            }
            {publicRoutes.map(({path, Component})=>
                <Route key={path} path={path} element={<Component/>} exact/>
            )}
        </Routes>
    );
});
export default AppRouter;