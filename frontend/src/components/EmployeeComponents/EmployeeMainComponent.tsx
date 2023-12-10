import React from "react";
import {Layout, Spin} from "antd";
import {Content} from "antd/es/layout/layout";
import SearchEmployeesComponent from "./SearchEmployeesComponent";
import EmployeeStore from "../../stores/EmployeeStore";
import { observer, inject } from "mobx-react";
import Sider from "antd/es/layout/Sider";
import EmployeeMenuComponent from "./EmployeeMenuComponent";
import "../../styles/EmployeeMainComponent.css";
import "../../styles/WelcomeComponent.css";
import CurrentEmployeeComponent from "./CurrentEmployeeComponent";

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
const EmployeeMainComponent: React.FC<WelcomeComponentProps> = inject("employeeStore")(observer((props) => {
    return (
        <Layout className={"white-background-style"}>
            <Sider width={400} className={"sider-style"}>
                <SearchEmployeesComponent/>
                <EmployeeMenuComponent/>
            </Sider>
            <Content className={"employee-content-style white-background-style"}>
                <CurrentEmployeeComponent/>
            </Content>
        </Layout>
    );
}));

export default EmployeeMainComponent;