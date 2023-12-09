import React from "react";
import {useNavigate} from "react-router-dom";
import {Table, Typography} from "antd";
import {EmployeeProps} from "../types/Employees";
import type { ColumnsType } from 'antd/es/table';

/**
 * Свойства компонента со списком сотрудников.
 */
interface EmployeesTableComponentProps {
}

/**
 * Компонент, отображающий список сотрудников с базовой информацией.
 */
export const EmployeesTableComponent: React.FC<EmployeesTableComponentProps> = (props) => {
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
            // sorter: (a: DistributionDbProps, b: DistributionDbProps) => sorter(a, b, "genderName")
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
            width: 315,
            // sorter: (a: DistributionDbProps, b: DistributionDbProps) => sorter(a, b, "townName")
        },
        {
            title: "Адрес",
            dataIndex: "address",
            key: "employees_table_address",
            width: 315,
            // sorter: (a: DistributionDbProps, b: DistributionDbProps) => sorter(a, b, "townName")
        },
        {
            title: "Должность",
            dataIndex: "position",
            key: "employees_table_position",
            width: 290,
            // sorter: (a: DistributionDbProps, b: DistributionDbProps) => sorter(a, b, "ageGroupName")
        },
        {
            title: "Телефон",
            dataIndex: "phoneNumber",
            key: "employees_table_phoneNumber",
            width: 150,
            // sorter: (a: DistributionDbProps, b: DistributionDbProps) => sorter(a, b, "brochureCount")
        },
    ];

    /**
     * Коллекция сотрудников фирмы.
     */
    const employees: EmployeeProps[] = [
        {
            key: "employee_1",
            id: 1,
            fullName: "alksdl dsakjdl saldk",
            birthDate: "01.01.1990",
            address: "Perm",
            position: "dev",
            phoneNumber: "+7 (123) 456-7890",
        },
        {
            key: "employee_2",
            id: 2,
            fullName: "Олег",
            birthDate: "01.01.1990",
            address: "Moscow",
            position: "dev",
            phoneNumber: "+7 (123) 456-7890",
        },
    ];

    return (
        <Table
            size={"large"}
            scroll={{y: "calc(100vh - 140px)", x: "max-content"}}
            bordered
            columns={columns}
            dataSource={employees}
            pagination={false}
        />
    );
};