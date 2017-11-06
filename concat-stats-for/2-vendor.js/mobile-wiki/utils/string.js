define('mobile-wiki/utils/string', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.normalizeToUnderscore = normalizeToUnderscore;
  exports.normalizeToWhitespace = normalizeToWhitespace;
  exports.getLastUrlFromText = getLastUrlFromText;
  exports.escapeRegex = escapeRegex;
  /**
   * We need to support links like:
   * /wiki/Rachel Berry
   * /wiki/Rachel  Berry
   * /wiki/Rachel__Berry
   *
   * but we want them to be displayed normalized in URL bar
   */

  /**
   * @param {string} [title='']
   * @returns {string}
   */
  function normalizeToUnderscore() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return title.replace(/\s/g, '_').replace(/_+/g, '_');
  }

  /**
   * @param {string} [str='']
   * @returns {string}
   */
  function normalizeToWhitespace() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return str.replace(/_/g, ' ').replace(/\s+/g, ' ');
  }

  /**
   * Get last url from input text
   * @param {string} text
   * @returns {string}
   */
  function getLastUrlFromText(text) {
    var urls = void 0;

    urls = text.match(/(https?:\/\/[^\s]+)/ig);

    if (!urls) {
      return null;
    }

    return urls.pop();
  }

  /**
   * @param  {string} text
   * @return {string}
   */
  function escapeRegex(text) {
    return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
});