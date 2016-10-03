var av = require('tessel-av');
// var os = require('os');
// var http = require('http');
// var port = 8000;
// var fs = require('fs');
// var path = require('path');
var camera = new av.Camera();
var easyimage = require('easyimage')

var tessel = require('tessel');
var rfidlib = require('rfid-pn532');
var rfid = rfidlib.use(tessel.port['A']);

var resemble = require('node-resemble-js');
// var fs = require('fs')
var Slack = require('slack-node');

var webhookUri = "https://hooks.slack.com/services/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";

var slack = new Slack();

slack.setWebhook(webhookUri);



// http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'image/png' });

//   camera.capture().pipe(response);

// }).listen(port, () => console.log(`http://${os.hostname()}.local:${port}`));




rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  var photos = []

  rfid.on('data', function(card) {
    console.log('UID:', card.uid.toString('hex'));
   	var capture = camera.capture();

    capture.on('data', function(data) {

    	console.log(data);
	    photos.push(data)

	    if (photos.length === 1) {
	    	console.log('Thanks for logging in!'); 
	    }
	    if (photos.length === 2) {
	    	var photo1 = photos.shift();
	    	var photo2 = photos.shift();

	    	compare(photo1, photo2);
	    }

    	
    })
  });
});

rfid.on('error', function (err) {
  console.error('this is an error', err);
});




function compare(photo1, photo2) {
  var diff = resemble(photo1).compareTo(photo2).onComplete(function(data) {
    if(parseInt(data.misMatchPercentage) > 50) {
      slack.webhook({
        channel: "#general",
        username: "SLOB BOT",
        icon_emoji: "https://media.giphy.com/media/u0v3z2iQLxyHC/giphy-facebook_s.jpg",
        text: "You slob. Clean up. SHAME ON YOU."
      }, function(err, response) {
        console.log(response);
      });
    }
    else {
      slack.webhook({
        channel: "#general",
        username: "Clean Bot",
        icon_emoji: "http://vignette4.wikia.nocookie.net/en.futurama/images/f/f2/PhilipJ.Fry.png/revision/latest?cb=20110916120042",
        text: "Yo, you're clean. Good job."
      }, function(err, response) {
        console.log(response);
      });

    }
  })
}
