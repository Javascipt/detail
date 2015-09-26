var marked = require('marked');
var ejs = require("ejs");

module.exports = (function (marked) {
  function generateReadme (markdown) {
    return marked(markdown)
  }
  function generateDetails (data) {
    data.author = (data.author && (data.author.name || data.author)) || '';
    return {
      'name': data.name,
      'global': data.preferGlobal,
      'description': data.description || '',
      'author': (data.author.replace( /\<(.*?)\>/g, '').replace( /\[(.*?)\]/g, '') || ''),
      'email': ((data.author.match( /\<(.*?)\>/g, '') || [''])[0]).replace('<','').replace('>',''),
      'website': ((data.author.match( /\((.*?)\)/g, '') || [''])[0]).replace('(','').replace(')',''),
      'repo': (data.repository && data.repository.url && data.repository.url.split('+').pop() || ''),
      'dependencies': (data.dependencies || {}),
      'tags': (data.keywords || []),
      'version': data.version,
      'license': (data.license || '')
    };
  }
  function generateMainPage (data, callback) {
    var path            = require("path"),
        pathToTemplate  = path.resolve(__dirname, '..', 'templates', require("../config.json").template, 'template.ejs'),
        pathToMainPage  = path.resolve(__dirname, '..', 'templates', require("../config.json").template, 'index.html'),
        fs              = require('fs');
    fs.readFile(pathToTemplate, function (err, template) {
      if(err) return callback(err);
      fs.writeFile(pathToMainPage, ejs.render(template.toString(), data), callback);
    });
  }
  return {
    generate: function (filesPaths, callback) {
      var path = require("path"),
          fs = require('fs');
      fs.readFile(filesPaths['README.md'], function (err, markdown) {
        if(err) return callback(err);
        var pkgJson = require(path.resolve(filesPaths['package.json'])),
            data    = generateDetails(pkgJson);
        data.readme = generateReadme(markdown.toString());
        data.bug    = pkgJson.bugs && pkgJson.bugs.url;
        generateMainPage(data, callback);
      });
    }
  }
}) (marked)