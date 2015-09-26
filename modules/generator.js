var marked = require('marked');

module.exports = (function (marked) {
  function generateReadme (markdown) {
    return marked(markdown)
  }
  function generateDetails (data) {
    if(data.author && data.author.name) {
      data.author = data.author.name;
    }
    var dependenciesCallback = function (item, index, array) { 
      return '<a href="http://npmjs.org/package/' + item + '" target="_blank">'
           + '<span class="btn label label-success">' + item + ' ' + data.dependencies[item] + '</span></a>';
    };
    // @todo : use a template engine instead
	var html  = '<div class="panel panel-default">'
              + '  <!-- Default panel contents -->'
              + '  <div class="panel-heading">Project Details</div>'
              + '  <div class="panel-body">'
              + '    <table class="table table-stripped table-bordered">'
              + '      <tr>'
              + '         <td> Package name </td>'
              + '         <td> '+ data.name + ( data.preferGlobal ? '  <span class="btn label label-default"> Global </span>':'') + '</td>'
              + '      </tr>'
              + '      <tr> <td> Description </td><td> ' + (data.description || '') + ' </td> </tr>'
              + '      <tr> <td> Author </td> <td>' + (data.author.replace( /\<(.*?)\>/g, '').replace( /\[(.*?)\]/g, '') || '') + '</td> </tr>'
              + '      <tr> <td> Email </td> <td>' + ((data.author.match( /\<(.*?)\>/g, '') || [''])[0]).replace('<','').replace('>','') + '</td> </tr>'
              + '      <tr> <td> Website </td> <td> ' + ((data.author.match( /\[(.*?)\]/g, '') || [''])[0]) + '</td> </tr>'
              + '      <tr> <td> Repository </td><td>' + (data.repository && data.repository.url && data.repository.url.split('+').pop() || '') + '</td></tr>'
              + '    </table>'
              + '  </div>'
              + '  <!-- List group -->'
              + '  <ul class="list-group">'
              + '    <li class="list-group-item">'
              + '      <b>Dependencies : </b>' + (data.dependencies ? Object.keys(data.dependencies).map(dependenciesCallback).join(' ') : '')
              + '    </li>'
              + '    <li class="list-group-item">'
              + '      <b>Tags : </b>' + (data.keywords || []).map(function(tag) { return '<span class="label label-info">' + tag + '</span>' }).join(' ')
              + '    </li>'
              + '    <li class="list-group-item">'
              + '      <b>Version : </b> <span class="label label-primary">' + data.version + '</span>'
              + '    </li>'
              + '    <li class="list-group-item">'
              + '      <b>Liscence : </b>'
              + '      <span class="label label-warning">' + (data.license || '') + '</span>'
              + '    </li>'
              + '  </ul>'
              + '</div>';
    
    return html;
  }
  function generateBugReporter (data) {
    return (data.bugs && data.bugs.url) ? ('<li><a class="menu-btn" target="_blank" href="' + data.bugs.url + '">Report bug</a></li>') : '';
  }
  function generateMainPage (html, callback) {
    var path = require("path");
    var pathToTemplate = path.resolve(__dirname, '..', 'templates', require("../config.json").template, 'template.html');
    var pathToMainPage = path.resolve(__dirname, '..', 'templates', require("../config.json").template, 'index.html');
    var fs = require('fs');
    fs.readFile(pathToTemplate, function (err, template) {
      if(err) return callback(err);
      var htmlCode = template.toString()
          .replace("{{ @readme }}", html["README.md"])
          .replace("{{ @details }}", html["details"])
          .replace("{{ @report }}", html["bugReport"]);
      fs.writeFile(pathToMainPage, htmlCode, callback);
    });
  }
  return {
    generate: function (filesPaths, callback) {
      var path = require("path");
      var fs = require('fs');
      var html = {};
      fs.readFile(filesPaths['README.md'], function (err, markdown) {
        if(err) return callback(err);
        html['README.md'] = generateReadme(markdown.toString());
        html['details'] = generateDetails(require(path.resolve(filesPaths['package.json'])));
        html['bugReport'] = generateBugReporter(require(path.resolve(filesPaths['package.json'])));
        generateMainPage(html, callback);
      });
    }
  }
}) (marked)