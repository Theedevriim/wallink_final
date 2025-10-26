import { useEnokiFlow, useZkLogin } from "@mysten/enoki/react";
import { useState } from "react";

export interface ZkLoginAccount {
  address: string;
  provider: string;
  email?: string;
  name?: string;
}

export function useZkLoginAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const zkLogin = useZkLogin();
  const enokiFlow = useEnokiFlow();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const protocol = window.location.protocol;
      const host = window.location.host;
      const redirectUrl = `${protocol}//${host}`;
      
      await enokiFlow.createAuthorizationURL({
        provider: "google",
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirectUrl,
        extraParams: {
          scope: "openid email profile",
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Enoki logout - localStorage temizle
      localStorage.removeItem('zkLogin');
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    }
  };

  const getZkLoginAccount = (): ZkLoginAccount | null => {
    if (!zkLogin.address) return null;
    
    return {
      address: zkLogin.address,
      provider: "google",
      email: undefined, // Claims bilgisi doğrudan erişilebilir değil
      name: undefined,
    };
  };

  return {
    isLoading,
    error,
    isAuthenticated: !!zkLogin.address,
    account: getZkLoginAccount(),
    loginWithGoogle,
    logout,
  };
}