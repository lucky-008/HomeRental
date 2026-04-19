import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Restore user from localStorage on mount
	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	const signIn = async (username, password) => {
		setLoading(true);
		setError(null);
		try {
			const response = await loginAPI(username, password);
			const userData = { username: response.username };
			setUser(userData);
			localStorage.setItem('user', JSON.stringify(userData));
			return response;
		} catch (err) {
			const errorMsg = err.message || 'Login failed';
			setError(errorMsg);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const register = async (username, password, email) => {
		setLoading(true);
		setError(null);
		try {
			const response = await registerAPI(username, password, email);
			const userData = { username: response.username };
			setUser(userData);
			localStorage.setItem('user', JSON.stringify(userData));
			return response;
		} catch (err) {
			const errorMsg = err.message || 'Registration failed';
			setError(errorMsg);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const signOut = () => {
		setUser(null);
		localStorage.removeItem('user');
		setError(null);
	};

	return (
		<AuthContext.Provider value={{ user, signIn, register, signOut, loading, error }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
