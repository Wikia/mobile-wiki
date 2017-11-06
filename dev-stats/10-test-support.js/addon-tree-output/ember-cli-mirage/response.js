define('ember-cli-mirage/response', ['exports'], function (exports) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Response = (function () {
    function Response(code) {
      var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      _classCallCheck(this, Response);

      this.code = code;
      this.headers = headers;
      this.data = data;
    }

    _createClass(Response, [{
      key: 'toRackResponse',
      value: function toRackResponse() {
        var headers = this.headers;

        if (!headers.hasOwnProperty('Content-Type')) {
          headers['Content-Type'] = 'application/json';
        }

        return [this.code, this.headers, this.data];
      }
    }]);

    return Response;
  })();

  exports['default'] = Response;
});