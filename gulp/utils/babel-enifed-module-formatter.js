'use strict';

module.exports = function (babel) {
	var t = babel.types;

	return new babel.Plugin('babel-enifed-module-formatter', {
		visitor: {
			CallExpression: function (node) {
				console.log('####', t.isIdentifier);
				if (t.isIdentifier(node.callee, {name: 'define'})) {
					node.callee = t.identifier('enifed');
				}
			},
			BlockStatement: function () {
				console.log('####', this.skip);
				this.skip();
			}
		}
	});
};