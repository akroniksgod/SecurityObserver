import React from "react";
import Search from "antd/es/input/Search";
import { inject, observer } from "mobx-react";
import "../../styles/SearchEmployeesComponent.css";
import { BaseStoreInjector } from "../../types/EmployeesTypes";

/**
 * Свойтсва компонента с поиском сотдруников.
 */
interface SearchEmployeesComponentProps extends BaseStoreInjector {
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
        const normalised = searchValue.toLowerCase();
        props.employeeStore?.updateSearchValue(normalised);
    };

    return (
        <Search className={"search-empl-style"} onSearch={onSearch} allowClear/>
    );
}));

export default SearchEmployeesComponent;