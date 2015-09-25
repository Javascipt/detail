require("colors");

module.exports = (function () {
  var cli = [];
  var defaultAction = null;
  function check (args, opts) {
    if(!opts.length) {
      if(defaultAction) {
        return defaultAction.callback.apply(this, args);
      } else {
        return error("No default callback specified");
      }
    } else if(opts.length>1) {
      return error("You need to pass only one option");
    }
    
    var callback = cli.reduce(function (callback, item) {
      if(item.options.indexOf(opts[0])>-1) {
        callback = item.callback;
      }
      
      return callback;
    }, null);
    
    if(callback) {
      callback.apply(this, args);
    } else {
      error("The option given is not valid");
    }
  }
  
  function error (message) {
    console.log(("error : " + message).red);
  }
  
  return {
    when : function (opt, description, callback) {
      cli.push({
        options: opt.split(',').map(function (item) { return item.trim(); }),
        description: description,
        callback: callback
      });
      
      return this;
    },
    help: function () {
      console.log("help");
      
      return this;
    },
    version: function () {
      console.log("version");
      
      return this;
    },
    default : function (usage, description, callback) {
      defaultAction = {
        usage: usage,
        description: description,
        callback: callback
      }
      
      return this;
    },
    start: function (argv) {
      var allArgs = argv.slice(2);
      var opts = [];
      var args = [];
      allArgs.forEach(function(arg) {
        ((arg.trim().indexOf('-')==0) ? opts : args ).push(arg.trim());
      });
      check(args, opts);
    }
  }
})();