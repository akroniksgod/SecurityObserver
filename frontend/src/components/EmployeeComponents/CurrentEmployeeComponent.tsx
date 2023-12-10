import {Button, Card, Col, Empty, Form, Input, QRCode, Result, Row, Spin, Typography} from "antd";
import React, { useEffect } from "react";
import EmployeeStore from "../../stores/EmployeeStore";
import { inject, observer } from "mobx-react";
import { ParseObjectProp } from "../../types/EmployeesTypes";
import {useNavigate, useParams } from "react-router-dom";
import ChartComponent from "./ChartComponent";
import "../../styles/EmployeeComponent.css";

/**
 * Метаданные для формы сотрудников.
 */
const employeeMetadata = [
    {label: "ФИО", property: "fullName", key: "emplyee_fullName"},
    {label: "Дата рождения", property: "birthDate", key: "emplyee_birthDate"},
    {label: "Адрес", property: "address", key: "emplyee_address"},
    {label: "Должность", property: "position", key: "emplyee_position"},
    {label: "Телефон", property: "phoneNumber", key: "emplyee_phoneNumber"},
    {label: "QR", property: "QR", key: "emplyee_QR"},
    {label: "Посещаемость", property: "chart", key: "emplyee_chart"},
];

/**
 * Свойства компонента, отображающего информацию о сотруднике фирмы.
 */
interface CurrentEmployeeComponentProps {
    employeeStore?: EmployeeStore;
}

/**
 * Компонент, отображающий информацию о сотруднике фирмы.
 */
const CurrentEmployeeComponent: React.FC<CurrentEmployeeComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Выбранный сотрудник.
     */
    const employee = props.employeeStore?.currentEmployee ?? null;

    /**
     * Сотрудник, из которого можно получить значение по его свойству.
     */
    const parsableEmployee: ParseObjectProp = employee ?? {};

    /**
     * Переключатель пути в адресной строке браузера.
     */
    const navigate = useNavigate();

    /**
     * Перенаправляет на компонент со списком сотрудников.
     */
    const redirectBack = () => {
        navigate("/employees");
    };

    return (
        <Card title={"Информация о сотруднике"} style={{margin: "10px 20px 0 70px"}} bodyStyle={{height: "calc(100vh - 170px)"}}>
            {employee !== null ?
                <Spin
                    size={"large"}
                    className={"form-with-chart-style"}
                    spinning={props.employeeStore?.isEmployeeMenuLoading || props.employeeStore?.isEmployeeLoading}
                >
                    <Form
                        className={"employee-form-style"}
                        colon={false}
                        labelAlign={"left"}
                        labelCol={{ flex: '150px' }}
                        labelWrap
                        wrapperCol={{ flex: 1 }}
                    >
                        {employeeMetadata.map(metadata => {
                            const label = (<div className={"employee-form-item-label-style"}>{metadata.label}</div>);
                            if (metadata.property === "QR") {
                                return (
                                    <Form.Item label={label} key={metadata.key} style={{ maxWidth: 500 }}>
                                        <QRCode value={`${parsableEmployee["fullName"]} ${parsableEmployee["id"]}`} />
                                    </Form.Item>
                                );
                            }

                            if (metadata.property === "chart") {
                                return (
                                    <Form.Item label={""} key={metadata.key} style={{ maxWidth: 500 }}>
                                        <ChartComponent/>
                                    </Form.Item>
                                );
                            }

                            const val = parsableEmployee[metadata.property];
                            return (
                                <Form.Item label={label} key={metadata.key} style={{ maxWidth: 500 }}>
                                    <Input readOnly value={val}/>
                                </Form.Item>
                            );
                        })}
                    </Form>
                </Spin>
                : <Empty className={"empty-employee-data-style"} image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            }
        </Card>
    );
}));

export default CurrentEmployeeComponent;