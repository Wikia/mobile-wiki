define('ember-cli-mirage/assert', ['exports'], function (exports) {
  exports['default'] = assert;
  exports.MirageError = MirageError;
  /* eslint no-console: 0 */
  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function assert(bool, text) {
    if (typeof bool === 'string' && !text) {
      throw new MirageError(bool);
    }

    if (!bool) {
      throw new MirageError(text.replace(/^ +/gm, '') || 'Assertion failed');
    }
  }

  /**
    @public
    Copied from ember-metal/error
  */

  function MirageError() {
    var tmp = Error.apply(this, arguments);

    for (var idx = 0; idx < errorProps.length; idx++) {
      var prop = errorProps[idx];

      if (['description', 'message', 'stack'].indexOf(prop) > -1) {
        this[prop] = 'Mirage: ' + tmp[prop];
      } else {
        this[prop] = tmp[prop];
      }
    }

    console.error(this.message);
    console.error(this);
  }

  MirageError.prototype = Object.create(Error.prototype);
});