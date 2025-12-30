import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx'
import AccountSelection from './pages/DashboardPage/pages/AccountSelection/AccountSelection.tsx'
import DashboardHomePage from './pages/DashboardPage/pages/DashboardHomePage/DashboardHomePage.tsx'
import Accounts from './pages/DashboardPage/pages/Acccounts/Accounts.tsx'
import Charts from './pages/DashboardPage/pages/Charts/Charts.tsx'
import Notifications from './pages/DashboardPage/pages/Notifications/Notifications.tsx';
import Settings from './pages/DashboardPage/pages/Settings/Settings.tsx';
import AccountCreator from './pages/DashboardPage/pages/AccountCreator/AccountCreator.tsx'
import ToastProvider from './contexts/ToastContext.tsx';
import ToastContainer from './components/Layout/ToastContainer/ToastContainer.tsx';
import AuthProvider from './contexts/AuthContext.tsx';
import Categories from './pages/DashboardPage/pages/Categories/Categories.tsx';
import CategoriesCreator from './pages/DashboardPage/pages/CategoriesCreator/CategoriesCreator.tsx';
import '@fontsource/jost'
import '@fontsource/jost/600'

const App: React.FC = () => {
    return (
        <ToastProvider>
            <ToastContainer />
            <BrowserRouter>
                <AuthProvider>
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
                        >
                            <Route index element={<AccountSelection />} />
                            <Route path='/dashboard/dashboard-home-page' element={<DashboardHomePage />} />
                            <Route path='/dashboard/accounts' element={<Accounts />} />
                            <Route path='/dashboard/charts' element={<Charts />} />
                            <Route path='/dashboard/notifications' element={<Notifications />} />
                            <Route path='/dashboard/settings' element={<Settings />} />
                            <Route path='/dashboard/account-creator' element={<AccountCreator />} />
                            <Route path='/dashboard/categories' element={<Categories />} />
                            <Route path='/dashboard/categories/create-category' element={<CategoriesCreator />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ToastProvider>
    );
};

export default App;