const fs = require("fs");
const { parse } = require("csv-parse");
const db = require("./db");


fs.createReadStream("./PA22.csv")
  .pipe(parse({ delimiter: ",", from_line: 2, relax_quotes: true }))
  .on("data", function (row) {
    db.serialize(function () {
      db.run(
        `INSERT INTO bridges VALUES (?, ? , ?, ?, ?)`,
        [row[1], parseLatitude(row[19]), -parseLongitude(row[20]), convertDate(row[84]), "Road: " + row[12] + "\nCrosses: " + row[10] + "\nLocation: " + row[13]],
        function (error) {
          if (error) {
            return console.log(error.message);
          }        
        }
      );

     
      db.run('CREATE INDEX IF NOT EXISTS idx_inspection_date ON bridges (inspection_date)');
     
    });
  });

  function convertDate(dateValue){
    var dateString = String(dateValue);

    var month;
    var year;
    if(dateString.length == 3){
       month = dateString.slice(0,1);
       month = "0"+month;
       year = dateString.slice(1);
    }
    else{
      month = dateString.slice(0,2);
      year = dateString.slice(2);
    }




    return "20"+year+"-"+month+"-01"

  }

  function parseLatitude(latValue){
    var latString = String(latValue);

    var degrees = latString.slice(0,2);
    var minutes = latString.slice(2,4);
    var secondsBeforeDecimal = latString.slice(4,6);
    var secondsAfterDecimal = latString.slice(6);

    var seconds = secondsBeforeDecimal + "." + secondsAfterDecimal;

    var degFloat = parseFloat(degrees);
    var minuteFloat = parseFloat(minutes) / 60;
    var secondsFloat = parseFloat(seconds) / 3600;

    var latitudeDecimal = degFloat + minuteFloat + secondsFloat;
    return latitudeDecimal;


  }

  function parseLongitude(longValue){
    var longString = String(longValue);

    var degrees = longString.slice(1,3);
    var minutes = longString.slice(3,5);
    var secondsBeforeDecimal = longString.slice(5,7);
    var secondsAfterDecimal = longString.slice(7);

    var seconds = secondsBeforeDecimal + "." + secondsAfterDecimal;

    var degFloat = parseFloat(degrees);
    var minuteFloat = parseFloat(minutes) / 60;
    var secondsFloat = parseFloat(seconds) / 3600;

    var longitudeDecimal = degFloat + minuteFloat + secondsFloat;
    return longitudeDecimal;
  }

  function insertDecimal(num) {
    return Number((num / 1000000));
 }