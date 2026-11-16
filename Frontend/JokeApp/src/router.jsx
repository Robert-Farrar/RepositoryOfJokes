import {createBrowserRouter, redirect} from 'react-router-dom';
import Home from './pages/UserHome';
import About from './pages/About';
import Login, {HandleSubmit as loginAction} from './pages/Login';
import { getAuth } from './Models/Auth';
import { AdminHome } from './pages/AdminHome';

const requireAuth = () => {
    const {token} = getAuth();
    if(!token){
        return redirect('/');
    }

    return null;
};

const adminAuth = () => {
    const {token, role} = getAuth();

    if(!token){
        return redirect('/');
    }

    return null;
}




{/*define router here and export it so that home can use it*/}
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
        action: loginAction
    },
    {
        path : '/UserHome',
        element: <Home />,
        loader: requireAuth
    },
    {
        path : '/About',
        element: <About />,
    },
    {
        path: '/AdminHome',
        element: <AdminHome />,
        loader: adminAuth
    }
]);