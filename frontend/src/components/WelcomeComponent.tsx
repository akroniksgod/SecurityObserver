import React, {useEffect} from "react";
import {Layout, Typography} from "antd";
import {Header} from "antd/es/layout/layout";
import EmployeeStore from "../stores/EmployeeStore";
import EmployeeTabContent from "./EmployeeComponents/EmployeeTabContent";
import { observer, inject } from "mobx-react";
import "../styles/WelcomeComponent.css";

/**
 * Свойства встречающего компонента.
 */
interface WelcomeComponentProps {
    employeeStore?: EmployeeStore,
}

/**
 * Первый компонент, который видит пользователь.
 * Необходим для разметки некоторых компонентов.
 */
const WelcomeComponent: React.FC<WelcomeComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Заменяет / на /employees.
     */
    useEffect(() => {
        if (window.location.pathname === "/") {
            window.history.replaceState({}, "", "/employees");
        }
    }, []);

    return (
        <Layout className={"white-background-style"}>
            <Header className={"main-window-header"}>
                <Typography.Title className={"header-title"}>
                    SecurityObserver
                </Typography.Title>
            </Header>
            <Layout className={"main-window-layout"}>
                <EmployeeTabContent/>
            </Layout>
        </Layout>
    );
}));



export default WelcomeComponent;