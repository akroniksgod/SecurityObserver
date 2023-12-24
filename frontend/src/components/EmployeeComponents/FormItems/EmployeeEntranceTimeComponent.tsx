import { DatePicker, Input } from "antd";
import locale from 'antd/es/date-picker/locale/ru_RU';
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import { BaseStoreInjector } from "../../../types/EmployeesTypes";
import { inject, observer } from "mobx-react";
import { useState } from "react";
import { openNotification } from "../../NotificationComponent";

/**
 * Свойства компонента, отображающего время входа в офис в задаваемую дату.
 */
interface EmployeeEntranceTimeComponentProps extends BaseStoreInjector {
}

/**
 * Компонент, отображающий время входа в офис в задаваемую дату.
 */
const EmployeeEntranceTimeComponent: React.FC<EmployeeEntranceTimeComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Дата входа.
     */
    const [entranceTime, setEntranceTime] = useState("");

    /**
     * Срабатывает при изменении периода работы.
     * @param values Значения периодов.
     */
    const onDateRangeChange = (date: any) => {
        const formattedDate = dayjs(date).format("DD-MM-YYYY");
        const response = props.employeeStore?.getEmployeeEntranceTime(formattedDate);

        response?.then(
            (res) => {
                const msg = "Время входа в здание на указанную дату: ";
                if (!dayjs(res).isValid()) {
                    openNotification("Предупреждение", res, "warning");
                    return;
                }

                const thisDate = dayjs(res).format("DD.MM.YYYY HH:mm");
                setEntranceTime(thisDate);
                openNotification("Успех", msg + thisDate, "success");
            },
            (error) => openNotification("Ошибка", error, "error"),
        );
    };

    return (
        <>
            <DatePicker
                picker={"date"}
                locale={locale}
                format={"DD.MM.YYYY"}
                style={{ width: 280, marginBottom: 10 }}
                onChange={onDateRangeChange}
            />
            <Input
                readOnly
                placeholder={"Количество дней в выбранный месяц"}
                defaultValue={entranceTime !== "" ? entranceTime : undefined}
            />
        </>
    );
}));

export default EmployeeEntranceTimeComponent;