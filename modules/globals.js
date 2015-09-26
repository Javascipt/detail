var exec = require('child_process').exec,
    path = require('path');

module.exports.get = function (callback) {
  exec("npm -g root", function(error, stdout) {
      callback(error, path.resolve(stdout.replace('\n',''), '..'));
  });
}