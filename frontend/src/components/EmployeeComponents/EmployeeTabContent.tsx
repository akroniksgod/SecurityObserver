import Layout, {Content, Header } from "antd/es/layout/layout";
import EmployeeMainComponent from "./EmployeeMainComponent";
import { Button, Space } from "antd";
import "../../styles/EmployeeTabContent.css";
import "../../styles/WelcomeComponent.css";

/**
 * Содержимое вкладки с сотрудниками.
 */
const EmployeeTabContent: React.FC = () => {
    return (
        <>
            <Header className={"main-window-buttons-panel-style"}>
                <div className={"buttons-style"}>
                    <Space>
                        <Button disabled>Добавить</Button>
                        <Button disabled>Редактировать</Button>
                        <Button disabled>Удалить</Button>
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