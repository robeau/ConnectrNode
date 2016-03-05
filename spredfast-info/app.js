var http = require('http');
var https = require('https');
var fs = require('fs');
var wstream = fs.createWriteStream('spredfast-info/output.json');

https.get('https://search-proxy.spredfast.com/search.json?q=hackathon&filter.start=-1d&filter.finish=0&view.entities.limit=20', function (res) {
    res.pipe(wstream);
});
