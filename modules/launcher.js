var os = require('os');
var exec = require('child_process').exec;
var freeport = require("freeport");
var express = require("express");
var app = express();

module.exports = (function () {
  
  function open(url, callback) {
    switch(os.platform()) {
      case 'darwin':
        executeCommand('open ' + url, callback);
        break;
      case 'linux':
        executeCommand('xdg-open ' + url, callback);
        break;
      case 'win32':
        executeCommand('start ' + url, callback);
        break;
    }
  }
  
  var executeCommand = function (cmd, callback) {
    exec(cmd, callback);
  }
  
  return {
    launch : function (callback) {
      var path = require("path");
      var pathToMainPage = path.resolve(__dirname, '..', 'templates', require("../config.json").template);
      freeport(function (err, port) {
        if(err) return callback(err);
        app.use('/', express.static(pathToMainPage))
           .get('/stop', function (req, res) {
             process.exit(0);
           }).listen(port);
        open("http://localhost:" + port, callback);
      });
    }
  }
})()