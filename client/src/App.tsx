import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import AuthPage from './pages/AuthPage';
import DashboardHome from './pages/DashboardHome';
import MapView from './pages/MapView';
import AdminPanel from './pages/AdminPanel';
import TelemetryPage from './pages/TelemetryPage';
import LogsPage from './pages/LogsPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-neo-bg text-neo-text selection:bg-neo-primary selection:text-neo-bg">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHome />} />
                        <Route path="map" element={<MapView />} />
                        <Route path="telemetry" element={<TelemetryPage />} />
                        <Route path="logs" element={<LogsPage />} />
                        <Route path="admin" element={<AdminPanel />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
