const fs = require("fs");
const { parse } = require("csv-parse");
const db = require("./db");


fs.createReadStream("./PA22.csv")
  .pipe(parse({ delimiter: ",", from_line: 2, relax_quotes: true }))
  .on("data", function (row) {
    db.serialize(function () {
      db.run(
        `INSERT INTO bridges VALUES (?, ? , ?)`,
        [row[1], insertDecimal(row[19]), -insertDecimal(row[20])],
        function (error) {
          if (error) {
            return console.log(error.message);
          }        
        }
      );
    });
  });

  function insertDecimal(num) {
    return Number((num / 1000000));
 }