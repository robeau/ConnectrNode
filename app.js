var http = require('http');
var https = require('https');
var fs = require('fs');
var wstream = fs.createWriteStream('output.json');
var content;
var jsonResult;
var topic = 'NBCUniversal';

https.get('https://search-proxy.spredfast.com/search.json?q=' + topic + '&filter.start=-1h&filter.finish=0&view.entities.limit=20', function (res) {
    res.pipe(wstream);

    wstream.on('finish', function() {
      fs.readFile('output.json', 'utf8', function (err, data) {
        if (err) throw err;
        var obj = JSON.parse(data);
        console.log('got', obj.views.entities.data.length, 'tweets about', topic, "in the past hour.");
        var myFive = topFive(obj.views.entities.data);
        myFive.forEach(function(tweet,i) {
          console.log('Tweet',i,tweet.raw.text);
        });
      });
    });
});

function topFive(tweets) {
  var arr = [];

  tweets.forEach(function(tweet) {
    if(arr.length < 5) {
      arr.push(tweet);
    }
    else if(tweet.raw.retweet_count < arr[4].raw.retweet_count) {
      arr.splice(4,1);
      arr.push(tweet);
    }
    arr.sort;
  });
  return arr;
}
