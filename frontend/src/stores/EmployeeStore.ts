import { observable, action, makeAutoObservable } from "mobx";
import {
    ChartPointsProps,
    CreateEmployeeHandlerProps,
    EditEmployeeHandlerProps,
    EmployeeDbProps,
    EmployeeProps
} from "../types/EmployeesTypes";
import {cerr, cout, random } from "../Utils";
import { SHOULD_USE_ONLY_DB_DATA } from "../constants/EnvironmentVaribles";
import EmployeeService from "../services/EmployeeService";
import dayjs from "dayjs";

/**
 * Путь к данным каталога в session storage.
 */
const EMPLOYEE_SS_PATH = "ss_employee";

/**
 * Хранилище сотрудников.
 */
class EmployeeStore {
    /**
     * Коллекция сотрудников.
     */
    @observable public employees: EmployeeProps[];

    /**
     * Выбранный сотрудник.
     */
    @observable public currentEmployee: EmployeeProps | null;

    /**
     * Значение в строке поиска.
     */
    @observable public searchEmployeeValue: string;

    /**
     * Точки для графика.
     */
    @observable public chartPoints: ChartPointsProps[];

    /**
     * Загружается ли меню сотрудников.
     */
    @observable public isEmployeeMenuLoading: boolean;

    /**
     * Загружается ли информация о сотруднике.
     */
    @observable public isEmployeeLoading: boolean;

    /**
     * Конструктор.
     */
    constructor() {
        this.currentEmployee = null;
        this.employees = [];
        this.chartPoints = [];
        this.searchEmployeeValue = "";
        this.isEmployeeMenuLoading = false;
        this.isEmployeeLoading = false;

        makeAutoObservable(this);
        this.initEmployees = this.initEmployees.bind(this);
        this.updateCurrentEmployeeInfo = this.updateCurrentEmployeeInfo.bind(this);
        this.updateSearchValue = this.updateSearchValue.bind(this);

        this.loadEmployees = this.loadEmployees.bind(this);
        this.getSavedEmployee = this.getSavedEmployee.bind(this);
        this.reset = this.reset.bind(this);
        this.getSavedEmployeeMenu = this.getSavedEmployeeMenu.bind(this);
        this.getProcessedEmployee = this.getProcessedEmployee.bind(this);
        this.onEmployeeClick = this.onEmployeeClick.bind(this);
        this.saveEmployeeToSessionStorage = this.saveEmployeeToSessionStorage.bind(this);
        this.updateEmployeeList = this.updateEmployeeList.bind(this);
        this.handleCreateEmployee = this.handleCreateEmployee.bind(this);
        this.updateEmployeeData = this.updateEmployeeData.bind(this);
        this.handleEditEmployee = this.handleEditEmployee.bind(this);
        this.handleDeleteEmployee = this.handleDeleteEmployee.bind(this);
        this.getEmployeeWorkSpan = this.getEmployeeWorkSpan.bind(this);
    }

    /**
     * Возвращает число отработанных часов за выбранный период.
     * @param datetimeStart Начало периода.
     * @param datetimeEnd Конец периода.
     */
    @action public async getEmployeeWorkSpan(datetimeStart: string, datetimeEnd: string) {
        const args = {"datetimeStart": datetimeStart, "datetimeEnd": datetimeEnd};
        const employee = this.currentEmployee;
        if (!employee) return Promise.reject("");

        return await EmployeeService.getEmployeeWorkSpan(employee.id, args).then(
            (response) => {
                return Promise.resolve(response.data.toString());
            },
            (error) => {
                cerr(`${error}`);
                return Promise.reject("Ошибка в расчёте часов за выбранный период");
            }
        );
    }

    /**
     * Обработчик удаления сотрудника.
     * @param employeeId Идентификатор сотрудника.
     */
    @action public async handleDeleteEmployee(employeeId: number) {
        if (employeeId === -1) {
            return Promise.reject("Ошибка при удалении сотрудника");
        }

        return await EmployeeService.deleteEmployeeById(employeeId).then(
            async(response) => {
                await this.updateEmployeeList();

                this.currentEmployee = null;
                this.saveEmployeeToSessionStorage(null);

                const data = response.data;
                if (!isNaN(parseInt(data)) && parseInt(data) === -1) {
                    return Promise.reject("Ошибка при удалении сотрудника");
                }
                return Promise.resolve("Сотрудник удалён успешно");
            },
            (error) => {
                cerr(error);
                return Promise.reject("Ошибка при удалении сотрудника");
            }
        );
    }

