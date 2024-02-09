const express = require("express");
const db = require("../connection");

const router = express.Router();

// Create User
router.post('/users', (req, res) => {
  const { user_id, user_name, balance } = req.body;
  const sql = "INSERT INTO Users (user_id, user_name, balance) VALUES (?, ?, ?)";
  db.query(sql, [user_id, user_name, balance], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(201).json({ user_id, user_name, balance });
  });
});

// Get User Details
router.get('/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = "SELECT * FROM Users WHERE user_id = ?";
  db.query(sql, [user_id], (error, results) => {
    if (error) return res.status(500).send(error);
    if (results.length === 0) return res.status(404).send('User not found');
    res.status(200).json(results[0]);
  });
});

// Update User Details
router.put('/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { user_name, balance } = req.body;
  const sql = "UPDATE Users SET user_name = ?, balance = ? WHERE user_id = ?";
  db.query(sql, [user_name, balance, user_id], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json({ user_id, user_name, balance });
  });
});

// Delete User
router.delete('/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = "DELETE FROM Users WHERE user_id = ?";
  db.query(sql, [user_id], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(204).send();
  });
});

// List All Users
router.get('/users', (req, res) => {
  const sql = "SELECT * FROM Users";
  db.query(sql, (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json(results);
  });
});

// Get Wallet Balance
router.get('/wallets/:wallet_id', (req, res) => {
  const { wallet_id } = req.params;
  const sql = "SELECT user_id, user_name, balance FROM Users WHERE user_id = ?";
  db.query(sql, [wallet_id], (error, results) => {
    if (error) return res.status(500).send(error);
    if (results.length === 0) return res.status(404).json({ message: `wallet with id: ${wallet_id} was not found` });
    const { user_id, user_name, balance } = results[0];
    res.status(200).json({ wallet_id: parseInt(wallet_id), balance, wallet_user: { user_id, user_name } });
  });
});

// Add Wallet Balance
router.put('/wallets/:wallet_id', (req, res) => {
  const { wallet_id } = req.params;
  const { recharge } = req.body;
  if (recharge < 100 || recharge > 10000) {
    return res.status(400).json({ message: `invalid amount: ${recharge}` });
  }
  const sql = "UPDATE Users SET balance = balance + ? WHERE user_id = ?";
  db.query(sql, [recharge, wallet_id], (error, results) => {
    if (error) return res.status(500).send(error);
    if (results.affectedRows === 0) return res.status(404).json({ message: `wallet with id: ${wallet_id} was not found` });
    const updatedBalanceSql = "SELECT balance, user_id, user_name FROM Users WHERE user_id = ?";
    db.query(updatedBalanceSql, [wallet_id], (error, updatedResults) => {
      if (error) return res.status(500).send(error);
      const { balance, user_id, user_name } = updatedResults[0];
      res.status(200).json({ wallet_id: parseInt(wallet_id), balance, wallet_user: { user_id, user_name } });
    });
  });
});

module.exports = router;
