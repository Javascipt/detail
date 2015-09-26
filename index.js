#!/usr/bin/env node

var cli = require("./modules/cli");
var generator = require("./modules/generator");
var launcher = require("./modules/launcher");

cli.when('-h --help', 'Output usage information', cli.help)
   .when('-v --version', 'OUtput version number', cli.version)
   .when('-m --module <moduleName>', 'Get details of locally installed modules', function (pkgName) {
      if(arguments.length != 1) return cli.throw("You need to specify the name of only one global package");
      getFilesPaths(getPath(process.cwd(), pkgName), function (err, pathsToFiles) {
        if(err) return this.throw(err.message);
        generator.generate(pathsToFiles, function (err) {
          if(err) return this.throw(err);
          launcher.launch(function (err) {
            if(err) return this.throw(err);
          }.bind(cli));
        })
      }.bind(cli));
   }).when('-g --global <moduleName>', 'Get details of globally installed modules', function (pkgName) {
      if(arguments.length != 1) return cli.throw("You need to specify the name of only one global package");
      var globals = require('./modules/globals');
      globals.get(function (err, globalPath) {
        if(err) return this.throw(err);
        getFilesPaths(getPath(globalPath, pkgName), function (err, pathsToFiles) {
          if(err) return this.throw(err.message); 
          generator.generate(pathsToFiles, function (err) {
            if(err) return this.throw(err);
            launcher.launch(function (err) {
              if(err) return this.throw(err);
            }.bind(cli));
          })
        }.bind(cli));
      }.bind(cli));
   }).default('detail [dir] [moduleName]', 'Launch details and markdown viewer of given project/package', function (dir, pkgName) {
      dir = dir || process.cwd();
      getFilesPaths(getPath(dir, pkgName), function (err, pathsToFiles) {
        if(err) return this.throw(err.message);
        generator.generate(pathsToFiles, function (err) {
          if(err) return this.throw(err);
          launcher.launch(function (err) {
            if(err) return this.throw(err);
          }.bind(cli));
        })
      }.bind(cli));
   }).start(process.argv);

function getFilesPaths (dir, callback) {
  var path        = require('path'),
      fs          = require('fs'),
      error       = new TypeError("This directory doesn't contain both README.md and package.json"),
      filesExist  = true,
      filesPaths  = {},
      readmeName  = '';
  
  !['readme.md', 'README.md', 'ReadMe.md', 'Readme.md'].some(function (name) {
    return fs.existsSync(path.join(dir, readmeName = name));
  }) && callback(error);
    
  filesPaths  = {
    'README.md': path.join(dir, readmeName),
    'package.json': path.join(dir, 'package.json')
  };
    
  fs.exists(filesPaths['package.json'], function (packageFileExists) {
    callback(packageFileExists ? null : error, packageFileExists ? filesPaths : null);
  });
}

function getPath (dir, pkgName) {
  var path = require('path')
  return pkgName ? path.join(dir || '', 'node_modules', pkgName) : dir;
}