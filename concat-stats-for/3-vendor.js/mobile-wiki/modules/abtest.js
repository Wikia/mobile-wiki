define('mobile-wiki/modules/abtest', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getGroup = getGroup;
  exports.inGroup = inGroup;
  /**
   * Get the users group for an experiment
   *
   * @param {String} experimentName
   * @returns {String|void}
   */
  function getGroup(experimentName) {
    var AbTest = window.Wikia && window.Wikia.AbTest;

    if (AbTest && typeof AbTest.getGroup === 'function') {
      return AbTest.getGroup(experimentName);
    }
  }

  /**
   * Check if a user is in a group for an experiment
   *
   * @param {String} experimentName
   * @param {String} groupName
   * @returns {Boolean}
   */
  function inGroup(experimentName, groupName) {
    var AbTest = window.Wikia && window.Wikia.AbTest;

    if (AbTest && typeof AbTest.inGroup === 'function') {
      return AbTest.inGroup(experimentName, groupName);
    } else {
      return false;
    }
  }
});