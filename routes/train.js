const express = require("express");
const db = require("../connection");

const router = express.Router();

// Add a New Train
router.post('/', (req, res) => {
  const { train_id, train_name, capacity, stops } = req.body;
  // Validate input
  if (!train_id || !train_name || !capacity || !Array.isArray(stops) || stops.length === 0) {
    return res.status(400).send("Invalid input data");
  }

  // Insert train into database
  const trainSql = "INSERT INTO Trains (train_id, train_name, capacity) VALUES (?, ?, ?)";
  db.query(trainSql, [train_id, train_name, capacity], (error, trainResult) => {
    if (error) return res.status(500).send(error);

    // Insert stops into database
    const stopsSql = "INSERT INTO TrainStops (train_id, station_id, arrival_time, departure_time, fare) VALUES ?";
    const stopsValues = stops.map(stop => [
      train_id,
      stop.station_id,
      stop.arrival_time || stop.departure_time, // Set arrival_time to departure_time if null
      stop.departure_time || stop.arrival_time, // Set departure_time to arrival_time if null
      stop.fare
    ]);
    db.query(stopsSql, [stopsValues], (error, stopsResult) => {
      if (error) return res.status(500).send(error);

      // Calculate service start and end times
      const service_start = stopsValues[0][2]; // Arrival time at first station
      const service_ends = stopsValues[stopsValues.length - 1][3]; // Departure time from last station

      // Send successful response
      res.status(201).json({
        train_id,
        train_name,
        capacity,
        service_start,
        service_ends,
        num_stations: stops.length
      });
    });
  });
});


// Get Train Details
router.get('/:train_id', (req, res) => {
  const { train_id } = req.params;
  const sql = "SELECT * FROM Trains WHERE train_id = ?";
  db.query(sql, [train_id], (error, results) => {
    if (error) return res.status(500).send(error);
    if (results.length === 0) return res.status(404).send('Train not found');
    res.status(200).json(results[0]);
  });
});

// Update Train Details
router.put('/:train_id', (req, res) => {
  // Implementation for updating train details
});

// Delete a Train
router.delete('/:train_id', (req, res) => {
  // Implementation for deleting a train
});

// List All Trains
router.get('/', (req, res) => {
  // Implementation for listing all trains
});

module.exports = router;
