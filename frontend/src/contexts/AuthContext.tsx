import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getMe, loginUser, logoutUser, registerUser, type User, type LoginInput, type RegisterInput } from '../api/authApi';
import { getToken } from '../api/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cek apakah user sudah login saat pertama kali load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMe();
        if (res.data) {
          setUser(res.data);
        }
      } catch {
        // Token tidak valid, hapus
        logoutUser();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginInput) => {
    setError(null);
    setLoading(true);
    try {
      await loginUser(data);
      const meRes = await getMe();
      if (meRes.data) {
        setUser(meRes.data);
      }
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Login gagal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setError(null);
    setLoading(true);
    try {
      await registerUser(data);
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Registrasi gagal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}
