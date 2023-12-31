import {Card, Empty, Form, Input, QRCode, Spin} from "antd";
import React from "react";
import { inject, observer } from "mobx-react";
import {BaseStoreInjector, ParseObjectProp } from "../../types/EmployeesTypes";
import "../../styles/EmployeeComponent.css";
import "../../styles/CurrentEmployeeComponent.css";
import 'dayjs/locale/ru';
import EmployeeWorkSpanComponent from "./FormItems/EmployeeWorkSpanComponent";
import EmployeeWorkedDaysComponent from "./FormItems/EmployeeWorkedDaysComponent";
import EmployeeEntranceTimeComponent from "./FormItems/EmployeeEntranceTimeComponent";

/**
 * Свойства метеданных.
 * @param label Надпись.
 * @param property Свойство.
 * @param key Ключ.
 */
interface FormMetadataProps {
    label: string;
    property: string;
    key: string;
}

/**
 * Метаданные для формы сотрудников.
 */
const employeeMetadata: Readonly<FormMetadataProps[]> = [
    {label: "ФИО", property: "fullName", key: "employee_fullName"},
    {label: "Дата рождения", property: "birthDate", key: "employee_birthDate"},
    {label: "Адрес", property: "address", key: "employee_address"},
    {label: "Должность", property: "position", key: "employee_position"},
    {label: "Телефон", property: "phoneNumber", key: "employee_phoneNumber"},
    {label: "QR", property: "QR", key: "employee_QR"},
    {label: "Время работы за период", property: "timeCheck", key: "employee_timeCheck"},
    {label: "Количество дней за месяц", property: "daysCheck", key: "employee_daysCheck"},
    {label: "Время входа в здание", property: "entranceTimeCheck", key: "employee_entranceTimeCheck"},
];

/**
 * Свойства компонента, отображающего информацию о сотруднике фирмы.
 */
interface CurrentEmployeeComponentProps extends BaseStoreInjector {
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
     * Возвращает дочерний элемент формы.
     * @param metadata Некоторые метаданные по элементу.
     */
    const getFormItem = (metadata: FormMetadataProps) => {
        let component;
        switch (metadata.property) {
            case "QR": component = (<QRCode value={`${parsableEmployee["fullName"]} ${parsableEmployee["id"]}`}/>); break;
            case "timeCheck": component = (<EmployeeWorkSpanComponent/>); break;
            case "daysCheck": component = (<EmployeeWorkedDaysComponent/>); break;
            case "entranceTimeCheck": component = (<EmployeeEntranceTimeComponent/>); break;
            default: {
                const val = parsableEmployee[metadata.property];
                component = (<Input readOnly defaultValue={val}/>);
                break;
            }
        }

        const label = (<div className={"employee-form-item-label-style"}>{metadata.label}</div>);
        return (
            <Form.Item label={label} key={metadata.key} className={"form-item-style"}>
                {component}
            </Form.Item>
        );
    };

    return (
        <Card title={"Информация о сотруднике"} className={"card-style"}>
            {employee !== null ?
                <Spin
                    size={"large"}
                    className={"form-with-chart-style"}
                    spinning={props.employeeStore?.isEmployeeMenuLoading || props.employeeStore?.isEmployeeLoading}
                >
                    <Form
                        key={`employee_${employee.id}_form`}
                        className={"employee-form-style"}
                        colon={false}
                        labelAlign={"left"}
                        labelCol={{ flex: '220px' }}
                    >
                        {employeeMetadata.map(getFormItem)}
                    </Form>
                </Spin>
                : <Empty
                    className={"empty-employee-data-style"}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={"Выберите сотрудника"}
                />
            }
        </Card>
    );
}));

export default CurrentEmployeeComponent;