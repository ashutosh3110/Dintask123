import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import useAuthStore from '@/store/authStore';

const NotFoundRedirect = () => {
    const { isAuthenticated, role } = useAuthStore();

    if (!isAuthenticated) return <Navigate to="/employee/login" replace />;

    const defaultRoute = role === 'superadmin'
        ? '/superadmin'
        : role === 'admin'
            ? '/admin'
            : role === 'manager'
                ? '/manager'
                : role === 'sales'
                    ? '/sales'
                    : '/employee';

    return <Navigate to={defaultRoute} replace />;
};

// Layouts
import AdminLayout from '@/shared/layouts/AdminLayout';
import EmployeeLayout from '@/shared/layouts/EmployeeLayout';
import ManagerLayout from '@/shared/layouts/ManagerLayout';

// Auth Pages
// Auth Pages
import EmployeeLogin from '@/modules/user/pages/EmployeeLogin';
import ForgotPassword from '@/modules/user/pages/ForgotPassword';
import AdminLogin from '@/modules/admin/pages/AdminLogin';
import SuperAdminLogin from '@/modules/superadmin/pages/SuperAdminLogin';

// Admin Pages
import AdminDashboard from '@/modules/admin/pages/Dashboard';
import ManagerManagement from '@/modules/admin/pages/ManagerManagement';
import EmployeeManagement from '@/modules/admin/pages/EmployeeManagement';
import TaskManagement from '@/modules/admin/pages/TaskManagement';
import TaskCompletion from '@/modules/admin/pages/TaskCompletion';
import Reports from '@/modules/admin/pages/Reports';
import AdminCalendar from '@/modules/admin/pages/Calendar';
import Subscription from '@/modules/admin/pages/Subscription';
import Settings from '@/modules/admin/pages/Settings';

import ManagerLogin from '@/modules/manager/pages/ManagerLogin';

// Manager Pages
import ManagerDashboard from '@/modules/manager/pages/Dashboard';
import AssignTask from '@/modules/manager/pages/AssignTask';
import MyTasks from '@/modules/manager/pages/MyTasks';
import TaskDelegation from '@/modules/manager/pages/TaskDelegation';
import TeamManagement from '@/modules/manager/pages/TeamManagement';
import TeamProgress from '@/modules/manager/pages/TeamProgress';
import ManagerSchedule from '@/modules/manager/pages/Schedule';
import ManagerReports from '@/modules/manager/pages/Reports';
import ManagerSettings from '@/modules/manager/pages/Settings';

// Sales Pages
import SalesLogin from '@/modules/sales/pages/SalesLogin';
import SalesDashboard from '@/modules/sales/pages/Dashboard';
import Deals from '@/modules/sales/pages/Deals';
import Clients from '@/modules/sales/pages/Clients';
import Schedule from '@/modules/sales/pages/Schedule';
import SalesReports from '@/modules/sales/pages/Reports';
import SalesSettings from '@/modules/sales/pages/Settings';
import SalesTasks from '@/modules/sales/pages/SalesTasks';

// CRM Pages
import CRMHome from '@/modules/crm/pages/CRMHome';
import LeadsManagement from '@/modules/crm/pages/LeadsManagement';
import SalesPipeline from '@/modules/crm/pages/SalesPipeline';
import FollowUps from '@/modules/crm/pages/FollowUps';
import Contacts from '@/modules/crm/pages/Contacts';
import AdminCRM from '@/modules/crm/pages/AdminDashboard';
import EmployeeCRM from '@/modules/crm/pages/EmployeeDashboard';

// Employee Pages
import EmployeeDashboard from '@/modules/user/pages/TaskHome';
import TaskDetail from '@/modules/user/pages/TaskDetail';
import EmployeeCalendar from '@/modules/user/pages/Calendar';
import EmployeeNotes from '@/modules/user/pages/Notes';
import EmployeeProfile from '@/modules/user/pages/Profile';
import PersonalAccount from '@/modules/user/pages/PersonalAccount';
import Notifications from '@/modules/user/pages/Notifications';
import Security from '@/modules/user/pages/Security';
import Preferences from '@/modules/user/pages/Preferences';
import HelpLegal from '@/modules/user/pages/HelpLegal';
import AddTask from '@/modules/user/pages/AddTask';
import NotificationsList from '@/modules/user/pages/NotificationsList';
import HelpCenter from '@/modules/user/pages/HelpCenter';
import ChatSupport from '@/modules/user/pages/ChatSupport';
import ApiDocs from '@/modules/user/pages/ApiDocs';
import PrivacyPolicy from '@/modules/user/pages/PrivacyPolicy';
import TermsOfService from '@/modules/user/pages/TermsOfService';
import SystemStatus from '@/modules/user/pages/SystemStatus';

