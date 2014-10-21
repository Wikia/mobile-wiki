moduleForComponent('article-comments');

test('page is set correctly within boundries', function () {
	expect(6);
	var component = this.subject({
		scrollToTop: function () {}
	});

	Ember.run(function() {
		component.setProperties({
			model: {
				pagesCount: 3
			},
			page: 2
		});
	});

	equal(component.get('page'), 2);

	Ember.run(function() {
		component.send('nextPage');
	});
	equal(component.get('page'), 3);

	Ember.run(function() {
		component.send('nextPage');
	});

	equal(component.get('page'), 3);

	Ember.run(function() {
		component.send('prevPage');
	});
	equal(component.get('page'), 2);

	Ember.run(function() {
		component.send('prevPage');
	});
	equal(component.get('page'), 1);

	Ember.run(function() {
		component.send('prevPage');
	});
	equal(component.get('page'), 1);
});
