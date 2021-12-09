import promisePool from '../database/promisePool.js';

import {
  generateWalletAddress,
  walletAddressAndAmountVaidate,
  findWalletByUserId,
  findWalletByWalletAddress,
  walletAddressValidate,
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
        .json({ success: false, error: 'wallet already created' });

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
  try {
    const wallet = await findWalletByUserId(req.account.id);

    if (!wallet)
      return res
        .status(400)
        .json({ success: false, error: 'wallet not created' });

    res.status(200).json({ success: true, data: wallet });
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

    const walletSender = await findWalletByUserId(req.account.id);

    let {
      balance: senderBalance,
      walletAddress: senderWalletAddress,
      id: senderWalletId,
    } = walletSender;

    //* if send to own wallet
    if (walletAddress === senderWalletAddress)
      return res
        .status(400)
        .json({ success: false, error: "can't send to own wallet" });

    const walletReceiver = await findWalletByWalletAddress(walletAddress);

    //* if wallet not found
    if (!walletReceiver)
      return res
        .status(400)
        .json({ success: false, error: 'wallet address not found' });

    let {
      balance: receiverBalance,
      userId: receiverUserId,
      id: receiverWalletId,
    } = walletReceiver;

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

//* METHOD GET
//* GET WALLET
//* URL: /wallets/out
export const mutationOut = async (req, res) => {
  try {
    const wallet = await findWalletByUserId(req.account.id);
    const { id: walletId } = wallet;

    //* find out transaction by walletId
    const [data] = await promisePool.query(
      `SELECT T.id, name, walletAddress, amount, T.createdAt AS createdAt
       FROM Users AS U
          RIGHT JOIN Wallets AS W ON W.userId = U.id
          RIGHT JOIN Transfers AS T ON T.receiverWalletId = W.id
       WHERE T.senderWalletId = ?`,
      [walletId]
    );

    //* if no outgoing transactions
    if (!data.length)
      return res
        .status(404)
        .json({ success: false, error: 'no outgoing transactions' });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//* METHOD GET
//* GET WALLET
//* URL: /wallets/in
export const mutationIn = async (req, res) => {
  try {
    const wallet = await findWalletByUserId(req.account.id);
    const { id: walletId } = wallet;

    //* find in transaction by walletId
    const [data] = await promisePool.query(
      `SELECT T.id, name, walletAddress, amount, T.createdAt AS createdAt
       FROM Users AS U
          RIGHT JOIN Wallets AS W ON W.userId = U.id
          RIGHT JOIN Transfers AS T ON T.senderWalletId = W.id
       WHERE T.receiverWalletId = ?`,
      [walletId]
    );

    //* no incoming transactions
    if (!data.length)
      return res
        .status(404)
        .json({ success: false, error: 'no incoming transactions' });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//* METHOD GET
//* GET WALLET
//* URL: /wallets/get
export const getWalletFromOutSide = async (req, res) => {
  try {
    const { walletAddress } = walletAddressValidate.validateAsync(req.body);
    const data = await findWalletByWalletAddress(walletAddress);

    if (!data)
      return res
        .status(404)
        .json({ success: false, error: 'wallet not found' });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};
