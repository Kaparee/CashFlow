import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx'
import '@fontsource/jost'
import '@fontsource/jost/600'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/login"
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <LoginPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <RegisterPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;