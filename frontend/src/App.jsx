import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import LoginPage from './pages/LoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import WorkerAssistant from './pages/WorkerAssistant';
import Layout from './components/Layout';
import RegisterPage from "./pages/RegisterPage";
import WorkerManagement from "./pages/WorkerManagement";
import LandingPage from "./pages/LandingPage";

const getStoredUser = () => {
  const raw = localStorage.getItem('ikip-user');
  return raw ? JSON.parse(raw) : null;
};

function App() {
  const [user, setUser] = useState(getStoredUser());

  const authRoutes = useMemo(() => {
    if (!user) {
  return (
    <Routes>

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<LoginPage onLogin={setUser} />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

    return (
      <Layout user={user} onLogout={() => {
        localStorage.removeItem('ikip-user');
        setUser(null);
      }}>
        <Routes>
          <Route path="/" element={user.role === 'owner' ? <OwnerDashboard /> : <WorkerAssistant />} />
          <Route
              path="/workers"
              element={
              user.role === "owner"
            ? <WorkerManagement />
              : <Navigate to="/" replace />} />
          <Route path="/assistant" element={user.role === 'owner' ? <WorkerAssistant /> : <WorkerAssistant />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    );
  }, [user]);

  return authRoutes;
}

export default App;