    /**
     * Обрабатывает редактирования сотрудника.
     * @param employee Сотрудник.
     */
    @action public async handleEditEmployee(employee: EditEmployeeHandlerProps) {
        console.log(employee)
        const id = this.currentEmployee?.id ?? -1;
        const rejectReason = "Не удалось изменить сотрудника";
        if (id === -1) {
            return Promise.reject(rejectReason);
        }

        return await EmployeeService.updateEmployee(id, employee).then(
            async(response) => {
                const data = response.data;

                const isResponseString = typeof data === "string";
                const isResponseNumber = typeof data === "number";
                const numberParseAttempt = parseInt(data);

                if (!isResponseString && !isResponseNumber) {
                    return Promise.reject(rejectReason);
                }

                if (isResponseString && !isNaN(numberParseAttempt) && numberParseAttempt === -1) {
                    return Promise.reject(rejectReason);
                }

                if (isResponseNumber && data === -1) {
                    return Promise.reject(rejectReason);
                }
                await this.updateEmployeeData(id);

                this.isEmployeeLoading = false;
                this.isEmployeeMenuLoading = false;
                return Promise.resolve("Сотрудник успешно изменён");
            },
            (error) => {
                cerr(error);
                this.isEmployeeLoading = false;
                this.isEmployeeMenuLoading = false;
                return Promise.reject(rejectReason);
            },
        );
    }

    /**
     * Обновляет данные выбранного каталога.
     * @param id Идентификатор каталога.
     * @private
     */
    @action private async updateEmployeeData(id: number) {
        const responses =  await Promise.all([
            EmployeeService.getAllEmployees(),
            EmployeeService.getEmployeeById(id),
        ]);

        const employeesAxiosResponse = responses[0];
        const employeeAxiosResponse = responses[1];

        if (employeesAxiosResponse && employeesAxiosResponse.data instanceof Array) {
            this.employees = employeesAxiosResponse.data.map(employee => this.getProcessedEmployee(employee)!);
        }

        if (employeeAxiosResponse) {
            await this.onEmployeeClick(id);
            // this.currentEmployee = employeeAxiosResponse.data;
        }
    }

    /**
     * Обрабатывает добавление сотрудника.
     * @param employee Сотрудник.
     */
    public async handleCreateEmployee(employee: CreateEmployeeHandlerProps) {
        this.isEmployeeLoading = true;
        this.isEmployeeMenuLoading = true;
        const {data} = await EmployeeService.createEmployee(employee);

        const id = data;
        if (!(typeof id === "number") || id === -1) {
            this.isEmployeeLoading = false;
            this.isEmployeeMenuLoading = false;
            return Promise.reject("Ошибка при создании каталога");
        }

        await this.updateEmployeeData(id);

        this.isEmployeeLoading = false;
        this.isEmployeeMenuLoading = false;
        return Promise.resolve("Каталог успешно создан");
    }

    /**
     * Возвращает преобразованного сотрудника под компоненты.
     * @param initialEmployee Исходный сотрудник.
     */
    private getProcessedEmployee(initialEmployee: EmployeeDbProps | null) {
        if (initialEmployee === null) return null;
        return {
            key: `employee_${initialEmployee.id}`,
            id: initialEmployee.id,
            fullName: `${initialEmployee.surname} ${initialEmployee.name} ${initialEmployee.patronymic}`,
            address: initialEmployee.address,
            birthDate: dayjs(initialEmployee.birthDate).format("DD.MM.YYYY"),
            position: initialEmployee.position,
            phoneNumber: initialEmployee.phoneNumber,
        };
    }

    /**
     * Срабатывает после выбора сотрудника в меню.
     * @param employeeId Идентификатор сотрудника.
     */
    @action public async onEmployeeClick(employeeId: number) {
        window.history.pushState({id: employeeId}, "", `/employees/${employeeId}`);
        if (isNaN(employeeId) || employeeId === -1) return;

        // this.isEmployeeSelected = true;
        this.isEmployeeLoading = true;

        let foundEmployee = null;

        if (SHOULD_USE_ONLY_DB_DATA === "false") {
            foundEmployee = this.employees.find(employee => employee.id === employeeId) ?? null;
        } else {
            await EmployeeService.getEmployeeById(employeeId).then((response: {data: EmployeeDbProps}) => {
                cout(`${response.data}`);
                foundEmployee = response.data;
            });
        }

        this.currentEmployee = this.getProcessedEmployee(foundEmployee);
        this.saveEmployeeToSessionStorage(foundEmployee);

        setTimeout(() => {
            this.isEmployeeLoading = false;
        }, 250);
    }

