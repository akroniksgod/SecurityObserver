import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import {ConfigProvider} from "antd";
import ru_RU from "antd/lib/locale/ru_RU";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ConfigProvider locale={ru_RU} theme={{ token: { colorPrimary: '#00b96b' } }}>
            <App />
        </ConfigProvider>
    </React.StrictMode>
);