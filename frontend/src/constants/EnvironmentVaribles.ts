/**
 * Адрес backend.
 */
export const BACKEND_ROUTE = process.env.REACT_APP_BACKEND_ROUTE ?? "";

/**
 * Основной путь обращения к контроллеру.
 */
export const BACKEND_CONTROLLER_ROUTE = `${BACKEND_ROUTE}/api/employees`;

/**
 * Следует ли использовать данные из БД.
 */
export const SHOULD_USE_ONLY_DB_DATA = process.env.REACT_APP_SHOULD_USE_ONLY_DB_DATA ?? "false";

/**
 * Следует ли выводить логи в консоль.
 */
export const IS_DEBUG = process.env.REACT_APP_DEBUG ?? "true";