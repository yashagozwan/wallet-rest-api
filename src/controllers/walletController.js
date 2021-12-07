import promisePool from '../database/promisePool.js';

import { generateWalletAddress } from '../models/walletModel.js';

//* METHOD POST
//* CREATE WALLET
//* URL: /wallets
export const createWallet = async (req, res) => {
  const { id } = req.account;
  try {
    const [findExistId] = await promisePool.query(
      'SELECT * FROM Wallets WHERE userId = ?',
      [id]
    );

    if (findExistId.length)
      return res
        .status(400)
        .json({ success: false, error: 'wallet already exist' });

    const [wallet] = await promisePool.query(
      'INSERT INTO Wallets(userId, walletAddress, isActive) VALUES (?,?,?)',
      [id, generateWalletAddress(), true]
    );

    const [block] = await promisePool.query(
      'INSERT INTO Blocks(walletId) VALUES (?)',
      [wallet.insertId]
    );

    if (wallet.affectedRows && block.affectedRows) {
      res.status(200).json({ success: true, status: 'wallet created' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//* METHOD GET
//* GET WALLET
//* URL: /wallets
export const getWallet = async (req, res) => {
  const { id } = req.account;
  try {
    const [wallet] = await promisePool.query(
      'SELECT * FROM Wallets WHERE id = ?',
      [id]
    );
    res.status(200).json({ success: true, data: wallet[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
