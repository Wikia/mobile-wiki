moduleForComponent('article-comments');

test('page is set correctly within boundaries and buttons are displayed correctly', function () {
	expect(18);
	var component = this.subject({
		scrollToTop: function () {}
	});

	Ember.run(function () {
		component.setProperties({
			model: {
				pagesCount: 3
			},
			page: 2
		});
	});

	equal(component.get('page'), 2);
	equal(component.get('nextButtonShown'), true);
	equal(component.get('prevButtonShown'), true);

	Ember.run(function() {
		component.send('nextPage');
	});
	equal(component.get('page'), 3);
	equal(component.get('nextButtonShown'), false);
	equal(component.get('prevButtonShown'), true);

	Ember.run(function() {
		component.send('nextPage');
	});

	equal(component.get('page'), 3);
	equal(component.get('nextButtonShown'), false);
	equal(component.get('prevButtonShown'), true);

	Ember.run(function() {
		component.send('prevPage');
	});
	equal(component.get('page'), 2);
	equal(component.get('nextButtonShown'), true);
	equal(component.get('prevButtonShown'), true);

	Ember.run(function() {
		component.send('prevPage');
	});
	equal(component.get('page'), 1);
	equal(component.get('nextButtonShown'), true);
	equal(component.get('prevButtonShown'), false);

	Ember.run(function() {
		component.send('prevPage');
	});
	equal(component.get('page'), 1);
	equal(component.get('nextButtonShown'), true);
	equal(component.get('prevButtonShown'), false);
});
