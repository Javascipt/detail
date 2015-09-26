require("colors");

module.exports = (function () {
  var cli = [];
  var defaultAction = null;
  function check (args, opts) {
    if(!opts.length) {
      if(defaultAction) {
        try {
          return defaultAction.callback.apply(this, args);
        } catch (ex) {
          return error(ex.message);
        }
      } else {
        return error("No default callback specified");
      }
    } else if(opts.length>1) {
      return error("You need to pass only one option");
    }
    
    if(args.length > 2) {
      return error("Only two arguments needed");
    }
    
    var callback = cli.reduce(function (callback, item) {
      if(item.options.indexOf(opts[0])>-1) {
        callback = item.callback;
      }
      
      return callback;
    }, null);
    
    if(callback) {
      try {
        callback.apply(this, args);
      } catch (ex) {
        return error(ex.message);
      }
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
        options: opt.split(' ').filter(function (item) { return !!item; }),
        description: description,
        callback: callback
      });
      
      return this;
    },
    help: function () {
      var columnify = require('columnify')
      var data = [{' ':'', options : '', description : ''}].concat(cli.map(function (item) {
        return {
          ' ' : '',
          options : item.options.join(' '),
          description : item.description
        }
      }));
      console.log('\n    Usage: ' + defaultAction.usage + '  \n\n\n', columnify(data,  {
        minWidth: 30,
        config: {
          description: {maxWidth: 50},
          ' ':{maxWidth : 2}
        }
      }));
      return this;
    },
    version: function () {
      console.log(require('../package.json').version);
      
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
    },
    throw: error
  }
})();