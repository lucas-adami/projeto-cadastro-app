import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/apiService";
import { authEventEmitter } from "../events/AuthEventEmitter";
import { UsuarioResponse } from "../types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UsuarioResponse | null;
  userRole: "ADMIN" | "SUPER_ADMIN" | "MONITOR" | null;
  login: (token: string, userData?: UsuarioResponse) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UsuarioResponse | null>(null);
  const [userRole, setUserRole] = useState<
    "SUPER_ADMIN" | "ADMIN" | "MONITOR" | null
  >(null);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("token");
    delete api.defaults.headers.Authorization;
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const { getLoggedUser } = await import("../services/users/userService");
      const userData = await getLoggedUser();
      setUser(userData);
      setUserRole(userData.role);
    } catch (error: any) {
      console.error(
        "❌ AuthContext: Erro ao carregar dados do usuário:",
        error
      );
      // Em caso de erro, faz logout em vez de forçar como MONITOR
      // Isso é mais seguro e evita problemas de permissão
      await logout();
    }
  }, [logout]);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        await loadUserData();
      }
    };

    loadToken();

    const handleLogout = () => {
      logout();
    };

    authEventEmitter.on("logout", handleLogout);

    return () => {
      authEventEmitter.off("logout", handleLogout);
    };
  }, [logout, loadUserData]);

  const login = async (token: string, userData?: UsuarioResponse) => {
    await AsyncStorage.setItem("token", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setIsAuthenticated(true);

    // Se os dados do usuário foram fornecidos (do login), usa eles diretamente
    if (userData) {
      setUser(userData);
      setUserRole(userData.role);
    } else {
      // Caso contrário, carrega do servidor
      await loadUserData();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
