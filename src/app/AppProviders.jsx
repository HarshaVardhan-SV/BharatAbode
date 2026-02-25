import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { AppDataProvider } from '../context/AppDataContext';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>{children}</AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
