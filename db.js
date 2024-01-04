const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./bridges.db";

function connectToDatabase() {
    if (fs.existsSync(filepath)) {
      return new sqlite3.Database(filepath);
    } else {
      const db = new sqlite3.Database(filepath, (error) => {
        if (error) {
          console.log("Error creating db")
          return console.error(error.message);
        }
        createTable(db);
        console.log("Connected to the database successfully");
      });
      return db;
    }
  }

  function createTable(db) {
    console.log("Creating table");
    db.exec(`
    CREATE TABLE bridges
    ( 
      id INT,
      latitude   REAL,
      longitude  REAL
    )
  `);
  }
  
  module.exports = connectToDatabase();