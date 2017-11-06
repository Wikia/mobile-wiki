define("ember-getowner-polyfill/index", ["exports", "ember"], function (exports, _ember) {

  _ember["default"].deprecate("ember-getowner-polyfill is now a true polyfill. Use Ember.getOwner directly instead of importing from ember-getowner-polyfill", false, {
    id: "ember-getowner-polyfill.import",
    until: '2.0.0'
  });

  exports["default"] = _ember["default"].getOwner;
});