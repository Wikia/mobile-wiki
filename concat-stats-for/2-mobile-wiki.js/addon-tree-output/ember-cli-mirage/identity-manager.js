define("ember-cli-mirage/identity-manager", ["exports"], function (exports) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function isNumber(n) {
    return (+n).toString() === n.toString();
  }

  /**
   * IdentityManager for a DbCollection
   * @class
   * @constructor
   * @public
   */

  var IdentityManager = (function () {
    function IdentityManager() {
      _classCallCheck(this, IdentityManager);

      this._nextId = 1;
      this._ids = {};
    }

    /**
     * @method get
     * @private
     */

    _createClass(IdentityManager, [{
      key: "get",
      value: function get() {
        return this._nextId;
      }

      /**
       * @method set
       * @param {String|Number} n
       * @public
       */
    }, {
      key: "set",
      value: function set(n) {
        if (this._ids[n]) {
          throw new Error("Attempting to use the ID " + n + ", but it's already been used");
        }

        if (isNumber(n) && +n >= this._nextId) {
          this._nextId = +n + 1;
        }

        this._ids[n] = true;
      }

      /**
       * @method inc
       * @private
       */
    }, {
      key: "inc",
      value: function inc() {
        var nextValue = this.get() + 1;

        this._nextId = nextValue;

        return nextValue;
      }

      /**
       * @method fetch
       * @return {String} Unique identifier
       * @public
       */
    }, {
      key: "fetch",
      value: function fetch() {
        var id = this.get();

        this._ids[id] = true;

        this.inc();

        return id.toString();
      }

      /**
       * @method reset
       * @public
       */
    }, {
      key: "reset",
      value: function reset() {
        this._nextId = 1;
        this._ids = {};
      }
    }]);

    return IdentityManager;
  })();

  exports["default"] = IdentityManager;
});