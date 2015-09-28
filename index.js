module.exports = factory;

function factory(options, callback) {
  return new Construct(options, callback);
}

function Construct(options, callback) {
  var self = this;
  var apos = options.apos;
  var app = options.app;
  var passport = options.passport;

  var LdapStrategy = require('passport-ldapauth');

  passport.use(new LdapStrategy({
    server: {
      url: options.url,
      bindDn: options.bindDn,
      bindCredentials: options.bindCredentials,
      searchBase: options.searchBase,
      searchFilter: '(|(uid={{username}})(mail={{username}}))',
      searchAttributes: ['givenName', 'sn', 'mail', 'uid', 'title', 'telephoneNumber']
    }
  }, function(user, done) {
    var email = user.mail;
    return apos.pages.findOne({ email: email, type : 'person', login : true }, function(err, person){
      if (err) {
        return done(err);
      }
      else if (!person) {
        return done(null, false);
      }
      return done(null, { _id : person._id, _mongodb : true });
    });
  }));

  app.post('/apos-ldap-login', passport.authenticate('ldapauth', {failureRedirect: options.failureRedirect}), function (req, res){
    // Successful authentication redirect
    res.redirect(options.afterLogin || '/');
  });

  // Invoke the callback. This must happen on next tick or later!
  return process.nextTick(function() {
    return callback(null);
  });
}

// Export the constructor so others can subclass
factory.Construct = Construct;
