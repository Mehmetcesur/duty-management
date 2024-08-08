import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { globalStore } from './store/configureStore.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={globalStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
