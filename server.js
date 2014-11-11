var express     = require('express'),
    app         = express(),
    path        = require('path'),
    nodemailer  = require('nodemailer'),
    passport    = require('passport'),
    Twit        = require('twit'),
    config      = require('./config');

app.locals.moment = require('moment');
require('./admin/auth')(passport, config);

app.configure(function () {
    app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.PORT || 'localhost');
    app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || config.port || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.set('views', __dirname + '/admin/views');
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/admin/public'));
    app.use(express.static(path.join(__dirname)));
    app.use(express.session({secret: 'trooper'}));
    app.use(passport.initialize());
    app.use(passport.session());
});

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", config.mail);

app.post('/contactForm', function(req, res){
    // url check
    var urlRegExp = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/);

    var contactMessage = req.body.message;
    var urlCheck = urlRegExp.test(contactMessage);

    if(!urlCheck) {
        var mailOptions = {
            from: req.body.name + " " + req.body.email, // sender address
            to: "webmaster@justinglock.com", // list of receivers
            subject: "New Contact Form Submitted From JustinGlock.com", // Subject line
            text: req.body.message // plaintext body
        };

        smtpTransport.sendMail(mailOptions, function (err, res){
            if(err){
                console.log(err);
            }else{
                console.log("Message sent: " + res.message);
            }
        });
        res.send({ status: 'success', html: 'Thank You!' });
    } else {
        res.send({ status: 'fail', html: 'Please remove any urls in message, Thank You!' });
    }
});

// Twitter credentials for new API
// Register for app on twitter and get the credentials needed below
var T = new Twit({
    consumer_key: config.twitter.key
  , consumer_secret: config.twitter.secret
  , access_token: config.twitter.access_token
  , access_token_secret: config.twitter.access_token_secret
});

// Get the twitter feed and send it to the tweet scroller
// Note: Enter your own credentials into the following fields:
//       screen_name:
app.get('/tweet', function(req, res) {
    var tweets = [];

    // console.log('tweet req: ', req);

    T.get('statuses/user_timeline', { screen_name: 'JTGlock', count: '5', trim_user: 'true'}, function(err, reply) {
        console.log('reply: ', reply);
        console.log('err: ', err);
        if (reply != null)
        {
            for (var i = 0; i < reply.length; i++) {
                var tweet = {'text' : reply[i].text, 'time' : moment(reply[i].created_at).fromNow()};
                tweets.push(tweet);
            };
        res.send(tweets);
        } else {
            res.send(null);
        }
    });
});

require('./admin/routes')(app, passport);

app.listen(app.get('port'), app.get('ip'), function () {
    console.log("Express server listening on port " + app.get('ip') + ':' + app.get('port'));
});
