/*jshint node:true*/
var stew = require('broccoli-stew');

module.exports = {
  name: 'remove',

  isDevelopingAddon: function() {
    return true;
  },

  postprocessTree: function(type, tree){
    console.log(type)
      tree = stew.log(tree, { output: 'tree', label: 'remove tree' });

      return stew.rm(tree,
        '**/components/rl-dropdown*.{js,hbs}'
      );
  }
};
