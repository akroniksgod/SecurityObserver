import { observable, action, makeAutoObservable } from "mobx";
import {ChartPointsProps, EmployeeProps} from "../types/EmployeesTypes";
import { random } from "../Utils";

/**
 * Путь к данным каталога в session storage.
 */
const EMPLOYEE_SS_PATH: Readonly<string> = "ss_employee";

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
        this.onEmployeeClick = this.onEmployeeClick.bind(this);
        this.saveEmployeeToSessionStorage = this.saveEmployeeToSessionStorage.bind(this);
    }

    /**
     * Срабатывает после выбора сотрудника в меню.
     * @param employeeId Идентификатор сотрудника.
     */
    @action public async onEmployeeClick(employeeId: number) {
        if (isNaN(employeeId) || employeeId === -1) return;

        // this.isBrochureSelected = true;
        this.isEmployeeLoading = true;

        let foundEmployee = null;

        // if (SHOULD_USE_ONLY_DB_DATA === "false") {
        //     foundBrochure = this.brochures.find(brochure => brochure.id === brochureId) ?? null;
        // } else {
        //     await this.getBrochureById(brochureId).then((response: {data: any}) => {
        //         foundBrochure = response.data;
        //     });
        // }

        foundEmployee = this.employees.find(employee => employee.id === employeeId) ?? null;

        this.currentEmployee = foundEmployee;
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
        console.log("saveEmployeeToSessionStorage")
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

        // SHOULD_USE_ONLY_DB_DATA === "false" ? this.initBrochures() : this.updateBrochureList();
        this.initEmployees();

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
            "24.08.1989",
            "25.12.1914"
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