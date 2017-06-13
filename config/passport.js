var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt');


    passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },function(username, password, done) {
      // console.log("U------"+username+"-----p-------"+password);

        Login.findOne({
            email: username.trim()
        }, function (err, user) {
          console.log("---------user------------"+user);
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Credentials not recognised!' });
            }

            bcrypt.compare(password, user.password, function (err, res) {
                if (!res) {
                    return done(null, false, { message: 'Credentials not recognised!' });
                }

                return done(null, user, 'Signin success');
            });
        });
    }));
