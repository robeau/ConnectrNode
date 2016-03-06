var http = require('http');
var https = require('https');
var fs = require('fs');
var wstream = fs.createWriteStream('output.json');
var wstreamImg = fs.createWriteStream('outputImg.json');
var wstreamVid = fs.createWriteStream('outputVid.json');
var content;
var jsonResult;
var topic = 'hackathon';

function getTopFiveTweets() {
  https.get('https://search-proxy.spredfast.com/search.json?q=' + topic + '&filter.start=-1h&filter.finish=0&view.entities.limit=20', function (res) {
      res.pipe(wstream);

      wstream.on('finish', function() {
        fs.readFile('output.json', 'utf8', function (err, data) {
          if (err) throw err;
          var obj = JSON.parse(data);
          console.log('got', obj.views.entities.data.length, 'tweets about', topic, "in the past hour.");
          var myFive = getTop(obj.views.entities.data);
          var entryArr = [];
          myFive.forEach(function(tweet) {
            entryArr.push({
                topic: topic,
                retweets: tweet.raw.retweet_count,
                user: tweet.raw.user.screen_name,
                text: parseTweetText(tweet.raw.text)
              });
            console.log( tweet.raw.user.screen_name, parseTweetText(tweet.raw.text), tweet.raw.retweet_count);
          });
        });
      });
  });
}

function getTopImage() {
  https.get('https://search-proxy.spredfast.com/search.json?q=' + topic + '&filter.start=-1d&filter.finish=0&view.entities.limit=20&filter.has_image=true', function (res) {
      res.pipe(wstreamImg);

      wstreamImg.on('finish', function() {
        fs.readFile('outputImg.json', 'utf8', function (err, data) {
          if (err) throw err;
          var obj = JSON.parse(data);
          var myImage = getTop(obj.views.entities.data)[0];
          var entry = {
            topic: topic,
            retweets: myImage.raw.retweet_count,
            user: myImage.raw.user.screen_name,
            url: myImage.raw.entities.media[0].media_url
          }
          console.log('The top image related to ' + topic + ' from the past 24 hours got ' + entry.retweets + ' retweets, and was posted by' + entry.user);
          console.log('Image url:', entry.url);
        });
      });
  });
}

function getTopVideo() {
  https.get('https://search-proxy.spredfast.com/search.json?q=' + topic + '&filter.start=-1d&filter.finish=0&view.entities.limit=20&filter.has_video=true', function (res) {
      res.pipe(wstreamVid);

      wstreamVid.on('finish', function() {
        fs.readFile('outputVid.json', 'utf8', function (err, data) {
          if (err) throw err;
          var obj = JSON.parse(data);
          var myVideo = getTop(obj.views.entities.data)[0];
          var entry = {
            topic: topic,
            retweets: myVideo.raw.retweet_count,
            user: myVideo.raw.user.screen_name,
            url: myVideo.raw.entities.urls[0].expanded_url
          }
          console.log('The top video related to ' + topic + ' from the past 24 hours got ' + entry.retweets + ' retweets, and was posted by' + entry.user);
          console.log('Video url:', entry.url);
        });
      });
  });
}

function parseTweetText(str) {
  var arr = str.split(' ');

  if(arr.indexOf('RT') >= 0) {
    arr.splice(arr.indexOf('RT'),1, 'retweeted');
  }
  if(arr[0] !== 'retweeted') arr.unshift('tweeted');

  for(var i = 0; i < arr.length; i++) {
    if(arr[i].indexOf('http') >= 0) {
      arr.splice(i,1);
    }
  }

  return arr.join(' ');
}

function getTop(tweets) {
  var arr = [],
      rtCache = {};


  tweets.forEach(function(tweet) {
    if(!tweet.raw.retweeted_status || !rtCache[tweet.raw.retweeted_status.id]){
      if(!rtCache[tweet.id]) {
        if(arr.length < 5) {
          arr.push(tweet);
          if(tweet.raw.retweeted_status) rtCache[tweet.raw.retweeted_status.id] = 1;
          else rtCache[tweet.id] = 1;
        }
        else if(tweet.raw.retweet_count < arr[4].raw.retweet_count) {
          arr.splice(4,1);
          arr.push(tweet);
          if(tweet.raw.retweeted_status) rtCache[tweet.raw.retweeted_status.id] = 1;
          else rtCache[tweet.id] = 1;
        }

        arr.sort(function(a,b) {
          return +b.raw.retweet_count - +a.raw.retweet_count;
        });
      }
    }
  });
  return arr;
}

getTopFiveTweets();
getTopVideo();
getTopImage();
