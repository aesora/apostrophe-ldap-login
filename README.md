# apostrophe-ldap-login

This module allows users to log into your [Apostrophe site](http://apostrophenow.org) via their LDAP account, as an optional alternative to using their password.

There must be an existing user on the site with the same email address as the LDAP account.

## Installation

This module also requires that you install the `passport` module globally, so that we can be sure the same instance of `passport` is seen by both Apostrophe's standard login and `apostrophe-ldap-login`.

```
npm install --save apostrophe-ldap-login
npm install --save passport
```

## Configuration

First, you must require `passport` in `app.js`:

```javascript
var passport = require('passport');
```

Third, you must configure the `apostrophe-ldap-login` module in `app.js`, along with the other modules of your project:

```javascript
  modules: {
    "apostrophe-ldap-login": {
      url: 'ldap://localhost',
      bindDn: 'cn=Administrator',
      bindCredentials: 'secret',
      searchBase: 'dc=example,dc=com',

      // Make sure you pass in passport
      passport: passport,

      // Where to redirect the user if LDAP login fails, or they
      // have an account but it is not associated with your site.
      // Sending them to your login page is a good choice. You might
      // override it with a suitable error message in this case.
      failureRedirect: '/login?query=ldapFailure=1'
    },
    // ... other modules ...
  }
```

Note: you may want to use `data/local.js` to merge different settings on your production server, so you can continue to test LDAP login in development as well. That looks like this:

```javascript
// In data/local.js
module.exports = {
  // Other settings, then...
  modules: {
    'apostrophe-ldap-login': {
      url: 'ldap://ldap.production.site.com',
      baseUrl: 'http://my.production.site.com'
    }
  }
};
```

## Usage

To change authentication to LDAP, just copy `loginBase.html` to `views/global` and change `/login` to `/apos-ldap-login`.

That's all there is to it!
