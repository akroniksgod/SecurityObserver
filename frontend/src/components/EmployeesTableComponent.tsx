import React from "react";
import {useNavigate} from "react-router-dom";
import {Table, Typography} from "antd";
import {EmployeeProps, ParseObjectProp} from "../types/EmployeesTypes";
import type { ColumnsType } from 'antd/es/table';
import EmployeeStore from "../stores/EmployeeStore";
import { inject, observer } from "mobx-react";
import { sorter } from "../Utils";

/**
 * Свойства компонента со списком сотрудников.
 */
interface EmployeesTableComponentProps {
    employeeStore?: EmployeeStore,
}

/**
 * Компонент, отображающий список сотрудников с базовой информацией.
 */
const EmployeesTableComponent: React.FC<EmployeesTableComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Переключатель пути в адресной строке браузера.
     */
    const navigate = useNavigate();

    /**
     * Перенаправляет на компонент с сотрудником.
     * @param link Новый путь.
     */
    const handleClick = (link: string) => {
        navigate(link);
    };

    /**
     * Столбцы таблицы.
     */
    const columns: ColumnsType<EmployeeProps> = [
        {
            title: "ФИО",
            dataIndex: "fullName",
            key: "employees_table_fullName",
            sorter: (a: EmployeeProps, b: EmployeeProps) => sorter(a, b, "fullName"),
            render: (_: any, row: any) => {
                return (
                    <Typography.Link
                        onClick={() => handleClick(`/employees/${row.id}`)}
                    >
                        {row.fullName}
                    </Typography.Link>
                );
            }
        },
        {
            title: "Дата рождения",
            dataIndex: "birthDate",
            key: "employees_table_birthDate",
            width: 200,
            sorter: (a: EmployeeProps, b: EmployeeProps) => sorter(a, b, "birthDate")
        },
        {
            title: "Адрес",
            dataIndex: "address",
            key: "employees_table_address",
            width: 200,
            sorter: (a: EmployeeProps, b: EmployeeProps) => sorter(a, b, "address")
        },
        {
            title: "Должность",
            dataIndex: "position",
            key: "employees_table_position",
            width: 200,
            sorter: (a: EmployeeProps, b: EmployeeProps) => sorter(a, b, "position")
        },
        {
            title: "Телефон",
            dataIndex: "phoneNumber",
            key: "employees_table_phoneNumber",
            width: 150,
            sorter: (a: EmployeeProps, b: EmployeeProps) => sorter(a, b, "phoneNumber")
        },
    ];

    /**
     * Коллекция сотрудников фирмы.
     */
    const employees: EmployeeProps[] = props.employeeStore?.employees ?? [];

    /**
     * Искомое значение.
     */
    const searchValue = props.employeeStore?.searchEmployeeValue ?? "";

    /**
     * Возвращает отфильтрованный список сотрудников.
     */
    const getFilteredEmployees = () => {
        return searchValue === "" ? employees
            : employees.filter(row => {
                const currentRow: ParseObjectProp = row;
                return Object.keys(row).some(key => {
                    const val = currentRow[key];
                    return val.toString().toLowerCase().includes(searchValue);
                });
            });
    };

    return (
        <Table
            size={"large"}
            scroll={{y: "calc(100vh - 140px)", x: "max-content"}}
            bordered
            columns={columns}
            dataSource={getFilteredEmployees()}
            onRow={(row, rowIndex) => {
                return {
                    onClick: (event) => {
                        handleClick(`/employees/${row.id}`);
                    },
                };
            }}
            pagination={false}
        />
    );
}));

export default EmployeesTableComponent;