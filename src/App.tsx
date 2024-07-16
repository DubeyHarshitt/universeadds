import { Route, Routes, useNavigate, useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import ErrorBoundaries from './ErrorBoundaries';
import { QueryClient, QueryClientProvider } from 'react-query';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './hooks/AuthProvider';
import { useEffect } from 'react';
import { useValidateToken } from './services/fetchToken';

function App() {
  const content = useRoutes(router);
  const queryClient = new QueryClient();

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const storedToken = localStorage?.getItem('token');
    if (storedToken) {
      // Token is present, redirect to home page
      navigate('/');
    } else {
      // Token is not present, redirect to login page
      navigate('/login');
    }
  }, [auth])
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ErrorBoundaries>
              {content}
            </ErrorBoundaries>
          </AuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
