import { SuiClient } from '@mysten/sui/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules için __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multiple environment file locations to try
const envPaths = [
  path.join(__dirname, '../../../.env'),       // root/.env
  path.join(__dirname, '../../.env'),          // backend/.env
  '.env'                                       // current directory
];

// Try to load environment variables from multiple locations
let envLoaded = false;
for (const envPath of envPaths) {
  try {
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      console.log(`✅ SuiConfig: Environment loaded from: ${envPath}`);
      envLoaded = true;
      break;
    }
  } catch (error) {
    // Silently continue to next path
  }
}

if (!envLoaded) {
  console.log('⚠️  SuiConfig: Using system environment variables');
}

class SuiConfig {
  constructor() {
    try {
      this.network = process.env.SUI_NETWORK || 'testnet';
      this.rpcUrl = process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';
      this.client = new SuiClient({ url: this.rpcUrl });
      this.packageId = process.env.LINKTREE_PACKAGE_ID;
      this.moduleName = process.env.LINKTREE_MODULE_NAME || 'linktree_nft';
      this.defaultGasBudget = parseInt(process.env.DEFAULT_GAS_BUDGET) || 50000000;
      
      console.log(`🔗 SuiConfig initialized - Network: ${this.network}, RPC: ${this.rpcUrl}`);
    } catch (error) {
      console.error('❌ SuiConfig initialization failed:', error);
      // Use fallback values
      this.network = 'testnet';
      this.rpcUrl = 'https://fullnode.testnet.sui.io:443';
      this.client = new SuiClient({ url: this.rpcUrl });
      this.packageId = null;
      this.moduleName = 'linktree_nft';
      this.defaultGasBudget = 50000000;
    }
  }

  getClient() { return this.client; }
  getPackageId() { return this.packageId; }
  getModuleName() { return this.moduleName; }
  getDefaultGasBudget() { return this.defaultGasBudget; }
}

export default new SuiConfig();