import {Empty, Menu, MenuProps, Spin } from "antd";
import EmployeeStore from "../stores/EmployeeStore";
import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import "../styles/EmployeeMenuComponent.css";

/**
 * Свойства компонента меню сотрудников.
 */
interface EmployeeMenuComponentProps {
    employeeStore?: EmployeeStore;
}

/**
 * Компонент с меню сотрудников.
 */
const EmployeeMenuComponent: React.FC<EmployeeMenuComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Хук для хранения коллекции элементов меню.
     */
    const [employeeItems, setEmployeeItems] = useState<MenuProps['items']>([]);

    /**
     * Загружает каталог из настроек браузера.
     */
    const loadSelectedBrochure = (): void => {
        const preEmployee = props.employeeStore?.getSavedEmployee() ?? null;
        const id = preEmployee !== null ? preEmployee.id : -1;
        if (id === -1) return;

        onSelectEmployee({key: `employees_${id}`});
    };

    /**
     * Хук, вызывающий запрос на загрузку каталогов при монтировании компонента в DOM.
     * Загружает каталоги из БД.
     */
    useEffect(() => {
        props.employeeStore?.loadEmployees();
        loadSelectedBrochure();
    }, []);

    /**
     * Хук, необходимый для преобразования каталогов и элементы, подходящие под компонент Menu.
     */
    useEffect(() => {
        const employees = props.employeeStore?.employees ?? [];
        setEmployeeItems(
            employees.map(employee => {
                return ({
                    label: employee.fullName ?? `Сотрудник ${employee.id}`,
                    key: `employee_${employee.id}`,
                });
            })
        );
    }, [props.employeeStore?.employees]);

    /**
     * Возвращает идентификатор сотрудника.
     * @param event Событие, в котором зашит идентификатор сотрудника.
     */
    const getEmployeeId = (event: {key: string}) => {
        props.employeeStore?.reset();

        const employeeKey: string = event.key ?? "";
        const id = employeeKey.slice(employeeKey.indexOf('_') + 1);
        return id;
    };

    /**
     * Изменяет выбранный каталог.
     * @param event Событие, содержащее данные по каталогу.
     */
    const onSelectEmployee = (event: {key: string}): void => {
        const id = getEmployeeId(event);
        window.history.pushState({id: id}, "", `/employees/${id}`);
        props.employeeStore?.onEmployeeClick(id !== "undefined" ? parseInt(id) : -1);
    };

    /**
     * Выбранные элементы меню.
     */
    const [currentlySelectedMenuItems, setCurrentlySelectedMenuItems] = useState<string[]>([]);

    /**
     * Хук, обновляющий выбранный элемент в меню.
     */
    useEffect(() => {
        setCurrentlySelectedMenuItems(props.employeeStore?.getSavedEmployeeMenu() ?? []);
    }, [props.employeeStore?.currentEmployee]);

    /**
     * Выбирает сотрудника при нажатии на стрелочку назад.
     * @param event
     */
    const selectEmployeeOnPopstate = (event: {key: string}): void => {
        const id = getEmployeeId(event);
        props.employeeStore?.onEmployeeClick(id !== "undefined" ? parseInt(id) : -1);
    };

    /**
     * Обрабатывает собитие нажатия на стрелочку назад в браузере.
     * @param e Событие pushState.
     */
    window.onpopstate = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!!e.state.id) {
            selectEmployeeOnPopstate({key: `employee_${e.state.id}`});
        } else {
            props.employeeStore?.reset();
        }
    };

    const searchValue = props.employeeStore?.searchEmployeeValue ?? "";

    const getFilteredEmployees = () => {
        console.log(employeeItems)
        console.log((employeeItems as {key: string, label: string}[])
            .filter((employeeItem) => employeeItem.label.toLowerCase().includes(searchValue)))
        // return employeeItems;
        return searchValue === "" ? employeeItems
            : (employeeItems as {key: string, label: string}[])
                .filter((employeeItem) => employeeItem.label.toLowerCase().includes(searchValue));
    };

    return (
        <Spin className={"white-background-style"} spinning={props.employeeStore?.isEmployeeMenuLoading}>
            {employeeItems && employeeItems.length > 0 ?
                <Menu
                    className={"employee-menu-style"}
                    mode={"inline"}
                    selectedKeys={currentlySelectedMenuItems}
                    items={getFilteredEmployees()}
                    onClick={onSelectEmployee}
                />
                : <Empty
                    className={"empty-menu-style"}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={"Нет сотрудников"}
                />}
        </Spin>
    );
}));

export default EmployeeMenuComponent;