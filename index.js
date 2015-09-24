#!/usr/bin/env node

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