import { useEffect } from "react";
import { authEventEmitter } from "../events/AuthEventEmitter";
import { useAuth } from "../context/AuthContext";

export const AuthListener = () => {
    const { logout } = useAuth();

    useEffect(() => {
        const handleLogout = () => {
            logout();
        };

        authEventEmitter.on("logout", handleLogout);

        return () => {
            authEventEmitter.off("logout", handleLogout);
        };
    }, [logout]);

    return null;
};
