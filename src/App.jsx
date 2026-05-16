import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sensors from './pages/Sensors';
import Recipes from './pages/Recipes';
import Analysis from './pages/Analysis';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sensors" element={<Sensors />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="analysis" element={<Analysis />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
