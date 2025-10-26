import { Transaction } from '@mysten/sui/transactions';
import { toBase64 } from '@mysten/sui/utils';
import suiConfig from '../config/sui.config.js';

class SponsorService {
  constructor() {
    this.client = suiConfig.getClient();
    this.packageId = suiConfig.getPackageId();
    this.moduleName = suiConfig.getModuleName();
    this.gasBudget = suiConfig.getDefaultGasBudget();
  }

  async createNFTProfile({ userAddress, name, surname, description, socialLinks }) {
    const tx = new Transaction();
    tx.setGasBudget(this.gasBudget);
    tx.setSender(userAddress); // zkLogin user

    const linkTitles = socialLinks.map(link => link.title);
    const linkUrls = socialLinks.map(link => link.url);

    tx.moveCall({
      target: `${this.packageId}::${this.moduleName}::create_profile_nft`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(surname),
        tx.pure.string(description),
        tx.pure.vector('string', linkTitles),
        tx.pure.vector('string', linkUrls),
      ],
    });

    const txBytes = await tx.build({ client: this.client });
    return {
      success: true,
      transactionBytes: toBase64(txBytes),
    };
  }

  async addSocialLink(userAddress, nftId, title, url) {
    const tx = new Transaction();
    tx.setGasBudget(this.gasBudget);
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${this.packageId}::${this.moduleName}::add_social_link`,
      arguments: [tx.object(nftId), tx.pure.string(title), tx.pure.string(url)],
    });

    const txBytes = await tx.build({ client: this.client });
    return { success: true, transactionBytes: toBase64(txBytes) };
  }

  async updateSocialLink(userAddress, nftId, linkIndex, newTitle, newUrl) {
    const tx = new Transaction();
    tx.setGasBudget(this.gasBudget);
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${this.packageId}::${this.moduleName}::update_social_link`,
      arguments: [tx.object(nftId), tx.pure.u64(linkIndex), tx.pure.string(newTitle), tx.pure.string(newUrl)],
    });

    const txBytes = await tx.build({ client: this.client });
    return { success: true, transactionBytes: toBase64(txBytes) };
  }

  async removeSocialLink(userAddress, nftId, linkIndex) {
    const tx = new Transaction();
    tx.setGasBudget(this.gasBudget);
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${this.packageId}::${this.moduleName}::remove_social_link`,
      arguments: [tx.object(nftId), tx.pure.u64(linkIndex)],
    });

    const txBytes = await tx.build({ client: this.client });
    return { success: true, transactionBytes: toBase64(txBytes) };
  }

  async updateProfile(userAddress, nftId, name, surname, description) {
    const tx = new Transaction();
    tx.setGasBudget(this.gasBudget);
    tx.setSender(userAddress);

    tx.moveCall({
      target: `${this.packageId}::${this.moduleName}::update_profile`,
      arguments: [tx.object(nftId), tx.pure.string(name), tx.pure.string(surname), tx.pure.string(description)],
    });

    const txBytes = await tx.build({ client: this.client });
    return { success: true, transactionBytes: toBase64(txBytes) };
  }

  async executeTransaction(transactionBytes, zkLoginSignature) {
    const result = await this.client.executeTransactionBlock({
      transactionBlock: transactionBytes,
      signature: zkLoginSignature, // Sadece zkLogin signature
      options: {
        showEffects: true,
        showObjectChanges: true,
        showEvents: true,
      },
    });

    return {
      success: true,
      digest: result.digest,
      effects: result.effects,
      objectChanges: result.objectChanges,
      events: result.events,
    };
  }
}

export default new SponsorService();