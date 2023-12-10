import React from "react";
import Search from "antd/es/input/Search";

/**
 * Компонент для поиска сотрудников (фильтрации таблицы сотрудников).
 */
const SearchEmployeesComponent: React.FC = () => {
    return (
        <Search className={"search-empl-style"}/>
    );
};

export default SearchEmployeesComponent;