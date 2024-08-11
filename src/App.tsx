import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Register/RegisterForm';
import ManagementForm from './components/Management/ManagementForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/management" element={<ManagementForm />} />
      </Routes>
    </Router>
  );
}

export default App;
