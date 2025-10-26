import { useState } from "react";
import {
  useCurrentAccount,
  useConnectWallet,
  useWallets,
  useDisconnectWallet,
  ConnectButton
} from "@mysten/dapp-kit";
import { isEnokiWallet } from "@mysten/enoki";
import { Button } from "@/components/ui/button";

interface ZkLoginButtonProps {
  className?: string;
}

export function ZkLoginButton({ className }: ZkLoginButtonProps) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connectWallet } = useConnectWallet();
  const { mutateAsync: disconnectWallet } = useDisconnectWallet();
  const wallets = useWallets();
  const [isLoading, setIsLoading] = useState(false);

  // zkLogin ile bağlı olup olmadığını kontrol et
  const isConnectedViaGoogleZkLogin = () => {
    if (!currentAccount) return false;

    const enokiWallets = wallets.filter(isEnokiWallet);
    const googleWallet = enokiWallets.find(
      (wallet: any) =>
        wallet.provider === "google" || wallet.name?.includes("Google"),
    );

    return !!googleWallet && currentAccount.address !== undefined;
  };

  // Google ile giriş yapma
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log("🚀 Google zkLogin başlatılıyor...");

      if (currentAccount) {
        await disconnectWallet();
        console.log("Mevcut wallet bağlantısı kesildi");
      }

      // Enoki Google wallet'ı bul
      const enokiWallets = wallets.filter(isEnokiWallet);
      const googleWallet = enokiWallets.find(
        (wallet: any) =>
          wallet.provider === "google" || wallet.name?.includes("Google"),
      );

      if (!googleWallet) {
        console.error("❌ Google zkLogin wallet bulunamadı");
        alert("Google zkLogin wallet bulunamadı. Enoki yapılandırmasını kontrol edin.");
        return;
      }

      console.log("🔗 Google zkLogin wallet bulundu:", googleWallet);

      // Google zkLogin ile bağlan
      await connectWallet({ wallet: googleWallet });
      console.log("✅ Google zkLogin başarılı!");
      
    } catch (error) {
      console.error("❌ Google zkLogin hatası:", error);
      alert("Giriş başarısız: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış yapma
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      console.log("Wallet bağlantısı kesildi");
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  // zkLogin ile bağlıysa zkLogin bilgilerini göster
  if (currentAccount && isConnectedViaGoogleZkLogin()) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-blue-600/20 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium border border-blue-600/30">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>🔐 {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}</span>
          </div>
          <Button
            onClick={handleDisconnect}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-600/20 px-2 py-1 text-xs"
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  // Normal wallet ile bağlıysa uyarı göster ve Google login öner
  if (currentAccount && !isConnectedViaGoogleZkLogin()) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-md rounded-lg px-3 py-2 border border-slate-700/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-medium">
              {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-4)}
            </span>
          </div>
          <ConnectButton />
        </div>
      </div>
    );
  }

  // Bağlantı yok, Google login butonu göster
  return (
    <div className={className}>
      <Button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {isLoading ? "Connecting..." : "Connect with Google"}
      </Button>
    </div>
  );
}