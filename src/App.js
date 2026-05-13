import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Dashboard pages
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';

// Student pages
import StudentList from './pages/students/StudentList';
import AddStudent from './pages/students/AddStudent';
import EditStudent from './pages/students/EditStudent';
import StudentProfile from './pages/students/StudentProfile';

// Other pages
import AttendancePage from './pages/attendance/AttendancePage';
import SettingsPage from './pages/settings/SettingsPage';
import UsersPage from './pages/users/UsersPage';

// Loading component
const LoadingScreen = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg)',
    flexDirection: 'column', gap: '16px'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px', fontWeight: '700', color: 'white'
    }}>A</div>
    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading ACADEX...</div>
  </div>
);

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
};

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) {
    const dashboardMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
    return <Navigate to={dashboardMap[user.role] || '/login'} replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><AdminDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><StudentList /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/students/add" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><AddStudent /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/students/edit/:id" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><EditStudent /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/students/:id" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><StudentProfile /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/attendance" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><AttendancePage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><UsersPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout><SettingsPage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Teacher */}
      <Route path="/teacher" element={
        <ProtectedRoute roles={['teacher']}>
          <DashboardLayout><TeacherDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/teacher/students" element={
        <ProtectedRoute roles={['teacher']}>
          <DashboardLayout><StudentList /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/teacher/students/add" element={
        <ProtectedRoute roles={['teacher']}>
          <DashboardLayout><AddStudent /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/teacher/students/edit/:id" element={
        <ProtectedRoute roles={['teacher']}>
          <DashboardLayout><EditStudent /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/teacher/students/:id" element={
        <ProtectedRoute roles={['teacher']}>
          <DashboardLayout><StudentProfile /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/teacher/attendance" element={
        <ProtectedRoute roles={['teacher']}>
          <DashboardLayout><AttendancePage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/teacher/settings" element={
        <ProtectedRoute roles={['teacher']}>
          <DashboardLayout><SettingsPage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Student */}
      <Route path="/student" element={
        <ProtectedRoute roles={['student']}>
          <DashboardLayout><StudentDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/settings" element={
        <ProtectedRoute roles={['student']}>
          <DashboardLayout><SettingsPage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '14px',
              }
            }}
          />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;