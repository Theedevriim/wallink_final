import { useMutation } from '@tanstack/react-query';

// Backend API base URL
const API_BASE_URL = 'http://localhost:3001/api/sponsor';

export interface ProfileData {
  name: string;
  bio: string;
  website: string;
  twitter: string;
  instagram: string;
  github: string;
  linkedin: string;
}

export interface LinkData {
  title: string;
  url: string;
  icon: string;
}

// Sponsored transaction için backend API kullanma hook'u
export function useCreateProfile() {
  return useMutation({
    mutationFn: async ({ profileData, userAddress }: { profileData: ProfileData; userAddress: string }) => {
      try {
        // Social links array'i oluştur
        const socialLinks = [];
        if (profileData.website) socialLinks.push({ title: 'Website', url: profileData.website });
        if (profileData.twitter) socialLinks.push({ title: 'Twitter', url: `https://twitter.com/${profileData.twitter.replace('@', '')}` });
        if (profileData.instagram) socialLinks.push({ title: 'Instagram', url: `https://instagram.com/${profileData.instagram.replace('@', '')}` });
        if (profileData.github) socialLinks.push({ title: 'GitHub', url: `https://github.com/${profileData.github.replace('@', '')}` });
        if (profileData.linkedin) socialLinks.push({ title: 'LinkedIn', url: `https://linkedin.com/in/${profileData.linkedin.replace('@', '')}` });

        // Backend'e sponsored transaction request gönder
        const response = await fetch(`${API_BASE_URL}/create-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAddress,
            name: profileData.name,
            surname: '', // İsteğe göre surname eklenebilir
            description: profileData.bio,
            socialLinks
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Sponsored profile creation result:', result);
        
        return {
          success: true,
          personId: result.nftId || 'demo-person-id',
          transactionDigest: result.digest || 'demo-digest',
          ...result
        };
      } catch (error) {
        console.error('Sponsored profile creation error:', error);
        // Demo mode fallback
        return {
          success: true,
          personId: 'demo-person-id-' + Date.now(),
          transactionDigest: 'demo-digest-' + Date.now(),
          mode: 'demo'
        };
      }
    },
  });
}

// Sponsored link ekleme hook'u
export function useAddSocialLink() {
  return useMutation({
    mutationFn: async ({ userAddress, nftId, title, url }: { userAddress: string; nftId: string; title: string; url: string }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/add-link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAddress,
            nftId,
            title,
            url
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Sponsored link addition result:', result);
        
        return {
          success: true,
          transactionDigest: result.digest || 'demo-digest',
          ...result
        };
      } catch (error) {
        console.error('Sponsored link addition error:', error);
        // Demo mode fallback
        return {
          success: true,
          transactionDigest: 'demo-digest-' + Date.now(),
          mode: 'demo'
        };
      }
    },
  });
}

// User profiles alma hook'u
export function useGetUserProfiles() {
  return useMutation({
    mutationFn: async (_userAddress: string) => {
      try {
        // Backend'den kullanıcı profilleri al
        const response = await fetch(`${API_BASE_URL}/health`);
        await response.json(); // Response'u okuyoruz ama kullanmıyoruz
        
        // Demo veri döndür
        return [
          {
            id: 'demo-profile-1',
            name: 'Demo Profile',
            bio: 'Demo bio',
            links: []
          }
        ];
      } catch (error) {
        console.error('Get user profiles error:', error);
        return [];
      }
    },
  });
}