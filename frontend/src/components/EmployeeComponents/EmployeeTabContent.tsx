import Layout, {Content, Header } from "antd/es/layout/layout";
import EmployeeMainComponent from "./EmployeeMainComponent";
import { Space } from "antd";
import "../../styles/EmployeeTabContent.css";
import "../../styles/WelcomeComponent.css";
import CreateEmployeeButtonComponent, {ButtonModes} from "./Operations/CreateEmployeeButtonComponent";
import React from "react";
import DeleteEmployeeButtonComponent from "./Operations/DeleteEmployeeButtonComponent";

/**
 * Содержимое вкладки с сотрудниками.
 */
const EmployeeTabContent: React.FC = () => {
    return (
        <>
            <Header className={"main-window-buttons-panel-style"}>
                <div className={"buttons-style"}>
                    <Space>
                        <CreateEmployeeButtonComponent mode={ButtonModes.CREATE}/>
                        <CreateEmployeeButtonComponent mode={ButtonModes.EDIT}/>
                        <DeleteEmployeeButtonComponent/>
                    </Space>
                </div>
            </Header>
            <Layout className={"white-background-style"}>
                <Content className={"main-window-content white-background-style"}>
                    <EmployeeMainComponent/>
                </Content>
            </Layout>
        </>
    );
};

export default EmployeeTabContent;