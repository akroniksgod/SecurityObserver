import React from 'react';
import '../styles/App.css';
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import WelcomeComponent from "./WelcomeComponent";

/**
 * Маршрутизатор.
 * Необходим для переадресации на нужные компоненты взависимости от текущей ссылки.
 */
const router = createBrowserRouter([
    {
        path: '/',
        element: (<Outlet/>),
        children: [
            {
                path: '/',
                element: (<WelcomeComponent/>),
                children: [
                    {
                        path: "/employees",
                        element: (<WelcomeComponent/>),
                        children: [
                            {
                                path: "/employees/:employeeId",
                                element: (<WelcomeComponent/>),
                            }
                        ]
                    },
                ]
            },
        ]
    },
]);

/**
 * Начальный компонент приложения.
 */
const App = () => {
    return (
        <RouterProvider router={router}/>
    );
};

export default App;
