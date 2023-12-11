import dayjs from "dayjs";
import { ParseObjectProp } from "./types/EmployeesTypes";
import { IS_DEBUG } from "./constants/EnvironmentVaribles";

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
export const cerr = (message: string) => {
    IS_DEBUG && console.error(message);
};

/**
 * Лог в поток ошибок.
 * @param message Текст лога.
 */
export const cout = (message: string) => {
    IS_DEBUG && console.log(message);
};