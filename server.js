var express = require('express');
var path = require('path');
var fs = require('fs');
var Converter = require('csvtojson').Converter;
var jsonfile = require('jsonfile')

var app = express();

var csvConverter = new Converter({})
csvConverter.on('end_parsed', function(json) {
  jsonfile.writeFile('public/dataset.json', json, function(err) {
    if (err) {
      throw err;
    }
    console.log('JSON file saved.');
  });
});

fs.createReadStream('public/dataset.csv').pipe(csvConverter);

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Listening to port ' + port);
});