// Super Admin Pages
import SuperAdminDashboard from '@/modules/superadmin/pages/Dashboard';
import AdminAccounts from '@/modules/superadmin/pages/AdminAccounts';
import PlansManagement from '@/modules/superadmin/pages/PlansManagement';
import SuperAdminSettings from '@/modules/superadmin/pages/Settings';

// ... imports
import CRMLayout from '@/shared/layouts/CRMLayout';

const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes ... (keep as is) */}
            <Route path="/employee/login" element={<EmployeeLogin />} />
            <Route path="/employee/forgot-password" element={<ForgotPassword returnPath="/employee/login" />} />
            <Route path="/manager/login" element={<ManagerLogin />} />
            <Route path="/manager/forgot-password" element={<ForgotPassword returnPath="/manager/login" />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword returnPath="/admin/login" />} />
            <Route path="/superadmin/login" element={<SuperAdminLogin />} />
            <Route path="/superadmin/forgot-password" element={<ForgotPassword returnPath="/superadmin/login" />} />
            <Route path="/sales/login" element={<SalesLogin />} />
            <Route path="/sales/forgot-password" element={<ForgotPassword returnPath="/sales/login" />} />

            {/* --- ADMIN ROUTES --- */}
            {/* Main Admin Panel */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout role="admin" /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="managers" element={<ManagerManagement />} />
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="tasks" element={<TaskManagement />} />
                <Route path="tasks/:id" element={<TaskCompletion />} />
                <Route path="reports" element={<Reports />} />
                <Route path="calendar" element={<AdminCalendar />} />
                <Route path="subscription" element={<Subscription />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin CRM Panel */}
            <Route path="/admin/crm" element={<ProtectedRoute allowedRoles={['admin']}><CRMLayout role="admin" /></ProtectedRoute>}>
                <Route index element={<AdminCRM />} />
                <Route path="leads" element={<LeadsManagement />} />
                <Route path="pipeline" element={<SalesPipeline />} />
                <Route path="follow-ups" element={<FollowUps />} />
                <Route path="contacts" element={<Contacts />} />
            </Route>

            {/* --- EMPLOYEE ROUTES --- */}
            {/* Main Employee Panel */}
            <Route path="/employee" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeLayout /></ProtectedRoute>}>
                <Route index element={<EmployeeDashboard />} />
                <Route path="tasks/:id" element={<TaskDetail />} />
                <Route path="tasks/new" element={<AddTask />} />
                <Route path="calendar" element={<EmployeeCalendar />} />
                <Route path="notes" element={<EmployeeNotes />} />
                <Route path="notifications" element={<NotificationsList />} />
                <Route path="profile" element={<EmployeeProfile />} />
                <Route path="profile/account" element={<PersonalAccount />} />
                <Route path="profile/notifications" element={<Notifications />} />
                <Route path="profile/security" element={<Security />} />
                <Route path="profile/preferences" element={<Preferences />} />
                <Route path="profile/help" element={<HelpLegal />} />
                <Route path="profile/help/privacy" element={<PrivacyPolicy />} />
                <Route path="profile/help/terms" element={<TermsOfService />} />
                <Route path="profile/help/status" element={<SystemStatus />} />
                <Route path="profile/help/center" element={<HelpCenter />} />
                <Route path="profile/help/chat" element={<ChatSupport />} />
                <Route path="profile/help/api" element={<ApiDocs />} />
            </Route>

            {/* Employee CRM Panel */}
            <Route path="/employee/crm" element={<ProtectedRoute allowedRoles={['employee']}><CRMLayout role="employee" /></ProtectedRoute>}>
                <Route index element={<EmployeeCRM />} />
                <Route path="leads" element={<LeadsManagement />} />
                <Route path="pipeline" element={<SalesPipeline />} />
                <Route path="follow-ups" element={<FollowUps />} />
                <Route path="contacts" element={<Contacts />} />
            </Route>


            {/* --- SUPER ADMIN ROUTES --- */}
            {/* Main Super Admin Panel */}
            <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['superadmin', 'superadmin_employee']}><AdminLayout role="superadmin" /></ProtectedRoute>}>
                <Route index element={<SuperAdminDashboard />} />
                <Route path="admins" element={<AdminAccounts />} />
                <Route path="plans" element={<PlansManagement />} />
                <Route path="settings" element={<SuperAdminSettings />} />
                <Route path="reports" element={<div>System Reports (Coming Soon)</div>} />
                <Route path="calendar" element={<div>System Calendar (Coming Soon)</div>} />
            </Route>

            {/* Super Admin CRM Panel */}
            <Route path="/superadmin/crm" element={<ProtectedRoute allowedRoles={['superadmin', 'superadmin_employee']}><CRMLayout role="superadmin" /></ProtectedRoute>}>
                <Route index element={<AdminCRM />} />
                <Route path="leads" element={<LeadsManagement />} />
                <Route path="pipeline" element={<SalesPipeline />} />
                <Route path="follow-ups" element={<FollowUps />} />
                <Route path="contacts" element={<Contacts />} />
            </Route>

            {/* --- MANAGER ROUTES --- */}
            {/* Main Manager Panel */}
            <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']}><ManagerLayout /></ProtectedRoute>}>
                <Route index element={<ManagerDashboard />} />
                <Route path="assign-task" element={<AssignTask />} />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="delegation" element={<TaskDelegation />} />
                <Route path="team" element={<TeamManagement />} />
                <Route path="progress" element={<TeamProgress />} />
                <Route path="schedule" element={<ManagerSchedule />} />
                <Route path="reports" element={<ManagerReports />} />
                <Route path="settings" element={<ManagerSettings />} />
                <Route path="settings/profile" element={<ManagerSettings />} />
                <Route path="settings/notifications" element={<ManagerSettings />} />
                <Route path="settings/security" element={<ManagerSettings />} />
                <Route path="settings/customization" element={<ManagerSettings />} />
                <Route path="settings/language" element={<ManagerSettings />} />
            </Route>

            {/* Manager CRM Panel */}
            <Route path="/manager/crm" element={<ProtectedRoute allowedRoles={['manager']}><CRMLayout role="manager" /></ProtectedRoute>}>
                <Route index element={<EmployeeCRM />} />
                <Route path="leads" element={<LeadsManagement />} />
                <Route path="pipeline" element={<SalesPipeline />} />
                <Route path="follow-ups" element={<FollowUps />} />
                <Route path="contacts" element={<Contacts />} />
            </Route>

            {/* --- SALES ROUTES --- */}
            {/* Main Sales Panel */}
            <Route path="/sales" element={<ProtectedRoute allowedRoles={['sales']}><ManagerLayout role="sales" /></ProtectedRoute>}>
                <Route index element={<SalesDashboard />} />
                <Route path="deals" element={<Deals />} />
                <Route path="tasks" element={<SalesTasks />} />
                <Route path="clients" element={<Clients />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="reports" element={<SalesReports />} />
                <Route path="settings" element={<SalesSettings />} />
            </Route>

            {/* Sales CRM Panel */}
            <Route path="/sales/crm" element={<ProtectedRoute allowedRoles={['sales']}><CRMLayout role="sales" /></ProtectedRoute>}>
                <Route index element={<EmployeeCRM />} />
                <Route path="leads" element={<LeadsManagement />} />
                <Route path="pipeline" element={<SalesPipeline />} />
                <Route path="follow-ups" element={<FollowUps />} />
                <Route path="contacts" element={<Contacts />} />
            </Route>

            {/* Default Redirection */}
            <Route path="/" element={<NotFoundRedirect />} />
            <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
    );
};

export default AppRouter;
