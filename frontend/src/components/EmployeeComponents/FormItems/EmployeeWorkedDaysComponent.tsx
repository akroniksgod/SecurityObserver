import { DatePicker, Input } from "antd";
import locale from 'antd/es/date-picker/locale/ru_RU';
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import { BaseStoreInjector } from "../../../types/EmployeesTypes";
import { inject, observer } from "mobx-react";
import { useState } from "react";
import { openNotification } from "../../NotificationComponent";

/**
 * Свойства компонента, отображающего число отработанных дней в задаваемый период.
 */
interface EmployeeWorkedDaysComponentProps extends BaseStoreInjector {
}

/**
 * Компонент, отображающий число отработанных дней в задаваемый период.
 */
const EmployeeWorkedDaysComponent: React.FC<EmployeeWorkedDaysComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Дни за выбранный период.
     */
    const [days, setDays] = useState(-1);

    /**
     * Срабатывает при изменении периода работы.
     * @param values Значения периодов.
     */
    const onDateRangeChange = (date: any) => {
        const formattedDate = dayjs(date).format("MM-YYYY");
        const response = props.employeeStore?.getEmployeeWorkedDays(formattedDate);

        response?.then(
            (res) => {
                const msg = "Число отработанных дней в выбранном месяце: ";
                if (isNaN(parseFloat(res)) || parseFloat(res) === 0) {
                    openNotification("Результат", "Нет данных за выбранный период", "warning");
                    return;
                }

                setDays(parseFloat(res));
                openNotification("Успех", msg + res, "success");
            },
            (error) => openNotification("Ошибка", error, "error"),
        );
    };

    return (
        <>
            <DatePicker
                picker={"month"}
                locale={locale}
                format={"MM.YYYY"}
                style={{ width: 280, marginBottom: 10 }}
                onChange={onDateRangeChange}
            />
            <Input
                readOnly
                placeholder={"Количество дней в выбранный месяц"}
                defaultValue={days !== -1 ? days : undefined}
            />
        </>
    );
}));

export default EmployeeWorkedDaysComponent;