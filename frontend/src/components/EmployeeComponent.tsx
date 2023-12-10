import {Button, Form, Result, Typography} from "antd";
import React, { useEffect } from "react";
import EmployeeStore from "../stores/EmployeeStore";
import { inject, observer } from "mobx-react";
import { ParseObjectProp } from "../types/EmployeesTypes";
import {useNavigate, useParams } from "react-router-dom";

/**
 * Метаданные для формы сотрудников.
 */
const employeeMetadata = [
    {label: "ФИО", property: "fullName", key: "emplyee_fullName"},
    {label: "Дата рождения", property: "birthDate", key: "emplyee_birthDate"},
    {label: "Адрес", property: "address", key: "emplyee_address"},
    {label: "Должность", property: "position", key: "emplyee_position"},
    {label: "Телефон", property: "phoneNumber", key: "emplyee_phoneNumber"},
];

/**
 * Свойства компонента, отображающего информацию о сотруднике фирмы.
 */
interface EmployeeComponentProps {
    employeeStore?: EmployeeStore,
}

/**
 * Компонент, отображающий информацию о сотруднике фирмы.
 */
const EmployeeComponent: React.FC<EmployeeComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Выбранный сотрудник.
     */
    const employee = props.employeeStore?.currentEmployee ?? null;

    /**
     * Сотрудник, из которого можно получить значение по его свойству.
     */
    const parsableEmployee: ParseObjectProp = employee ?? {};

    /**
     * Параметры из адресной строки браузера.
     */
    const { employeeId } = useParams();

    /**
     * Изменяет текущего сотрудника по id из адресной строки.
     */
    useEffect(() => {
        if (!employeeId) return;

        const id = parseInt(employeeId);
        if (isNaN(id)) return;

        props.employeeStore?.updateCurrentEmployeeInfo(id);
    }, [employeeId]);

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
        <>
            {employee !== null ?
                <Form>
                    {employeeMetadata.map(metadata => {
                        const val = parsableEmployee[metadata.property];
                        return (
                            <Form.Item label={metadata.label} key={metadata.key}>
                                {val}
                            </Form.Item>
                        );
                    })}
                </Form>
                : <Result
                    status={"warning"}
                    title={`Нет информации по сотруднику с идентификатором ${employeeId}.`}
                    extra={
                        <Button onClick={redirectBack} type={"primary"} key={"console"}>
                            Вернуться к списку сотрудников
                        </Button>
                    }
                />
            }
        </>
    );
}));

export default EmployeeComponent;