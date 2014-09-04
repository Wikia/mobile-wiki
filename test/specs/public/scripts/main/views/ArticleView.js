moduleFor('view:article', 'Article View`', {
	setup: function () {
		this.view = this.subject();
		App.set('hash', 'foo');
	},
	teardown: function () {
	}
});

test('jumpToAnchor method exists', function () {
	expect(1);
	ok(this.view.jumpToAnchor, 'jumpToAnchor method exists');
});

test('jumpToAnchor sets document hash and sets App.hash', function () {
	var self = this;
	expect(3);
	equal(App.get('hash'), 'foo');
	Ember.run(function () {
		self.view.jumpToAnchor();
	});
	equal(window.location.hash, '#foo');
	equal(App.get('hash'), null);
});

