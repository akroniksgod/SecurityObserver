import { DatePicker, Input } from "antd";
import locale from 'antd/es/date-picker/locale/ru_RU';
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import { BaseStoreInjector } from "../../../types/EmployeesTypes";
import { inject, observer } from "mobx-react";
import { useState } from "react";
import { openNotification } from "../../NotificationComponent";
const { RangePicker } = DatePicker;

/**
 * Свойства компонента, отображающего число отработанных часов в задаваемый период.
 */
interface EmployeeWorkSpanComponentProps extends BaseStoreInjector {
}

/**
 * Компонент, отображающий число отработанных часов в задаваемый период.
 */
const EmployeeWorkSpanComponent: React.FC<EmployeeWorkSpanComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Часы за выбранный период.
     */
    const [hours, setHours] = useState(-1);

    /**
     * Срабатывает при изменении периода работы.
     * @param values Значения периодов.
     */
    const onDateRangeChange = (values: any) => {
        const f = values[0], s = values[1];
        const formattedF = dayjs(f).format("DD-MM-YYYY"),
            formattedS = dayjs(s).format("DD-MM-YYYY");
        const response = props.employeeStore?.getEmployeeWorkSpan(formattedF, formattedS);

        response?.then(
            (res) => {
                const msg = "Число отработанных часов за выбранный период: ";
                if (isNaN(parseFloat(res)) || parseFloat(res) === 0) {
                    openNotification("Результат", "Нет данных за выбранный период", "warning");
                    return;
                }

                setHours(parseFloat(res));
                openNotification("Успех", msg + res, "success");
            },
            (error) => openNotification("Ошибка", error, "error"),
        );
    };

    return (
        <>
            <RangePicker locale={locale} onChange={onDateRangeChange} format={"DD.MM.YYYY"} style={{marginBottom: 10}}/>
            <Input readOnly placeholder={"Отработанные часы за период"} value={hours !== -1 ? hours : undefined}/>
        </>
    );
}));

export default EmployeeWorkSpanComponent;