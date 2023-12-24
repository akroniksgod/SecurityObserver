import BaseButton from "./BaseButtonComponent";
import React from "react";
import {DatePicker, Form, Input} from "antd";
import {BaseStoreInjector} from "../../../types/EmployeesTypes";
import {inject, observer} from "mobx-react";
import {cerr, getValidator} from "../../../Utils";
import {openNotification} from "../../NotificationComponent";
import dayjs from "dayjs";
import EmployeeStore from "../../../stores/EmployeeStore";

/**
 * Перечисления типов в метаданных для компонента CreateBrochureButtonComponent.
 */
export enum MetadataTypes {
    STR_FIELD,
    NMBR_FIELD,
    TBL_FIELD,
    DATE_FIELD,
    LIST_FIELD,
}

/**
 * Свойства метаданных для компонента CreateBrochureButtonComponent.
 * @param id Идентификатор поля.
 * @param name Наименование поля.
 * @param type Тип поля.
 * @param isRequired Обязательное поле или нет.
 * @param min Минимальное значение.
 * @param max Максимальное значение.
 * @param defaultValue Значение по умолчанию.
 * @param helpText Текст подсказки.
 * @param pattern Регулярное выражение.
 */
export interface MetadataProps {
    id: string;
    name: string;
    type: MetadataTypes;
    isRequired: boolean;
    min?: number;
    max?: number;
    defaultValue?: string;
    helpText?: string;
    pattern?: string;
}

/**
 * Режимы кнопок компонента.
 * @param CREATE Создание каталога.
 * @param EDIT Редактирование каталога.
 * @param CREATE_GOODS Создание товара.
 */
export enum ButtonModes {
    CREATE,
    EDIT,
}

/**
 * Словарь с режимами.
 * @param CREATE Создание каталога.
 * @param EDIT Редактирование каталога.
 * @param CREATE_GOODS Создание товара.
 */
const modes = new Map([
    [ButtonModes.CREATE, "Создать"],
    [ButtonModes.EDIT, "Изменить"],
]);

/**
 * Свойства компонента CreateBrochureButtonComponent.
 * @param mode Режим работы кнопок компонента.
 * @param goodsStore Хранилище каталогов.
 */
interface CreateEmployeeButtonComponentProps extends BaseStoreInjector {
    mode: ButtonModes,
    employeeStore?: EmployeeStore,
}

/**
 * Компонент кнопки Создать/Изменить, открывающий свою модалку.
 */
