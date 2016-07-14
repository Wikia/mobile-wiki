'use strict';

var fs = require('fs');

var walk = function(path) {
  var tree = {};
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
        tree[file] = require(newPath);
    } else if (stat.isDirectory()) {
      tree[file] = walk(newPath);
    }
  });

  return tree;
};

module.exports = function loadTree(baseDirectory) {
  return walk(process.cwd() + '/' + baseDirectory);
};
