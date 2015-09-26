#!/usr/bin/env node

var cli = require("./modules/cli");
cli.when('-h, --help', 'Output usage information', cli.help)
   .when('-v, --version', 'OUtput version number', cli.version)
   .when('-m, --module', 'Get details of locally installed modules', function (pkgName) {
      if(arguments.length != 1) return cli.throw("You need to specify the name of only one global package");
      getFilesPaths(getPath(process.cwd(), pkgName), function (err, pathsToFiles) {
        if(err) return this.throw(err.message); var generator = require("./modules/generator");
        generator.generate(pathsToFiles, function (err) {
          if(err) return this.throw(err);
          // @todo : call launcher here
        })
      }.bind(cli));
   }).when('-g, --global', 'Get details of globally installed modules', function (pkgName) {
      if(arguments.length != 1) return cli.throw("You need to specify the name of only one global package");
      var globals = require('./modules/globals');
      globals.get(function (err, globalPath) {
        if(err) return this.throw(err);
        getFilesPaths(getPath(globalPath, pkgName), function (err, pathsToFiles) {
          if(err) return this.throw(err.message); var generator = require("./modules/generator");
          generator.generate(pathsToFiles, function (err) {
            if(err) return this.throw(err);
            // @todo : call launcher here
          })
        }.bind(cli));
      }.bind(cli));
   }).default('detail [options] [dir] [pkgName]', 'Launch details and markdown viewer of given project/package', function (dir, pkgName) {
      dir = dir || process.cwd();
      getFilesPaths(getPath(dir, pkgName), function (err, pathsToFiles) {
        if(err) return this.throw(err.message);
        var generator = require("./modules/generator");
        generator.generate(pathsToFiles, function (err) {
          if(err) return this.throw(err);
          // @todo :call launcher here
        })
      }.bind(cli));
   }).start(process.argv);

function getFilesPaths (dir, callback) {
  var path        = require('path'),
      fs          = require('fs'),
      error       = new TypeError("This directory doesn't contain both README.md and package.json"),
      filesExist  = true,
      filesPaths  = {
        'README.md': path.join(dir, 'README.md'),
        'package.json': path.join(dir, 'package.json')
      };
  
  // @todo : sometimes the readme file can be named ReadMe.md !!
  fs.exists(filesPaths['README.md'], function (readmeExists) {
    if (!readmeExists) return callback(error);
    fs.exists(filesPaths['package.json'], function (packageFileExists) {
      callback(packageFileExists ? null : error, packageFileExists ? filesPaths : null);
    });
  });
}

function getPath (dir, pkgName) {
  var path = require('path')
  return pkgName ? path.join(dir || '', 'node_modules', pkgName) : dir;
}