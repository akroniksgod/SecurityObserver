import EmployeeStore from "../stores/EmployeeStore";

/**
 * Основные свойства сотрудника.
 * @param id Идентификатор.
 * @param birthDate Дата рождения.
 * @param address Адрес.
 * @param position Должность.
 * @param phoneNumber Номер телефона.
 */
interface BaseEmployee {
   id: number;
   birthDate: string;
   address: string;
   position: string;
   phoneNumber: string;
}

/**
 * Свойства сотрудника, возвращаемые из БД.
 * @param surname Фамилия.
 * @param name Имя.
 * @param patronymic Отчество.
 */
export interface EmployeeDbProps extends BaseEmployee {
   surname: string;
   name: string;
   patronymic: string;
}

/**
 * Свойства сотрудника, используемые в компонентах.
 * @param key Ключ.
 * @param fullName ФИО.
 */
export interface EmployeeProps extends BaseEmployee {
   key: string;
   fullName: string;
}

/**
 * Тип для получения данных по ключу.
 */
export type ParseObjectProp = {
   [key: string]: any
};

/**
 * Свойства точек в графике.
 * @param month Месяц.
 * @param attendance Посещения.
 */
export interface ChartPointsProps {
   month: string;
   attendance: number;
}

/**
 * Базовые свойства компонентов.
 * @param employeeStore Хранилище сотрудников.
 */
export interface BaseStoreInjector {
   employeeStore?: EmployeeStore;
}

/**
 * Свойства отправляемого в БД сотрудника (редактирование).
 */
interface EditEmployeeHandlerProps extends EmployeeProps {
}

/**
 * Свойства отправляемого в БД сотрудника (создание).
 */
export interface CreateEmployeeHandlerProps extends EditEmployeeHandlerProps {
}