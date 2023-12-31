import React from "react";
import {Layout} from "antd";
import {Content} from "antd/es/layout/layout";
import SearchEmployeesComponent from "./SearchEmployeesComponent";
import { observer, inject } from "mobx-react";
import Sider from "antd/es/layout/Sider";
import EmployeeMenuComponent from "./EmployeeMenuComponent";
import "../../styles/EmployeeMainComponent.css";
import "../../styles/WelcomeComponent.css";
import CurrentEmployeeComponent from "./CurrentEmployeeComponent";
import { BaseStoreInjector } from "../../types/EmployeesTypes";

/**
 * Свойства компонента для отображения других компонентов, связанных с сотрудником.
 */
interface WelcomeComponentProps extends BaseStoreInjector {
}

/**
 * Основной компонент для отображения компонентов, связанных с сотрудником.
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