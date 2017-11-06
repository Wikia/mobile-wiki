define("ember-cli-mirage/faker", ["exports"], function (exports) {
  var list = {
    random: function random() {
      var items = arguments.length > 0 ? arguments : [];

      return function () {
        return faker.random.arrayElement(items);
      };
    },

    cycle: function cycle() {
      var items = arguments.length > 0 ? arguments : [];

      return function (i) {
        return items[i % items.length];
      };
    }
  };

  faker.list = list;

  faker.random.number.range = function (min, max) {
    return function () /* i */{
      return Math.random() * (max - min) + min;
    };
  };

  exports["default"] = faker;
});