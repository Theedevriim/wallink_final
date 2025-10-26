import express from 'express';
import sponsorService from '../services/sponsor.service.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const balance = await sponsorService.checkBalance();
    res.json({ status: 'ok', sponsor: balance, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-profile', async (req, res) => {
  try {
    const { userAddress, name, surname, description, socialLinks } = req.body;
    if (!userAddress || !name || !surname) return res.status(400).json({ error: 'userAddress, name, surname required' });
    if (!Array.isArray(socialLinks)) return res.status(400).json({ error: 'socialLinks must be array' });
    const result = await sponsorService.createNFTProfile({ userAddress, name, surname, description: description || '', socialLinks });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add-link', async (req, res) => {
  try {
    const { userAddress, nftId, title, url } = req.body;
    if (!userAddress || !nftId || !title || !url) return res.status(400).json({ error: 'All fields required' });
    const result = await sponsorService.addSocialLink(userAddress, nftId, title, url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-link', async (req, res) => {
  try {
    const { userAddress, nftId, linkIndex, newTitle, newUrl } = req.body;
    if (!userAddress || !nftId || linkIndex === undefined || !newTitle || !newUrl) return res.status(400).json({ error: 'All fields required' });
    const result = await sponsorService.updateSocialLink(userAddress, nftId, linkIndex, newTitle, newUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/remove-link', async (req, res) => {
  try {
    const { userAddress, nftId, linkIndex } = req.body;
    if (!userAddress || !nftId || linkIndex === undefined) return res.status(400).json({ error: 'All fields required' });
    const result = await sponsorService.removeSocialLink(userAddress, nftId, linkIndex);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-profile', async (req, res) => {
  try {
    const { userAddress, nftId, name, surname, description } = req.body;
    if (!userAddress || !nftId || !name || !surname) return res.status(400).json({ error: 'userAddress, nftId, name, surname required' });
    const result = await sponsorService.updateProfile(userAddress, nftId, name, surname, description || '');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/execute', async (req, res) => {
  try {
    const { transactionBytes, userSignature } = req.body;
    if (!transactionBytes || !userSignature) return res.status(400).json({ error: 'transactionBytes and userSignature required' });
    const result = await sponsorService.executeTransaction(transactionBytes, userSignature);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;