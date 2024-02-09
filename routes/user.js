const express = require("express");
const db = require("../connection");

const router = express.Router();

// Create User
router.post('/', (req, res) => {
  const { user_id, user_name, balance } = req.body;
  const sql = "INSERT INTO Users (user_id, user_name, balance) VALUES (?, ?, ?)";
  db.query(sql, [user_id, user_name, balance], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(201).json({ user_id, user_name, balance });
  });
});

// Get User Details
router.get('/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = "SELECT * FROM Users WHERE user_id = ?";
  db.query(sql, [user_id], (error, results) => {
    if (error) return res.status(500).send(error);
    if (results.length === 0) return res.status(404).send('User not found');
    res.status(200).json(results[0]);
  });
});

// Update User Details
router.put('/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { user_name, balance } = req.body;
  const sql = "UPDATE Users SET user_name = ?, balance = ? WHERE user_id = ?";
  db.query(sql, [user_name, balance, user_id], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json({ user_id, user_name, balance });
  });
});

// Delete User
router.delete('/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = "DELETE FROM Users WHERE user_id = ?";
  db.query(sql, [user_id], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(204).send();
  });
});

// List All Users
router.get('/', (req, res) => {
  const sql = "SELECT * FROM Users";
  db.query(sql, (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json(results);
  });
});

module.exports = router;
