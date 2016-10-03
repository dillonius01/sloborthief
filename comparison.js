var resemble = require('node-resemble-js');
var fs = require('fs')
var Slack = require('slack-node');

var webhookUri = "https://hooks.slack.com/services/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";

var slack = new Slack();

slack.setWebhook(webhookUri);


// var api = resemble(picture).onComplete(function(data){
//       console.log('DATA', data);
//   });


var photo1 = fs.readFileSync('./photo1.png');
var photo2 = fs.readFileSync('./photo2.png')

// var api = resemble(photo).onComplete(function(data) {
//   console.log("DATA", data)
// })

var mismatch;

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

compare()


// export.modules = diff;