define('lodash/unescape', ['exports', 'lodash/toString', 'lodash/_unescapeHtmlChar'], function (exports, _toString, _unescapeHtmlChar) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    /** Used to match HTML entities and HTML characters. */
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
        reHasEscapedHtml = RegExp(reEscapedHtml.source);

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
        string = (0, _toString.default)(string);
        return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, _unescapeHtmlChar.default) : string;
    }

    exports.default = unescape;
});