import {jwtDecode} from 'jwt-decode';

export const getStudentId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.id;
    } catch (err) {
        console.error('Invalid token:', err);
        return null;
    }
};

export const getStudentEmail = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.email;
    } catch (err) {
        console.error('Invalid token:', err);
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
    } catch (err) {
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};