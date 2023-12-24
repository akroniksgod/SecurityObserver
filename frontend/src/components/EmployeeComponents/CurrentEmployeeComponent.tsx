import {Card, Empty, Form, Input, QRCode, Spin} from "antd";
import React from "react";
import { inject, observer } from "mobx-react";
import {BaseStoreInjector, ParseObjectProp } from "../../types/EmployeesTypes";
import {useNavigate} from "react-router-dom";
import ChartComponent from "./ChartComponent";
import "../../styles/EmployeeComponent.css";
import 'dayjs/locale/ru';
import EmployeeWorkSpanComponent from "./FormItems/EmployeeWorkSpanComponent";
import EmployeeWorkedDaysComponent from "./FormItems/EmployeeWorkedDaysComponent";
import EmployeeEntranceTimeComponent from "./FormItems/EmployeeEntranceTimeComponent";

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
    {label: "Посещаемость", property: "chart", key: "employee_chart"},
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
     * Переключатель пути в адресной строке браузера.
     */
    const navigate = useNavigate();

    /**
     * Перенаправляет на компонент со списком сотрудников.
     */
    const redirectBack = () => {
        navigate("/employees");
    };

    /**
     * Возвращает дочерний элемент формы.
     * @param label Надпись элемента.
     * @param metadata Некоторые метаданные по элементу.
     * @param children Дочерние компоненты.
     */
    const getFormItem = (
        label: React.JSX.Element | string,
        metadata: FormMetadataProps,
        children: React.JSX.Element | null
    ) => {
        return (
            <Form.Item label={label} key={metadata.key} style={{ maxWidth: 500 }}>
                {children}
            </Form.Item>
        );
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
                        key={`employee_${employee.id}_form`}
                        className={"employee-form-style"}
                        colon={false}
                        labelAlign={"left"}
                        labelCol={{ flex: '220px' }}
                        // labelWrap
                        // wrapperCol={{ flex: 5 }}
                    >
                        {employeeMetadata.map(metadata => {
                            const label = (<div className={"employee-form-item-label-style"}>{metadata.label}</div>);

                            switch (metadata.property) {
                                case "QR": return getFormItem(
                                    label,
                                    metadata,
                                    <QRCode value={`${parsableEmployee["fullName"]} ${parsableEmployee["id"]}`} />
                                );
                                case "chart": return null;
                                // return (
                                //     <Form.Item label={""} key={metadata.key} style={{ maxWidth: 500 }}>
                                //         <ChartComponent/>
                                //     </Form.Item>
                                // );
                                case "timeCheck": return (
                                    <Form.Item label={label} key={metadata.key} style={{ maxWidth: 500 }}>
                                        <EmployeeWorkSpanComponent/>
                                    </Form.Item>
                                );
                                case "daysCheck": return (
                                    <Form.Item label={label} key={metadata.key} style={{ maxWidth: 500 }}>
                                        <EmployeeWorkedDaysComponent/>
                                    </Form.Item>
                                );
                                case "entranceTimeCheck": return (
                                    <Form.Item label={label} key={metadata.key} style={{ maxWidth: 500 }}>
                                        <EmployeeEntranceTimeComponent/>
                                    </Form.Item>
                                );
                                default: {
                                    const val = parsableEmployee[metadata.property];
                                    return getFormItem(
                                        label,
                                        metadata,
                                        <Input readOnly defaultValue={val}/>
                                    );
                                }
                            }
                        })}
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