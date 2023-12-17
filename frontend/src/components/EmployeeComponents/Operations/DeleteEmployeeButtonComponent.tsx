import {Typography} from "antd";
import React from "react";
import {inject, observer} from "mobx-react";
import {openNotification} from "../../NotificationComponent";
import {BaseStoreInjector} from "../../../types/EmployeesTypes";
import BaseButtonComponent from "./BaseButtonComponent";

/**
 * Свойства компонента DeleteEmployeeButtonComponent.
 */
interface DeleteEmployeeButtonComponentProps extends BaseStoreInjector {
}

/**
 * Компонент кнопки Удалить, открывающий свою модалку.
 */
const DeleteEmployeeButtonComponent: React.FC<DeleteEmployeeButtonComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Выбранный каталог.
     */
    const currentEmployee = props.employeeStore?.currentEmployee ?? null;

    /**
     * Срабатывает при нажатии кнопки удалить.
     */
    const onOkClick = (): Promise<void> => {
        const id = currentEmployee?.id ?? -1;
        // const response = props.employeeStore?.handleDeleteEmployee(id);
        //
        // response?.then(
        //     (resolve: string) => {openNotification("Успех", resolve, "success")},
        //     (error: string) => {openNotification("Ошибка", error, "error")}
        // );
        return Promise.resolve();
    };

    /**
     * Возвращает настройки хинта.
     */
    const getTooltipProps = () => {
        const title = "Необходимо выбрать сотрудника";
        return {title: title};
    };

    /**
     * Свойства модалки.
     */
    const modalProps = {
        title: "Удалить каталог",
        okText: "Удалить",
        cancelText: "Отменить",
        children: (<Typography.Text>{`Вы действительно хотите уволить сотрудника ${currentEmployee?.fullName}?`}</Typography.Text>),
        onOkClick: onOkClick,
    };

    /**
     * Свойства для кнопки, открывающей модальное окно.
     */
    const buttonProps = {
        buttonText: "Удалить",
        isDisabled: currentEmployee === null,
        tooltip: getTooltipProps(),
    };

    return (
        <BaseButtonComponent
            buttonProps={buttonProps}
            modalProps={modalProps}
        />
    );
}));

export default DeleteEmployeeButtonComponent;