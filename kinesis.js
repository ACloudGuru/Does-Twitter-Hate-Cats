var Twitter = require('twitter');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var kinesis = new AWS.Kinesis();

var client = new Twitter({
    consumer_key: "twitter consumer key here",
    consumer_secret: "twitter consumer secret here",
    access_token_key: "twitter access token key here",
    access_token_secret: "twitter access token secret here"
});

var stream = client.stream('statuses/filter', {
    track: 'cat',
    language: 'en'
});

stream.on('data', function (event) {
    if (event.text) {
        var record = JSON.stringify({
            id: event.id,
            timestamp: event['created_at'],
            tweet: event.text.replace(/["'}{|]/g, '') //either strip out problem characters or base64 encode for safety 
        }) + '|'; // record delimiter

        kinesis.putRecord({
            Data: record,
            StreamName: 'twitterStream',
            PartitionKey: 'key'
        }, function (err, data) {
            if (err) {
                console.error(err);
            }
            console.log('sending: ', event.text);
        });
    }
});

stream.on('error', function (error) {
    throw error;
});