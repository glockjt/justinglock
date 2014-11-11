var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport, config) {
    'use strict';

    /*=============================================
    =            Serialize/Deserialize            =
    =============================================*/

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      findById(id, function (err, user) {
        done(err, user);
      });
    });

    /*-----  End of Serialize/Deserialize  ------*/

    /*====================================
    =            Find User ID            =
    ====================================*/

    function findById(id, fn) {
      var idx = id - 1;
      if (config.users.admin[idx]) {
        fn(null, config.users.admin[idx]);
      } else {
        fn(new Error('User ' + id + ' does not exist'));
      }
    }

    /*-----  End of Find User ID  ------*/

    /*=================================
    =            Find User            =
    =================================*/

    function findByUsername(username, fn) {
        for (var i = 0; i < config.users.admin.length; i++) {
            var user = config.users.admin[i];
            if (user.username === username) {
                return fn(null, user);
            }
        };
        return fn(null, null);
    }

    /*-----  End of Find User  ------*/

    /*===================================
    =            Local login            =
    ===================================*/

    passport.use('local-login', new LocalStrategy(
        function(username, password, done) {
            process.nextTick(function() {
                findByUsername(username, function(err, user) {
                    if(err) {
                        return done(err);
                    }
                    if(!user) {
                        return done(null, false, { message: 'Unknown user ' + user});
                    }
                    if(!bcrypt.compareSync(password, user.password)) {
                    // if(user.password != password) {
                        return done(null, false, { message: 'Invalid password' });
                    }
                    return done(null, user);
                });
            });
        }));

    /*-----  End of Local login  ------*/

    /*=====================================
    =            Twitter login            =
    =====================================*/

    passport.use(new TwitterStrategy({
        consumerKey: config.twitter.key,
        consumerSecret: config.twitter.secret,
        callbackURL: 'http://' + config.url + '/auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
        console.log('token: ', token);
        console.log('tokenSecret: ', tokenSecret);
        console.log('profile: ', profile);
        findByUsername(profile.username, function(err, user) {
            if(err) {
                return done(err);
            }
            if(!user) {
                return done(null, false, { message: 'Unknown user ' + profile.username});
            }
            return done(null, user);
        });
    }));

    /*-----  End of Twitter login  ------*/
};
