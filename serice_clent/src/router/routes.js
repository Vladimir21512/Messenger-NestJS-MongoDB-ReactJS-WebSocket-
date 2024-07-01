import {AUTH_ROUTE, MAIN_ROUTE, LOGIN_ROUTE} from "./path";
import MainComponent from "../components/MainComponent";
import Auth from "../components/Auth";
import Login from "../components/Login";
export const publicRoutes = [
    {
        path:AUTH_ROUTE,
        Component: Auth
    },
    {
        path:LOGIN_ROUTE,
        Component: Login
    }
]
export const authRoutes = [
    {
        path: MAIN_ROUTE,
        Component: MainComponent
    }
]