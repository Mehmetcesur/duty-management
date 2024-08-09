import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { globalStore } from './store/configureStore';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={globalStore}>
    <App />
  </Provider>
);