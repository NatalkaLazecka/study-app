import {Routes, Route, Navigate} from 'react-router-dom';
import LandingPage from '@/pages/landing/LandingPage';
import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import TodoListPage from '@/features/todo/pages/TodoListPage';
import TodoDetailsPage from '@/features/todo/pages/TodoDetailsPage';
import CalendarPage from "../features/calendar/pages/CalendarPage";
import CalendarEventPage from "../features/calendar/pages/CalendarEventPage";
import UserProfilePage from "../features/profile/pages/UserProfilePage";
import GroupListPage from '@/features/group/pages/GroupListPage';
import GroupCreatePage from '@/features/group/pages/GroupCreatePage';
import GroupDetailsPage from '@/features/group/pages/GroupDetailsPage';
import {GroupsProvider} from '@/features/group/store/groupStore';

const ProtectedRoute = ({isAuthed, children}) =>
    isAuthed ? children : <Navigate to="/login" replace/>;

export default function AppRouter({isAuthed = true}) {
    return (
        <GroupsProvider>
            <Routes>
                {/*  Landing & Auth */}
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/reset-password" element={<ResetPasswordPage/>}/>

                {/* Calendar */}
                <Route path="/calendar" element={<CalendarPage/>}/>
                <Route path="/calendar/newEvent" element={<CalendarEventPage/>}/>

                {/*  Home */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute isAuthed={isAuthed}>
                            <HomePage/>
                        </ProtectedRoute>
                    }
                />

                {/*  To-Do list */}
                <Route
                    path="/todo"
                    element={
                        <ProtectedRoute isAuthed={isAuthed}>
                            <TodoListPage/>
                        </ProtectedRoute>
                    }
                />

                {/*  To-Do details / edit / new */}
                <Route
                    path="/todo/edit/:id"
                    element={
                        <ProtectedRoute isAuthed={isAuthed}>
                            <TodoDetailsPage mode="edit"/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/todo/new"
                    element={
                        <ProtectedRoute isAuthed={isAuthed}>
                            <TodoDetailsPage mode="new"/>
                        </ProtectedRoute>
                    }
                />
                {/* Profile */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute isAuthed={true}>
                            <UserProfilePage/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/groups"
                    element={
                        <ProtectedRoute isAuthed={isAuthed}>
                            <GroupListPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/groups/new"
                    element={
                        <ProtectedRoute isAuthed={isAuthed}>
                            <GroupCreatePage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/groups/:id"
                    element={
                        <ProtectedRoute isAuthed={isAuthed}>
                            <GroupDetailsPage/>
                        </ProtectedRoute>
                    }
                />

                {/*  Fallback */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </GroupsProvider>
    );
}