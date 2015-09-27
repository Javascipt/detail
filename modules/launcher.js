var os        = require('os'),
    exec      = require('child_process').exec,
    freeport  = require("freeport"),
    express   = require("express"),
    app       = express();

module.exports = (function () {
  
  function browse(url, callback) {
    var osCmds = {
      'darwin' : 'open ',
      'linux' : 'xdg-open ',
      'win32' : 'start '
    }
    exec(osCmds[os.platform()] + url, callback);
  }
  
  return {
    launch : function (callback) {
      var path            = require("path"),
          pathToMainPage  = path.resolve(__dirname, '..', 'templates', require("../config.json").template);
      
      freeport(function (err, port) {
        if(err) return callback(err);
        app.use('/', express.static(pathToMainPage))
           .get('/stop', process.exit)
           .get('/running', function (req, res) {
             res.json({});
           }).listen(port);
        browse("http://localhost:" + port, callback);
      });
    }
  }
})()