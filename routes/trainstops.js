const express = require("express");
const db = require("../connection");

const router = express.Router();

// Add a New Train Stop
router.post('/api/trainstops', (req, res) => {
  const { train_id, station_id, arrival_time, departure_time, fare } = req.body;
  const sql = "INSERT INTO TrainStops (train_id, station_id, arrival_time, departure_time, fare) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [train_id, station_id, arrival_time, departure_time, fare], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(201).json({ train_id, station_id, arrival_time, departure_time, fare });
  });
});

// Get Train Stop Details
router.get('/api/trainstops/:stop_id', (req, res) => {
  const { stop_id } = req.params;
  const sql = "SELECT * FROM TrainStops WHERE stop_id = ?";
  db.query(sql, [stop_id], (error, results) => {
    if (error) return res.status(500).send(error);
    if (results.length === 0) return res.status(404).send('Train stop not found');
    res.status(200).json(results[0]);
  });
});

// Update Train Stop Details
router.put('/api/trainstops/:stop_id', (req, res) => {
  const { stop_id } = req.params;
  const { train_id, station_id, arrival_time, departure_time, fare } = req.body;
  const sql = "UPDATE TrainStops SET train_id = ?, station_id = ?, arrival_time = ?, departure_time = ?, fare = ? WHERE stop_id = ?";
  db.query(sql, [train_id, station_id, arrival_time, departure_time, fare, stop_id], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json({ stop_id, train_id, station_id, arrival_time, departure_time, fare });
  });
});

// Delete a Train Stop
router.delete('/api/trainstops/:stop_id', (req, res) => {
  const { stop_id } = req.params;
  const sql = "DELETE FROM TrainStops WHERE stop_id = ?";
  db.query(sql, [stop_id], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(204).send();
  });
});

// List All Train Stops for a Train
router.get('/api/trainstops/train/:train_id', (req, res) => {
  const { train_id } = req.params;
  const sql = "SELECT * FROM TrainStops WHERE train_id = ? ORDER BY arrival_time";
  db.query(sql, [train_id], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json(results);
  });
});

module.exports = router;
