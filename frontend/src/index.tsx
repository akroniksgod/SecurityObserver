import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import {ConfigProvider} from "antd";
import ru_RU from "antd/lib/locale/ru_RU";
import {Provider} from "mobx-react";
import EmployeeStore from './stores/EmployeeStore';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

/**
 * Набор классов хранилищ.
 */
const stores = {
    employeeStore: new EmployeeStore(),
};

root.render(
    <React.StrictMode>
        <Provider {...stores}>
            <ConfigProvider
                locale={ru_RU}
                theme={{ token: { colorPrimary: '#00b96b' } }}
            >
                <App/>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>
);