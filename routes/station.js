const express = require("express");
const db = require("../connection");

const router = express.Router();

// Add a New Station
router.post('/', (req, res) => {
  const { station_id, station_name, longitude, latitude } = req.body;
  const sql = "INSERT INTO Stations (station_id, station_name, longitude, latitude) VALUES (?, ?, ?, ?)";
  db.query(sql, [station_id, station_name, longitude, latitude], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(201).json({ station_id, station_name, longitude, latitude });
  });
});

// Get Station Details
router.get('/:station_id', (req, res) => {
  const { station_id } = req.params;
  const sql = "SELECT * FROM Stations WHERE station_id = ?";
  db.query(sql, [station_id], (error, results) => {
    if (error) return res.status(500).send(error);
    if (results.length === 0) return res.status(404).send('Station not found');
    res.status(200).json(results[0]);
  });
});

// List Trains at a Given Station
router.get('/:station_id/trains', (req, res) => {
  const { station_id } = req.params;
  const sqlStationCheck = "SELECT * FROM Stations WHERE station_id = ?";
  db.query(sqlStationCheck, [station_id], (error, stationResults) => {
    if (error) return res.status(500).send(error);
    if (stationResults.length === 0) {
      return res.status(404).json({ message: `station with id: ${station_id} was not found` });
    }
    const sql = `
      SELECT 
        T.train_id, 
        ST.arrival_time, 
        ST.departure_time 
      FROM 
        TrainStops ST 
      INNER JOIN 
        Trains T ON ST.train_id = T.train_id 
      WHERE 
        ST.station_id = ? 
      ORDER BY 
        ST.departure_time IS NULL, 
        ST.departure_time ASC, 
        ST.arrival_time IS NULL, 
        ST.arrival_time ASC, 
        T.train_id ASC`;
    db.query(sql, [station_id], (error, results) => {
      if (error) return res.status(500).send(error);
      if (results.length === 0) return res.status(200).json({ station_id: parseInt(station_id), trains: [] });
      const formattedResults = results.map(result => ({
        train_id: result.train_id,
        arrival_time: result.arrival_time,
        departure_time: result.departure_time
      }));
      res.status(200).json({ station_id: parseInt(station_id), trains: formattedResults });
    });
  });
});



// Update Station Details
router.put('/:station_id', (req, res) => {
  const { station_id } = req.params;
  const { station_name, longitude, latitude } = req.body;
  const sql = "UPDATE Stations SET station_name = ?, longitude = ?, latitude = ? WHERE station_id = ?";
  db.query(sql, [station_name, longitude, latitude, station_id], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json({ station_id, station_name, longitude, latitude });
  });
});

// Delete a Station
router.delete('/:station_id', (req, res) => {
  const { station_id } = req.params;
  const sql = "DELETE FROM Stations WHERE station_id = ?";
  db.query(sql, [station_id], (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(204).send();
  });
});

// List All Stations
router.get('/', (req, res) => {
  const sql ="SELECT * FROM Stations";
  db.query(sql, (error, results) => {
    if (error) return res.status(500).send(error);
    res.status(200).json(results);
  });
});

module.exports = router;
