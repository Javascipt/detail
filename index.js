#!/usr/bin/env node

var cli = require("./cli");
cli.when('-g, --global', 'Get details of globally installed modules', function () {})
   .when('-h, --help', 'Output usage information', cli.help)
   .when('-v, --version', 'OUtput version number', cli.version)
   .default('detail [options] [dir] [pkgName]', 'Launch details and markdown viewer of given project/package', function () {})
   .start(process.argv);

function getFilesPaths (callback) {
  var path        = require('path'),
      fs          = require('fs'),
      dir         = process.cwd(),
      error       = new TypeError("This directory doesn't contain both README.md and package.json"),
      filesExist  = true,
      filesPaths  = {
        'README.md': path.join(dir, 'README.md'),
        'package.json': path.join(dir, 'package.json')
      };
  
  fs.exists(filesPaths['README.md'], function (readmeExists) {
    if (!readmeExists) return callback(error);
    fs.exists(filesPaths['package.json'], function (packageFileExists) {
      callback(packageFileExists ? null : error, packageFileExists ? filesPaths : null);
    });
  });
}