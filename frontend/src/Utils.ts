import dayjs from "dayjs";
import { ParseObjectProp } from "./types/EmployeesTypes";
import { IS_DEBUG } from "./constants/EnvironmentVaribles";
import {MetadataProps, MetadataTypes } from "./components/EmployeeComponents/Operations/CreateEmployeeButtonComponent";

/**
 * Возвращает случайное число в промежутке от min до max.
 * @param min Минимальное число.
 * @param max Максимальное число.
 */
export const random = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Проверяет, является ли строка датой по формату.
 * @param value Исходная строка (дата).
 * @param format Формат даты.
 */
const isDate = (value: string, format = "YYYY-MM-DD") => (dayjs(value, format, true).isValid());

/**
 * Сортирует столбец таблицы.
 * @param a Строка 1.
 * @param b Строка 2.
 * @param key Свойство, по которому нужно сортировать.
 */
export const sorter = (a: any, b: any, key: string) => {
    const f: ParseObjectProp = a, s: ParseObjectProp = b;
    const first = f[key], second = s[key];

    if (isDate(first)) return new Date(first).getTime() - new Date(second).getTime();
    if (typeof first === "string") return first.localeCompare(second);
    if (typeof first === "number") return first - second;

    return 0;
};

/**
 * Лог в стандартный поток.
 * @param message Текст лога.
 */
export const cerr = (message: any) => {
    IS_DEBUG && console.error(message);
};

/**
 * Лог в поток ошибок.
 * @param message Текст лога.
 */
export const cout = (message: any) => {
    IS_DEBUG && console.log(message);
};

/**
 * Возвращает результаты проверки полей.
 * @param _ Служебное поле.
 * @param value Значение поля.
 * @param itemMetadata Метаданные для поля.
 */
export const getValidator = (_: any, value: any, itemMetadata: MetadataProps) => {
    if (!value && itemMetadata.isRequired) return Promise.reject();

    if (itemMetadata?.pattern) {
        const reg = new RegExp(itemMetadata.pattern);
        const isFine = reg.test(value.toString());
        if (!isFine) {
            return Promise.reject();
        }
    }

    let isFine: boolean = true;
    switch (itemMetadata.type) {
        case MetadataTypes.NMBR_FIELD: {
            if (isNaN(parseFloat(value))) return Promise.reject();

            const num = parseFloat(value);
            if (itemMetadata.min) {
                isFine = num >= itemMetadata.min;
            }

            if (itemMetadata.max) {
                isFine = num <= itemMetadata.max;
            }
        } break;
        case MetadataTypes.STR_FIELD: {
            const str: string = value;
            const length = str.length;
            if (itemMetadata.min) {
                isFine = length >= itemMetadata.min;
            }

            if (itemMetadata.max) {
                isFine = length <= itemMetadata.max;
            }
        } break;
    }

    return isFine ? Promise.resolve() : Promise.reject();
};