const CreateEmployeeButtonComponent: React.FC<CreateEmployeeButtonComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Метаданные модалки редактирования каталога.
     */
    const editFormMetadata: Readonly<MetadataProps[]> = [
        { id: "employee_surname", name: "Фамилия", type: MetadataTypes.STR_FIELD, isRequired: true, min: 1, max: 30, helpText: "Значение по длине не более 30 символлов"},
        { id: "employee_name", name: "Имя", type: MetadataTypes.STR_FIELD, isRequired: true, min: 1, max: 30, helpText: "Значение по длине не более 30 символлов"},
        { id: "employee_patronymic", name: "Отчество", type: MetadataTypes.STR_FIELD, isRequired: true, min: 1, max: 30, helpText: "Значение по длине не более 30 символлов"},
        { id: "employee_birthDate", name: "Дата рождения", type: MetadataTypes.DATE_FIELD, isRequired: true, defaultValue: new Date().toLocaleString()},
        { id: "employee_address", name: "Адрес", type: MetadataTypes.STR_FIELD, isRequired: true, min: 1, max: 50, helpText: "Значение по длине не более 50 символлов"},
        { id: "employee_position", name: "Должность", type: MetadataTypes.STR_FIELD, isRequired: true, min: 1, max: 30, helpText: "Значение по длине не более 30 символлов"},
        { id: "employee_phoneNumber", name: "Телефон", type: MetadataTypes.STR_FIELD, isRequired: true, min: 11, max: 15, helpText: "Значение по длине не более 12 символлов", pattern: "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{5}$"},
    ];

    /**
     * Метаданные для формы создания товаров.
     */
    const createGoodsFormMetaData: Readonly<MetadataProps[]> = [
        // { id: "employee_positions", name: "Перечень товаров", type: MetadataTypes.TBL_FIELD, isRequired: false},
    ];

    /**
     * Метаданные создания каталога.
     */
    const createFormMetadata: Readonly<MetadataProps[]> = [
        ...editFormMetadata,
        ...createGoodsFormMetaData,
    ];

    /**
     * Текущий режим.
     */
    const currentMode = modes.get(props.mode) ?? "";

    /**
     * Указатель на форму.
     */
    const [form] = Form.useForm();

    /**
     * Выбранный сотрудник.
     */
    const currentEmployee = props.employeeStore?.currentEmployee ?? null;

    /**
     * Возвращает компонет элемента формы.
     * @param formItem Элемент формы.
     */
    const getFormItemComponent = (formItem: MetadataProps) => {
        switch (formItem.type) {
            case MetadataTypes.NMBR_FIELD: return (<Input type={"number"}/>);
            case MetadataTypes.STR_FIELD: return (<Input/>);
            case MetadataTypes.DATE_FIELD: return (<DatePicker format={"DD.MM.YYYY"}/>);
            // case MetadataTypes.TBL_FIELD: return (<GoodsTableComponent/>);
            default: return null;
        }
    };

    /**
     * Возвращает метаданные для формы.
     */
    const getFormMetaData = (): readonly MetadataProps[] => {
        switch (props.mode) {
            case ButtonModes.CREATE: return createFormMetadata;
            case ButtonModes.EDIT: return editFormMetadata;
            default: return [];
        }
    };

    /**
     * Возвращает идентификатор формы.
     */
    const getFormId = (): string => {
        let operation;
        switch (props.mode) {
            case ButtonModes.CREATE: operation = "create"; break;
            case ButtonModes.EDIT: operation = "edit"; break;
            default: operation = "";
        }
        return `${operation}_form`;
    };

    /**
     * Возвращает компонент формы.
     */
    const getForm = (): React.JSX.Element => {
        const metadata = getFormMetaData();
        const formId = getFormId();
        return (
            <Form id={formId} form={form} name={formId} layout={"vertical"} colon={false}>
                {metadata.map(formItem => {
                    const formItemName: Readonly<string> = formItem.id.slice(formItem.id.indexOf('_') + 1);
                    const defaultValue = formItemName === "birthDate" ? dayjs(formItem.defaultValue) : formItem.defaultValue;
                    return (
                        <Form.Item
                            key={formItem.id}
                            label={formItem.name}
                            name={formItemName}
                            initialValue={defaultValue}
                            help={formItem.helpText}
                            rules={[{
                                required: formItem.isRequired,
                                validator: (_, value) => getValidator(_, value, formItem),
                            }]}
                        >
                            {getFormItemComponent(formItem)}
                        </Form.Item>
                    );
                })}
            </Form>
        );
    };

    /**
     * Обработчик создания/редактирования каталога.
     * @param values Значения полей.
     */
    const handleDbAction = (values: any) => {
        values.birthDate = dayjs(values?.birthDate).format('DD.MM.YYYY');

        let response;
        switch (props.mode) {
            case ButtonModes.CREATE: {
                response = props.employeeStore?.handleCreateEmployee(values);
            } break;
            case ButtonModes.EDIT: {
                response = props.employeeStore?.handleEditEmployee(values);
            } break;
        }

        response?.then(
            (resolve: string) => {openNotification("Успех", resolve, "success")},
            (error: string) => {openNotification("Ошибка", error, "error")}
        ).finally(() => form.resetFields());
    };

    /**
     * Обрабатывает нажатие кнопки сохранить.
     */
    const onOkClick = (): Promise<void> => {
        return form.validateFields()
            .then(
                (values) => {
                    handleDbAction(values);
                    return Promise.resolve();
                },
                (error) => {
                    cerr(`Validate Failed: ${error}`);
                    return Promise.reject();
                }
            );
    };

    /**
     * Обрабатывает нажатие кнопки отменить.
     */
    const onCancelClick = (): Promise<void> => {
        form.resetFields();
        return Promise.resolve();
    };

    /**
     * Возвращает заголовок модального окна.
     */
    const getModalTitle = (): string => {
        switch (props.mode) {
            case ButtonModes.CREATE: return "Добавить сотрудника";
            case ButtonModes.EDIT: return "Редактировать сотрудника";
            default: return "";
        }
    };

    /**
     * Свойства модального окна.
     */
    const modalProps = {
        title: getModalTitle(),
        form: form,
        okText: "Сохранить",
        cancelText: "Отменить",
        onOkClick: onOkClick,
        onCancelClick: onCancelClick,
        children: getForm(),
    };

    /**
     * Заполняет поля каталога.
     */
    const fillBrochureFields = () => {
        if (currentEmployee === null) return;
        const splt = currentEmployee.fullName.split(' ');
        form.setFieldsValue({
            id: currentEmployee.id,
            surname: splt[0],
            name: splt[1],
            patronymic: splt[2],
            birthDate: dayjs(currentEmployee.birthDate, "DD.MM.YYYY", "ru"),
            address: currentEmployee.address,
            position: currentEmployee.position,
            phoneNumber: currentEmployee.phoneNumber,
        });
    };

    /**
     * Заполняет поля данными текалога.
     */
    const fillFieldsOnEdit = (): void => {
        switch (props.mode) {
            case ButtonModes.EDIT: fillBrochureFields(); return;
            default: return;
        }
    };

    /**
     * Срабатывает при нажатии кнопки.
     * Используется в качестве callback функции в родительском компоненте.
     */
    const onClick = () => {
        // props.mode === ButtonModes.CREATE && props.employeeStore?.updateGoodsList();
        (props.mode === ButtonModes.EDIT) && fillFieldsOnEdit();
    };

    /**
     * Возвращает настройки хинта.
     */
    const getTooltipProps = () => {
        let title = "";
        switch (props.mode) {
            case ButtonModes.CREATE:
            case ButtonModes.EDIT: title = "Необходимо выбрать каталог"; break;
            default: break;
        }
        return {title: title};
    };

    /**
     * Свойства кнопки для родительского компонента.
     */
    const buttonProps = {
        buttonText: currentMode,
        onClick: onClick,
        isDisabled: currentEmployee === null && props.mode === ButtonModes.EDIT,
        tooltip: getTooltipProps(),
    };

    return (
        <BaseButton
            buttonProps={buttonProps}
            modalProps={modalProps}
        />
    );
}));

export default CreateEmployeeButtonComponent;