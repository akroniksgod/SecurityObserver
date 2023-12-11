import { BACKEND_CONTROLLER_ROUTE } from "../constants/EnvironmentVaribles";
import BaseService from "./BaseService";
// import {BACKEND_CONTROLLER_ROUTE} from "../constants/Routes";
// import {CreateBrochureHandlerProps, EditBrochureHandlerProps} from "../types/BrochureTypes";

/**
 * Сервис для отправки запросов к backend.
 */
class EmployeeService extends BaseService {
    /**
     * Возвращает с backend все каталоги.
     */
    public static async getAllEmployees() {
        const methodRoute = "/getEmployees";
        return await BaseService.sendGetHttpRequest(BACKEND_CONTROLLER_ROUTE, methodRoute);
    }

    /**
     * Возвращает данные каталога по идентификатору каталога.
     * @param id Идентифкиатор каталога.
     */
    public static async getEmployeeById(id: number) {
        const methodRoute = `/getEmployee/id=${id}`;
        return await BaseService.sendGetHttpRequest(BACKEND_CONTROLLER_ROUTE, methodRoute);
    }

    /**
     * Отправляет запрос на создание каталога.
     * @param params Параметры каталога.
     */
    public static async createEmployee(params: object) {
        const methodRoute = `/createEmployee`;
        return await BaseService.sendPostHttpRequest(BACKEND_CONTROLLER_ROUTE, methodRoute, params);
    }

    /**
     * Отправляет запрос на изменение каталога.
     * @param id Идентификатор каталога.
     * @param params Параметры каталога.
     */
    public static async updateEmployee(id: number, params: object) {
        const methodRoute = `/updateEmployee/id=${id}`;
        return await BaseService.sendPostHttpRequest(BACKEND_CONTROLLER_ROUTE, methodRoute, params);
    }

    /**
     * Отправляет запрос на удаление каталога.
     * @param id Идентификатор каталога.
     */
    public static async deleteEmployeeById(id: number) {
        const methodRoute = `/deleteEmployee/id=${id}`;
        return await BaseService.sendGetHttpRequest(BACKEND_CONTROLLER_ROUTE, methodRoute);
    }

    /**
     * Отправляет запрос на получение количества дней, отработанных сотрудником.
     * @param id Идентификатор сотрудника.
     * @param params Прочие параметры.
     */
    public static async getEmployeeWorkedDays(id: number, params: object) {
        const methodRoute = `/getEmployeeWorkedDays/id=${id}`;
        return await BaseService.sendPostHttpRequest(BACKEND_CONTROLLER_ROUTE, methodRoute, params);
    }

    /**
     * Отправляет запрос на получение время работы сотрудника за опредлённый промежуток времени.
     * @param id Идентификатор сотрудника.
     * @param params Прочие параметры.
     */
    public static async getEmployeeWorkSpan(id: number, params: object) {
        const methodRoute = `/getEmployeeWorkSpan/id=${id}`;
        return await BaseService.sendPostHttpRequest(BACKEND_CONTROLLER_ROUTE, methodRoute, params);
    }

    /**
     * Отправляет запрос на получениие время прихода на работу.
     * @param id Идентификатор сотрудника.
     * @param params Прочие параметры.
     */
    public static async getEmployeeEntranceTime(id: number, params: object) {
        const methodRoute = `/getEmployeeEntranceTime/id=${id}`;
        return await BaseService.sendPostHttpRequest(BACKEND_CONTROLLER_ROUTE, methodRoute, params);
    }
}

export default EmployeeService;