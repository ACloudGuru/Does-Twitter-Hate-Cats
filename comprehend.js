var AWS = require('aws-sdk');
 
AWS.config.loadFromPath('./config.json');

var comprehend = new AWS.Comprehend();

var params = {
    LanguageCode: 'en',
    Text : process.argv[2]
};

comprehend.detectSentiment(params, function(err,data){
   if(err) console.log(err)
   else console.log(data);
});

