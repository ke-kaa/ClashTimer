import apiClient from './apiClient';

export const register = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        if (response.data.tokens?.accessToken) {
            localStorage.setItem('authToken', response.data.tokens.accessToken);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};


export const login = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.tokens?.accessToken) {
            localStorage.setItem('authToken', response.data.tokens.accessToken);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};


export const logout = async () => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error('Logout API call failed, but proceeding with client-side logout:', error);
    } finally {
        localStorage.removeItem('authToken');
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

export const resetPassword = async (resetData) => {
    try {
        const response = await apiClient.post('/auth/reset-password', resetData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};