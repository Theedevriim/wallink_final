import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ZkLoginButton } from "./components/ZkLoginButton";
import { RegisterEnokiWallets } from "./components/RegisterEnokiWallets";
import { useCreateProfile, useAddSocialLink, useGetUserProfiles, type ProfileData, type LinkData } from "@/hooks/useBlockchain";
import { toast } from "sonner";

function App() {
  const account = useCurrentAccount();
  const [currentStep, setCurrentStep] = useState<'wallet' | 'profile' | 'links'>('wallet');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    bio: '',
    website: '',
    twitter: '',
    instagram: '',
    github: '',
    linkedin: ''
  });
  const [links, setLinks] = useState<LinkData[]>([]);
  const [createdPersonId, setCreatedPersonId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Blockchain hooks
  const createProfileMutation = useCreateProfile();
  const addSocialLinkMutation = useAddSocialLink();
  const getUserProfilesMutation = useGetUserProfiles();

  // Aktif account - normal wallet
  const activeAccount = account;

  // Check if user already has profiles
  useEffect(() => {
    if (activeAccount?.address) {
      getUserProfilesMutation.mutate(activeAccount.address, {
        onSuccess: (profiles) => {
          if (profiles && profiles.length > 0) {
            // User already has profiles, show them
            setCurrentStep('links');
            // TODO: Load existing profile data
          }
        }
      });
    }
  }, [activeAccount?.address, getUserProfilesMutation]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeAccount) {
      toast.error("Lütfen önce cüzdanınızı bağlayın");
      return;
    }

    setIsLoading(true);
    
    try {
      // Sponsored transaction ile profil oluştur
      const result = await createProfileMutation.mutateAsync({ 
        profileData, 
        userAddress: activeAccount.address
      });

      if (result.success) {
        setCreatedPersonId(result.personId);
        
        if (result.mode === 'demo') {
          toast.success("Profil başarıyla oluşturuldu! (Demo Mode)");
        } else {
          toast.success(`Profil blockchain'e kaydedildi! TX: ${result.transactionDigest?.slice(0, 8)}...`);
        }
        
        setCurrentStep('links');
      } else {
        toast.error("Profil oluşturulurken hata oluştu");
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error("Profil oluşturulurken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = async () => {
    const newLink = { title: '', url: '', icon: '' };
    setLinks([...links, newLink]);
  };

  const updateLink = (index: number, field: keyof LinkData, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

    const saveLink = async (index: number) => {
    const link = links[index];
    
    if (!activeAccount || !createdPersonId || !link.title || !link.url) {
      toast.error("Link bilgileri eksik");
      return;
    }

    setIsLoading(true);
    
    try {
      // Sponsored transaction ile link ekle
      const result = await addSocialLinkMutation.mutateAsync({
        userAddress: activeAccount.address,
        nftId: createdPersonId,
        title: link.title,
        url: link.url
      });
      
      if (result.success) {
        if (result.mode === 'demo') {
          toast.success("Link başarıyla eklendi! (Demo Mode)");
        } else {
          toast.success(`Link blockchain'e kaydedildi! TX: ${result.transactionDigest?.slice(0, 8)}...`);
        }
      } else {
        toast.error("Link kaydedilirken hata oluştu");
      }
    } catch (error) {
      console.error('Link save error:', error);
      toast.error("Link kaydedilirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Register Enoki Wallets */}
      <RegisterEnokiWallets />
      
      {/* Background Paths Animation - her zaman göster */}
      <BackgroundPaths />
      
      {/* Header with ZkLogin Button */}
      {activeAccount && (
        <div className="absolute top-6 right-6 z-30">
          <ZkLoginButton />
        </div>
      )}
      
      {/* Profil Oluşturma Overlay - transparan arka plan */}
      {activeAccount && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/10 backdrop-blur-sm">
          <div className="w-full max-w-md mx-auto">
            
            {/* Cüzdan Bağlandıktan Sonra Gösterilen İlk Durum */}
            {currentStep === 'wallet' && (
              <div className="bg-black/95 backdrop-blur-xl rounded-xl p-8 border border-gray-800 shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Cüzdan Bağlandı!
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Şimdi Linktree profilinizi oluşturabilirsiniz
                  </p>
                  <Button 
                    onClick={() => setCurrentStep('profile')}
                    className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Profil Oluştur
                  </Button>
                </div>
              </div>
            )}

            {/* Profil Formu */}
            {currentStep === 'profile' && (
              <div className="bg-black/95 backdrop-blur-xl rounded-xl p-8 border border-gray-800 shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profil Bilgileri
                  </h2>
                  <Button
                    onClick={() => setCurrentStep('wallet')}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-200"
                  >
                    ✕
                  </Button>
                </div>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      İsim
                    </label>
                    <Input
                      placeholder="Adınız"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full h-12 px-4 bg-black border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Bio
                    </label>
                    <Textarea
                      placeholder="Kendinizi tanıtın..."
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full h-24 px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <Input
                      placeholder="Website (https://)"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      className="w-full h-12 px-4 bg-black border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none"
                    />
                    <Input
                      placeholder="Twitter (@username)"
                      value={profileData.twitter}
                      onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                      className="w-full h-12 px-4 bg-black border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none"
                    />
                    <Input
                      placeholder="Instagram (@username)"
                      value={profileData.instagram}
                      onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                      className="w-full h-12 px-4 bg-black border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Blockchain'e Kaydediliyor..." : "Profil Kaydet"}
                  </Button>
                </form>
              </div>
            )}

            {/* Linktree Görünümü */}
            {currentStep === 'links' && (
              <div className="bg-black/95 backdrop-blur-xl rounded-xl p-8 border border-gray-800 shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Linktree Profilin
                  </h2>
                  <Button
                    onClick={() => setCurrentStep('profile')}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-200"
                  >
                    ✏️ Düzenle
                  </Button>
                </div>

                {/* Profil Kartı */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {profileData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {profileData.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {profileData.bio}
                  </p>
                  
                  {/* Sosyal Linkler */}
                  <div className="flex justify-center gap-3 mb-6">
                    {profileData.website && (
                      <a href={profileData.website} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 bg-black/60 hover:bg-gray-800/60 rounded-full flex items-center justify-center transition-all">
                        🌐
                      </a>
                    )}
                    {profileData.twitter && (
                      <a href={`https://twitter.com/${profileData.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 bg-black/60 hover:bg-gray-800/60 rounded-full flex items-center justify-center transition-all">
                        🐦
                      </a>
                    )}
                    {profileData.instagram && (
                      <a href={`https://instagram.com/${profileData.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 bg-black/60 hover:bg-gray-800/60 rounded-full flex items-center justify-center transition-all">
                        📷
                      </a>
                    )}
                  </div>
                </div>

                {/* Linkler - Fotograftaki gibi beyaz oval butonlar */}
                <div className="space-y-3">
                  {links.map((link, index) => (
                    link.title && link.url ? (
                      // Kayıtlı linkler - beyaz oval buton olarak göster
                      <div key={index} className="relative group">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full bg-white hover:bg-gray-100 text-black font-medium py-4 px-6 rounded-full text-center transition-all duration-200 shadow-lg"
                        >
                          {link.title}
                        </a>
                        <Button
                          onClick={() => removeLink(index)}
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </Button>
                      </div>
                    ) : (
                      // Yeni link ekleme formu
                      <div key={index} className="bg-black/60 backdrop-blur-lg border border-gray-800 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">Yeni Link</span>
                          <Button
                            onClick={() => removeLink(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            🗑️
                          </Button>
                        </div>
                        
                        <Input
                          placeholder="Link başlığı (örn: Photography Studio Hours)"
                          value={link.title}
                          onChange={(e) => updateLink(index, 'title', e.target.value)}
                          className="w-full h-12 px-4 bg-black border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none"
                        />
                        <Input
                          placeholder="URL (https://)"
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                          className="w-full h-12 px-4 bg-black border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none"
                        />
                        {link.title && link.url && (
                          <Button
                            onClick={() => saveLink(index)}
                            disabled={isLoading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                          >
                            {isLoading ? "Kaydediliyor..." : "Kaydet"}
                          </Button>
                        )}
                      </div>
                    )
                  ))}
                  
                  <Button
                    onClick={addLink}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-gray-600 border-dashed py-4 rounded-full backdrop-blur-lg"
                    variant="outline"
                  >
                    + Yeni Link Ekle
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
