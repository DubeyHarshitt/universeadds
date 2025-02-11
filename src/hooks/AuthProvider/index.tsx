import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: false });
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setAuth({ token: true });
        }
    }, [])
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};


