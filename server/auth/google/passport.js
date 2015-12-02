var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function (User, config) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: "http://localhost:9000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            google: profile._json
          });
          user.save(function(err) {
            if (err) console.log("got this " + err);//done(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));
};

//    function(accessToken, refreshToken, profile, done) {
//      console.log("getting user " + profile.displayName);
//      console.log("getting user " + profile.emails[0].value);
//      console.log("getting user " + profile.username);
//
//      User.findOne({
//        'google.id': profile.id
//      }, function(err, user) {
//        if (!user) {
//          User.create({
//            name: profile.displayName,
//            email: profile.emails[0].value,
//            role: 'user',
//            provider: 'google'
//          }).then( function() {
//              // Account created, redirect to home
//              $location.path('/');
//            }).catch( function(err) {
//              err = err.data;
//              $scope.errors = {};
//            });
//        }
//      });
//    }
//  ));
//};


//  user = new User({
//    name: profile.displayName,
//    email: profile.emails[0].value,
//    role: 'user',
//    username: profile.displayName,
//    provider: 'google'
//    //contacts?
//  });
//  user.create(function(err) {
//    console.log("made it to save");
//    console.log("err is " + err);
//    if (err) done(err);
//    return done(err, user);
//  });
//} else {
//  console.log("err is " + err);
//  return done(err, user);

//}
