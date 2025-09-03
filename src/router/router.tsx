import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Index from "../pages/Index";
import { Import, IndentDecrease } from 'lucide-react';
import MentorSignUp from "../pages/MentorSignUp"
import { CheckEmail } from '@/pages/CheckEmail';
import { VerifyEmail } from '@/pages/VerifyEmail';
import MentorDashboard from '@/pages/MentorDashboard';
import { Provider } from 'react-redux';
import { store } from '@/stores/store';
import PrivateRoute from '@/components/PrivateRoute';
import AdminLoginForm from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import ManageUsersPage from '@/pages/admin/ManageUsersPage';
import MentorProfile from '@/pages/mentor/MentorProfile';
import MentorVerification from '@/pages/admin/MentorVerification';
import StudentProfile from '@/pages/students/StudentProfile';
import ResetPassword from '@/pages/ResetPassword';
import ForgotPasswordPage from '@/pages/ForgotPassword';
import Discover from '@/pages/students/Discover';
import MentorSlots from '@/pages/mentor/MentorSlots';
import MentorLogin from '@/pages/MentorLogin';
import StudentSignup from '@/pages/StudentSignUp';
import StudentLogin from '@/pages/students/StudentLogin';
import MyMentors from '@/pages/MyMentors';
import ChatTest from '@/components/ui/ChatTest';
import Messages from '@/pages/students/Messages';
import MentorMessages from '@/pages/mentor/MentorMessages';
import BookingSuccessPage from '@/pages/students/BookingSuccessPage';
import Schedule from '@/pages/students/Schedule';
import MentorSessions from '@/pages/mentor/MentorSessions';
import MentorEarnings from '@/pages/mentor/MentorEarningsPage';
import SessionPage from '@/pages/SessionPage';
import Session from '@/pages/admin/Sessions'
import MentorFeedback from '@/pages/mentor/MentorFeedback';
MentorFeedback

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/mentor',
    children: [
      { path: 'register', element: <MentorSignUp /> },
      { path: 'login', element: <MentorLogin /> },
      { path: 'dashboard', element: <PrivateRoute role='mentor'><MentorDashboard /></PrivateRoute> },
      { path: 'profile', element: <PrivateRoute role='mentor'><MentorProfile /></PrivateRoute> },
      { path: 'mentor-slots', element: <PrivateRoute role='mentor'><MentorSlots /></PrivateRoute> },
      { path: 'messages', element: <PrivateRoute role='mentor'><MentorMessages /></PrivateRoute> },
      { path: 'sessions', element: <PrivateRoute role='mentor'><MentorSessions /></PrivateRoute> },
      { path: 'earnings', element: <PrivateRoute role='mentor'><MentorEarnings /></PrivateRoute> },
      { path: 'feedback', element: <PrivateRoute role='mentor'><MentorFeedback /></PrivateRoute> },

    ]
  },
  {
    path: '/student',
    children: [
      { path: 'register', element: <StudentSignup /> },
      { path: 'login', element: <StudentLogin /> },
      { path: 'dashboard', element: <PrivateRoute role='student'><StudentDashboard /></PrivateRoute> },
      { path: 'profile', element: <PrivateRoute role='student'><StudentProfile /></PrivateRoute> },
      { path: 'discover', element: <PrivateRoute role='student'><Discover /></PrivateRoute> },
      { path: 'my-mentors', element: <PrivateRoute role='student'><MyMentors /></PrivateRoute> },
      { path: 'messages', element: <PrivateRoute role='student'><Messages /></PrivateRoute> },
      { path: 'schedule', element: <PrivateRoute role='student'><Schedule /></PrivateRoute> },
    ]
  },
  {
    path: '/admin',
    children: [
      { path: 'login', element: <AdminLoginForm /> },
      { path: 'dashboard', element: <PrivateRoute role='admin'><AdminDashboard /></PrivateRoute> },
      { path: 'users', element: <PrivateRoute role='admin'><ManageUsersPage /></PrivateRoute> },
      { path: 'verification', element: <PrivateRoute role='admin'><MentorVerification /></PrivateRoute> },
      { path: 'sessions', element: <PrivateRoute role='admin'><Session /></PrivateRoute> },

    ]
  },
  {
    path: '/check-email',
    element: <CheckEmail />
  },
  {
    path: '/verify-email/:token',
    element: <VerifyEmail />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    path: '/reset-password/:uidb64/:token',
    element: <ResetPassword />
  },
  {
    path: '/booking/success',
    element: <PrivateRoute role='student'><BookingSuccessPage /></PrivateRoute>
  },
  {
    path: '/chat',
    element: <ChatTest chatRoomId={1} currentUserId={2} />
  },
  {
    path: '/session-student',
    element: <PrivateRoute role='student'><SessionPage/></PrivateRoute>
  },
  {
    path: '/session-mentor',
    element: <PrivateRoute role='mentor'><SessionPage/></PrivateRoute>
  }
]);



  export const AppRouter = () => {
    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  };