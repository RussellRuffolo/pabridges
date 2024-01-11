const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const cors = require('cors');
const app = express ();

app.use(express.json());
app.use(cors());
const PORT = 3001;

let db = new sqlite3.Database('./bridges.db');

app.listen(PORT, () => {
    console.log("Server listening on PORT:", PORT)
})

app.get("/status", (request, response) => {
    const status = {
       "Status": "Running"
    };
    
    response.send(status);
 });

 app.get("/allbridges", (request, response) => {

    const sql = 'SELECT * FROM bridges';

    db.all(sql, [], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
  
      // Convert rows to JSON and pass it to the callback function
      const jsonData = JSON.stringify(rows);
      response.send(jsonData);
    });
 });

 app.get("/geojsonbridges", (request, response) => {

    const sql = 'SELECT * FROM bridges';

    db.all(sql, [], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }

      const result = createGeoJSON(rows)
  
  
      response.send(result);
    });
 });

 app.post("/inspection", (request, response) =>{

  
  
  const sql = 'SELECT * FROM bridges WHERE julianday(inspection_date) >= julianday(\''+request.body.date+'\')';
  console.log(sql);

  db.all(sql, [], (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }

    const result = createGeoJSON(rows)


    response.send(result);
  });

 })

 // Function to create GeoJSON object
function createGeoJSON(rowsData) {
    const features = rowsData.map(row => {
      return {
        type: 'Feature',
        properties: {
          id: row.id,
          name: 'Bridge',
          description: row.description
          // Add other properties as needed
        },
        geometry: {
          type: 'Point',
          coordinates: [row.longitude, row.latitude],
        },
      };
    });
  
    const geoJSON = {
      type: 'FeatureCollection',
      features: features,
    };
  
    return geoJSON;
  }