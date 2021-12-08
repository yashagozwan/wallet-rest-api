import promisePool from '../database/promisePool.js';

import {
  generateWalletAddress,
  walletAddressAndAmountVaidate,
} from '../models/walletModel.js';

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

    if (!wallet.length)
      return res
        .status(400)
        .json({ success: false, error: 'wallet not created' });

    res.status(200).json({ success: true, data: wallet[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//* METHOD GET
//* GET WALLET
//* URL: /wallets/transfers
export const transfers = async (req, res) => {
  try {
    const { walletAddress, amount } =
      await walletAddressAndAmountVaidate.validateAsync(req.body);

    const [walletSender] = await promisePool.query(
      'SELECT * FROM Wallets WHERE id = ?',
      [req.account.id]
    );

    let {
      balance: senderBalance,
      walletAddress: senderWalletAddress,
      id: senderWalletId,
    } = walletSender[0];

    //* if send to own wallet
    if (walletAddress === senderWalletAddress)
      return res
        .status(400)
        .json({ success: false, error: "can't send to own wallet" });

    const [walletReceiver] = await promisePool.query(
      'SELECT * FROM Wallets WHERE walletAddress = ?',
      [walletAddress]
    );

    //* if wallet not found
    if (!walletReceiver.length)
      return res
        .status(400)
        .json({ success: false, error: 'wallet address not found' });

    let {
      balance: receiverBalance,
      userId: receiverUserId,
      id: receiverWalletId,
    } = walletReceiver[0];

    //* if balance not enough
    if (senderBalance < amount)
      return res
        .status(400)
        .json({ success: false, error: 'not enough balance' });

    senderBalance -= amount;
    receiverBalance += amount;

    const [updateWalletSender] = await promisePool.query(
      'UPDATE Wallets SET balance = ? WHERE userId = ?',
      [senderBalance, req.account.id]
    );

    const [updateWalletReceiver] = await promisePool.query(
      'UPDATE Wallets SET balance = ? WHERE userId = ?',
      [receiverBalance, receiverUserId]
    );

    const [transfer] = await promisePool.query(
      'INSERT INTO Transfers(senderWalletId, receiverWalletId, amount) VALUES (?, ?, ?)',
      [senderWalletId, receiverWalletId, amount]
    );

    //* if successfully transferred
    if (
      updateWalletSender.affectedRows &&
      updateWalletReceiver.affectedRows &&
      transfer.affectedRows
    ) {
      res
        .status(200)
        .json({ success: true, status: 'successfully transferred' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
