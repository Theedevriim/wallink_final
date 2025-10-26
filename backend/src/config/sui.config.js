import { SuiClient } from '@mysten/sui/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules için __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Backend klasöründeki .env dosyasını oku
dotenv.config({ path: path.join(__dirname, '../../../.env') });

class SuiConfig {
  constructor() {
    this.network = process.env.SUI_NETWORK || 'testnet';
    this.rpcUrl = process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';
    this.client = new SuiClient({ url: this.rpcUrl });
    this.packageId = process.env.LINKTREE_PACKAGE_ID;
    this.moduleName = process.env.LINKTREE_MODULE_NAME || 'linktree_nft';
    this.defaultGasBudget = parseInt(process.env.DEFAULT_GAS_BUDGET) || 50000000;
  }

  getClient() { return this.client; }
  getPackageId() { return this.packageId; }
  getModuleName() { return this.moduleName; }
  getDefaultGasBudget() { return this.defaultGasBudget; }
}

export default new SuiConfig();