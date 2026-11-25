import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MaintenancesPage from './pages/Maintenances';
import ReclamationsPage from './pages/Reclamations';
import PublicMachineSearch from './pages/PublicMachineSearch';
import PrivateRoute from './utils/PrivateRoute';
import MachineDetailsPage from './pages/MachineDetailsPage';
import MaintenanceDetailsPage from './pages/MaintenanceDetailsPage'
import MaintenanceEditPage from './pages/MaintenanceEditPage'
import ReclamationDetailsPage from './pages/ReclamationDetailsPage';
import ReclamationEditPage from './pages/ReclamationEditPage';
import EditMachinePage from './pages/EditMachinePage';
const App = () => {
    return (
        <Routes>
            {/* Публичные страницы */}
            <Route path="/" element={<PublicMachineSearch />} />
            <Route path="/login" element={<Login />} />


            {/* Защищенные страницы */}
            <Route element={<PrivateRoute allowedRoles={['manager', 'client', 'service']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/machines/:id" element={<MachineDetailsPage />} />
                <Route path="/machines/edit/:id" element={<EditMachinePage />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['manager', 'service', ]} />}>
                <Route path="/maintenances" element={<MaintenancesPage />} />
                <Route path="/maintenances/:id" element={<MaintenanceDetailsPage />} />
                <Route path="/maintenances/edit/:id" element={<MaintenanceEditPage />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['manager', 'service']} />}>
                <Route path="/reclamations" element={<ReclamationsPage />} />
                <Route path="/reclamations/:id" element={<ReclamationDetailsPage />} />
                <Route path="/reclamations/edit/:id" element={<ReclamationEditPage />} />
            </Route>
        </Routes>
    );
};

export default App;