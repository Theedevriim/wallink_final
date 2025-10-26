# Wallink - Sui zkLogin Linktree

Modern bir Linktree alternatifi, Sui blockchain ve zkLogin entegrasyonu ile.

## 🚀 Özellikler

- **zkLogin Entegrasyonu**: Google ile giriş yapma
- **Sui Blockchain**: Merkeziyetsiz profil yönetimi
- **Sponsored Transactions**: Kullanıcılar için ücretsiz işlemler
- **Modern UI**: Framer Motion animasyonları
- **Responsive Design**: Tüm cihazlarda çalışır

## 📁 Proje Yapısı

```
wallink_final/
├── backend/          # Express.js backend API
├── ui/               # React frontend
├── move/            # Move smart contracts
└── .gitignore       # Git ignore rules
```

## 🛠️ Kurulum

### 1. Repository'yi klonlayın

```bash
git clone <repo-url>
cd wallink_final
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm start
```

### 3. Frontend Kurulumu

```bash
cd ui
npm install
cp .env.example .env.local
# .env.local dosyasını düzenleyin
npm run dev
```

## 🌐 Deploy (Production)

### Backend Deploy (Render)

1. **Repository'yi GitHub'a push edin**
2. **Render.com'da yeni Web Service oluşturun**
3. **GitHub repository'yi bağlayın**
4. **Build & Deploy ayarları:**
   ```
   Build Command: npm install
   Start Command: npm start
   ```
5. **Environment Variables ekleyin:**
   ```
   SUI_NETWORK=testnet
   SUI_RPC_URL=https://fullnode.testnet.sui.io:443
   PRIVATE_KEY=your_sui_private_key_here
   WALLET_ADDRESS=your_sui_wallet_address_here
   LINKTREE_PACKAGE_ID=your_package_id_here
   LINKTREE_MODULE_NAME=linktree_nft
   DEFAULT_GAS_BUDGET=50000000
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

### Frontend Deploy (Vercel/Netlify)

1. **ui/ klasörünü ayrı repository olarak deploy edin**
2. **Environment Variables:**
   ```
   VITE_ENOKI_API_KEY=your_enoki_api_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_REDIRECT_URI=https://your-domain.com
   ```

## ⚙️ Yapılandırma

### Backend (.env)

```bash
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
PRIVATE_KEY=your_private_key_here
WALLET_ADDRESS=your_wallet_address_here
PORT=3001
ALLOWED_ORIGINS=http://localhost:5176
```

### Frontend (.env.local)

```bash
VITE_ENOKI_API_KEY=your_enoki_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_REDIRECT_URI=http://localhost:5176
```

## 🔑 API Keys

### Enoki API Key

1. [Enoki Dashboard](https://enoki.mystenlabs.com) adresine gidin
2. Yeni proje oluşturun
3. API key'ini kopyalayın

### Google OAuth Client ID

1. [Google Cloud Console](https://console.cloud.google.com) adresine gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Credentials" bölümüne gidin
4. "Create Credentials" > "OAuth 2.0 Client ID" seçin
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:5176`
7. Client ID'yi kopyalayın

## 🚀 Kullanım

1. **Backend'i başlatın**: `cd backend && npm start`
2. **Frontend'i başlatın**: `cd ui && npm run dev`
3. **Tarayıcıda açın**: `http://localhost:5176`
4. **"Connect with Google" butonuna tıklayın**
5. **Gmail hesabınızı seçin**
6. **Profil oluşturun ve linklerinizi ekleyin**

## 🔧 Teknolojiler

### Frontend

- **React 18** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **@mysten/dapp-kit** - Sui wallet integration
- **@mysten/enoki** - zkLogin integration

### Backend

- **Node.js** + Express.js
- **@mysten/sui.js** - Sui blockchain interaction
- **CORS** + **Helmet** - Security
- **Rate limiting** - API protection

### Blockchain

- **Sui Network** - Testnet
- **Move Language** - Smart contracts
- **zkLogin** - Privacy-preserving authentication

## 📝 API Endpoints

### Backend API

- `GET /` - Health check
- `POST /api/sponsor/create-profile` - Profil oluşturma
- `POST /api/sponsor/add-link` - Link ekleme
- `GET /api/sponsor/health` - Servis durumu

## 🔒 Güvenlik

- Tüm `.env` dosyaları `.gitignore` ile korunur
- Rate limiting ile API koruması
- CORS yapılandırması
- Helmet.js ile güvenlik headers

## 🐛 Hata Giderme

### "Google zkLogin wallet bulunamadı"

- Enoki API key'in doğru olduğundan emin olun
- Google Client ID'nin doğru olduğundan emin olun
- Network bağlantınızı kontrol edin

### "Backend bağlantı hatası"

- Backend'in çalışır durumda olduğundan emin olun
- CORS ayarlarını kontrol edin
- Port çakışması olup olmadığını kontrol edin

## 📄 Lisans

Bu proje açık kaynak kodludur.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request açın
