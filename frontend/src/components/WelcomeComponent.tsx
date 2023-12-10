import React, {useEffect} from "react";
import {Layout} from "antd";
import {Header} from "antd/es/layout/layout";
import SearchEmployeesComponent from "./SearchEmployeesComponent";
import EmployeesTableComponent from "./EmployeesTableComponent";
import EmployeeStore from "../stores/EmployeeStore";
import { observer, inject } from "mobx-react";

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
                <SearchEmployeesComponent/>
            </Header>
            <Layout className={"main-window-layout"}>
                <EmployeesTableComponent/>
            </Layout>
        </Layout>
    );
}));

export default WelcomeComponent;