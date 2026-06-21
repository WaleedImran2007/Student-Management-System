import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ROUTING COMPONENTS
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AuthProvider from './store/AuthContext.jsx';

// COMPONENTS
import Dashboard from './pages/Dashboard.jsx'
import StudentList from './pages/StudentList.jsx'
import AddStudent from './pages/AddStudent.jsx'
import Courses from './pages/Courses.jsx'
import Attendance from './pages/Attendance.jsx'
import AddResult from './pages/AddResult.jsx'
import StudentProfile from './pages/StudentProfile.jsx'
import GradeCriteria from './pages/GradeCriteria.jsx'
import CourseProfile from './pages/CourseProfile.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import TeacherList from './pages/TeacherList.jsx'
import AddTeacher from './pages/AddTeacher.jsx'
import TeacherProfile from './pages/TeacherProfile.jsx'
import NoPermission from './pages/NoPermission.jsx'
import AdminProfile from './pages/AdminProfile.jsx'
import NotFound from './pages/NotFound.jsx'
import LandingPage from './pages/LandingPage.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx';
import VerifyToken from './pages/VerifyToken.jsx';
import AuthRoute from './components/AuthRoute.jsx';
import AIAssistant from './pages/AIAssistant.jsx';

const router = createBrowserRouter([
  {
    path: '/verify/:token', element: <VerifyToken />
  },

  // Public landing page (shown when not logged in)
  {
    path: '/welcome',
    element: <LandingPage />
  },

  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <AuthRoute><Dashboard /></AuthRoute> },
      { path: '/student-list', element: <ProtectedRoute allowedRoles={['Admin', 'Teacher']}><StudentList /></ProtectedRoute> },
      { path: '/add-student', element: <ProtectedRoute allowedRoles={['Admin']}><AddStudent /></ProtectedRoute> },
      { path: '/courses', element: <ProtectedRoute allowedRoles={['Admin', 'Student', 'Teacher']}><Courses /></ProtectedRoute> },
      { path: '/attendance', element: <ProtectedRoute allowedRoles={['Admin', 'Student', 'Teacher']}><Attendance /></ProtectedRoute> },
      { path: '/add-result', element: <ProtectedRoute allowedRoles={['Admin', 'Teacher']}><AddResult /></ProtectedRoute> },
      { path: '/studentProfile', element: <StudentProfile /> },
      { path: '/courseProfile', element: <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Student']}><CourseProfile /></ProtectedRoute> },
      { path: '/grade-criteria', element: <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Student']}><GradeCriteria /></ProtectedRoute> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/teacher-list', element: <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Student']}><TeacherList /></ProtectedRoute> },
      { path: '/add-teacher', element: <ProtectedRoute allowedRoles={['Admin']}><AddTeacher /></ProtectedRoute> },
      { path: '/teacherProfile', element: <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Student']}><TeacherProfile /></ProtectedRoute> },
      { path: '/no-permission', element: <NoPermission /> },
      { path: '/adminProfile', element: <ProtectedRoute allowedRoles={['Admin']}><AdminProfile /></ProtectedRoute> },
      { path: '*', element: <NotFound /> },
      
      // { path: '/sms-ai', element: <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Student']}><AIAssistant /></ProtectedRoute>},
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
