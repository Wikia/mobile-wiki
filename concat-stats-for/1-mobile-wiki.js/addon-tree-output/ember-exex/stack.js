define("ember-exex/stack", ["exports"], function (exports) {
  var DefaulStackTraceParser = {
    parse: function parse(error, stack) {
      stack = stack || '';
      stack = stack.split("\n");
      stack.shift();

      stack = stack.map(function (source) {
        source = source.replace(/\r?\n|\r/g, " ");
        return {
          source: source
        };
      });

      return stack;
    }
  };

  exports.DefaulStackTraceParser = DefaulStackTraceParser;
  var DefaultStackTraceRenderer = {

    renderPrevious: function renderPrevious(error) {
      if (error) {
        var stack = undefined;
        if (error.exex) {
          stack = error.stack;
        } else {
          var _frames = Platform.parser.parse(error, error.stack);
          stack = this.render(error, _frames);
        }

        return "\n\nPrevious: " + stack;
      } else {
        return '';
      }
    },

    render: function render(error, frames, stackRemoval) {
      frames = frames.slice();

      // slice first frames, depends on stack removal
      if (stackRemoval && typeof frames.shift === 'function') {
        for (var i = 0; i < stackRemoval; i++) {
          frames.shift();
        }
      }

      var stack = [];

      stack.push((error.name || String(error)) + (error.message ? ': ' + error.message : ''));
      stack = stack.concat(typeof frames.map === 'function' ? frames.map(function (f) {
        return f.source;
      }) : ['  at ?']);
      stack = stack.join("\n");

      stack = stack + this.renderPrevious(error.previous);

      return stack;
    }

  };

  exports.DefaultStackTraceRenderer = DefaultStackTraceRenderer;
  var Platform = {
    parser: DefaulStackTraceParser,
    renderer: DefaultStackTraceRenderer
  };

  exports.Platform = Platform;
  var initializeStack = function initializeStack(error) {
    var stack = new Error(error.message).stack;
    if (!stack) {
      try {
        throw new Error(error.message);
      } catch (e) {
        stack = e.stack;
      }
    }
    return stack;
  };

  exports.initializeStack = initializeStack;
  var createStackProperty = function createStackProperty(error, stackRemoval) {

    stackRemoval = typeof stackRemoval === 'undefined' ? 4 : stackRemoval;
    var parsed,
        stack = initializeStack(error);

    var parse = function parse() {
      if (!parsed) {
        try {
          parsed = Platform.parser.parse(error, stack);
        } catch (e) {
          console.error(e.stack); // eslint-disable-line no-console
          // pass
        }
      }
      return parsed;
    };

    var render = function render() {
      parse();

      if (!parsed) {
        return stack;
      }

      return Platform.renderer.render(error, parsed, stackRemoval);
    };

    Object.defineProperty(error, "frames", {
      get: function get() {
        return parse();
      },
      set: function set() {
        // pass
      }
    });

    Object.defineProperty(error, "stack", {
      get: function get() {
        return render();
      },
      set: function set(astack) {
        parsed = null;
        stack = astack;
      }
    });
  };
  exports.createStackProperty = createStackProperty;
});