    /**
     * Сохраняет сотрудника в session storage.
     * @param employee Сотрудник.
     */
    @action private saveEmployeeToSessionStorage(employee: EmployeeProps | null): void {
        sessionStorage.setItem(EMPLOYEE_SS_PATH, JSON.stringify(employee));
    }

    /**
     * Возвращает меню с открытыми каталогами из session storage.
     */
    @action public getSavedEmployeeMenu(): string[] {
        const employee = this.getSavedEmployee();
        return employee ? [`employee_${employee.id}`] : [];
    }

    /**
     * Очищает данные о каталоге.
     */
    @action public reset(): void {
        this.currentEmployee = null;
        sessionStorage.removeItem(EMPLOYEE_SS_PATH);
    }

    /**
     * Возвращает сохранённый каталог в сессии браузера.
     */
    @action public getSavedEmployee(): EmployeeProps | null {
        const json = sessionStorage.getItem(EMPLOYEE_SS_PATH);
        if (json === null || json === "undefined") return null;
        return JSON.parse(json);
    }

    /**
     * Загружает каталоги.
     */
    @action public loadEmployees() {
        this.isEmployeeMenuLoading = true;

        SHOULD_USE_ONLY_DB_DATA === "false" ? this.initEmployees() : this.updateEmployeeList();

        setTimeout(() => {
            this.isEmployeeMenuLoading = false;
        }, 300);
    }

    /**
     * Изменяет искомое значение в поиске сотрудников.
     * @param searchValue Искомое значение.
     */
    @action public updateSearchValue(searchValue: string) {
        this.searchEmployeeValue = searchValue;
    }

    /**
     * Обновляет данные текущего сотрудника по идентификатору сотрудника.
     * @param employeeId Идентификатор сотрудника.
     */
    @action public updateCurrentEmployeeInfo(employeeId: number) {
        const collectionEmployee = this.employees.find(employee => employee.id === employeeId);
        if (collectionEmployee) {
            this.currentEmployee = collectionEmployee;
        }
    }

    /**
     * Обновляет список сотрудников.
     * @private
     */
    @action private async updateEmployeeList() {
        await EmployeeService.getAllEmployees().then(
            (response) => {
                const data = response.data;
                cout(data);
                if (!(data instanceof Array)) return;

                this.employees = data.map(employee => this.getProcessedEmployee(employee)!);
            },
            (error) => cerr(error)
        );
    }

    /**
     * Генерирует сотрудников случайно.
     */
    private initEmployees() {
        const employeeCount = 50;
        const names = ["Abir", "Arham", "Sadi", "Labi", "Mahdi"];
        const surnames = ['Baggins', 'Lightfoot', 'Boulderhill'];
        const patronymics = ['Bilbo', 'Frodo', 'Theodulph'];
        const addresses = ["A street", "B street", "C street", "D street", "E street", "F street"];
        const birthDates = [
            "25.11.1946",
            "20.10.1926",
            "26.10.1970",
            "09.01.1934",
            "20.11.1950",
            "27.08.1949",
            "08.12.1919",
            "06.03.1966",
            "24.08.1969",
            "25.12.1974"
        ];
        const itPositions = [
            "Frontend разработчик",
            "Backend разработчик",
            "Full Stack разработчик",
            "DevOps инженер",
            "Системный администратор",
            "UI/UX дизайнер",
            "QA инженер",
            "Data Scientist",
            "Машинное обучение инженер",
            "Аналитик данных",
            "Продуктовый менеджер",
        ];
        const phoneNumbers = [
            "+19457842255",
            "+19566806394",
            "+12162304155",
            "+1726393243",
            "+14629438311",
            "+16859028095",
            "+16381854389",
            "+16011157730",
            "+14650600317",
            "+1242379795"
        ];

        for (let i = 0; i < employeeCount; ++i) {
            const id = random(1,100000);
            const surname = surnames[random(0, surnames.length - 1)];
            const name = names[random(0, names.length - 1)];
            const patronymic = patronymics[random(0, patronymics.length - 1)];
            const birthDate = birthDates[random(0, birthDates.length - 1)];
            const address = addresses[random(0, addresses.length - 1)];
            const position = itPositions[random(0, itPositions.length - 1)];
            const phoneNumber = phoneNumbers[random(0, phoneNumbers.length - 1)];

            this.employees.push({
                key: `employee_${id}`,
                id: id,
                fullName: `${surname} ${name} ${patronymic}`,
                birthDate: birthDate,
                address: address,
                position: position,
                phoneNumber: phoneNumber
            });
        }

        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ];
        const d = new Date();
        for (let i = 0; i < 11; ++i) {
            this.chartPoints.push({
                month: monthNames[i],
                attendance: random(0, 31)
            });
        }
    }
}

export default EmployeeStore;