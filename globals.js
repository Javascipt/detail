var exec = require('child_process').exec;

module.exports = {
 get : function (callback) {
    exec("npm -g root", function(error, stdout) {
        callback(error, stdout.replace('\n',''));
    });
  }
}