import { inject, observer } from "mobx-react";
import EmployeeStore from "../stores/EmployeeStore";
import Plot from 'react-plotly.js';

/**
 * Свойтсва компонента с графиком.
 */
interface ChartComponentProps {
    employeeStore?: EmployeeStore,
}

/**
 * Компонент, возвращающий график посещений сотрудника фирмы.
 */
const ChartComponent: React.FC<ChartComponentProps> = inject("employeeStore")(observer((props) => {
    /**
     * Точки графика.
     */
    const points = props.employeeStore?.chartPoints ?? [];

    /**
     * Координаты по Ox.
     */
    const xs = points.map(point => point.month);

    /**
     * Координаты по Oy.
     */
    const ys = points.map(point => point.attendance);

    /**
     * Конфигурация макета.
     */
    const layout = {
        autosize: true,
        title: "Посещения сотрудника",
        showlegend: true,
        xaxis: {
            title: {
                text: "Месяц",
                // font: {
                //     family: 'Courier New, monospace',
                //     size: 18,
                //     color: '#7f7f7f'
                // }
            },
        },
        yaxis: {
            title: {
                text: "Посещения",
                // font: {
                //     family: 'Courier New, monospace',
                //     size: 18,
                //     color: '#7f7f7f'
                // }
            }
        },
    };

    return (
        <Plot
            data={[
                {
                    x: xs,
                    y: ys,
                    xaxis: "month",
                    yaxis: "attendance",
                    name: "Посещения за месяц",
                    type: "scatter"
                },
            ]}
            style={{width: "calc(100vw - 700px)", height: "calc(100vh - 600px)", padding: "10px 10px 10px 10px"}}
            layout={layout}
            config={{responsive: true}}
        />
    );
}));

export default ChartComponent;