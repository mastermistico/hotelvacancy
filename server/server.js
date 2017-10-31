'use strict';

var loopback = require('loopback');

var boot = require('loopback-boot');


var app = module.exports = loopback();

 
//save log from method HTTP
app.middleware('initial', function logResponse(req, res, next) {
  // install a listener for when the response is finished
  var log = require('debug')('http')
  , http = require('http')

  res.on('finish', function() {
    // the request was handled, print the log entry
    log('userid: ' + req.accessToken.userId + 'req.method' + ' ' + req.url)
  });

  // resume the routing pipeline,
  // let other middleware to actually handle the request
  next();
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
