define('ember-cli-mirage/utils/reference-sort', ['exports', 'lodash/uniq', 'lodash/flatten'], function (exports, _lodashUniq, _lodashFlatten) {
  exports['default'] = function (edges) {
    var nodes = (0, _lodashUniq['default'])((0, _lodashFlatten['default'])(edges));
    var cursor = nodes.length;
    var sorted = new Array(cursor);
    var visited = {};
    var i = cursor;

    var visit = function visit(node, i, predecessors) {

      if (predecessors.indexOf(node) >= 0) {
        throw new Error('Cyclic dependency in properties ' + JSON.stringify(predecessors));
      }

      if (visited[i]) {
        return;
      } else {
        visited[i] = true;
      }

      var outgoing = edges.filter(function (edge) {
        return edge && edge[0] === node;
      });
      i = outgoing.length;
      if (i) {
        var preds = predecessors.concat(node);
        do {
          var pair = outgoing[--i];
          var child = pair[1];
          if (child) {
            visit(child, nodes.indexOf(child), preds);
          }
        } while (i);
      }

      sorted[--cursor] = node;
    };

    while (i--) {
      if (!visited[i]) {
        visit(nodes[i], i, []);
      }
    }

    return sorted.reverse();
  };
});
// jscs:disable disallowVar, requireArrayDestructuring