import React from "react";
import Search from "antd/es/input/Search";
import EmployeeStore from "../stores/EmployeeStore";
import { inject, observer } from "mobx-react";

/**
 * Свойтсва компонента с поиском сотдруников.
 */
interface SearchEmployeesComponentProps {
    employeeStore?: EmployeeStore,
}

/**
 * Компонент для поиска сотрудников (фильтрации таблицы сотрудников).
 */
const SearchEmployeesComponent: React.FC<SearchEmployeesComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Срабатывает при нажатии на кнопку с лупой/enter.
     * @param searchValue Искомое значение.
     */
    const onSearch = (searchValue: string) => {
        const normalised = searchValue.trim().toLowerCase();
        props.employeeStore?.updateSearchValue(normalised);
    };

    return (
        <Search className={"search-empl-style"} onSearch={onSearch} allowClear/>
    );
}));

export default SearchEmployeesComponent;