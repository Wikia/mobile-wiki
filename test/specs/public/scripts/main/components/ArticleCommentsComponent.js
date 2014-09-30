moduleForComponent('article-comments');

test('page is set correctly within boundries', function () {
	expect(6);
	var component = this.subject({
		scrollToTop: function () {}
	});

	component.setProperties({
		model: {
			pagesCount: 3
		},
		page: 2
	});

	equal(component.get('page'), 2);

	component.send('nextPage');
	equal(component.get('page'), 3);

	component.send('nextPage');
	equal(component.get('page'), 3);

	component.send('prevPage');
	equal(component.get('page'), 2);

	component.send('prevPage');
	equal(component.get('page'), 1);

	component.send('prevPage');
	equal(component.get('page'), 1);
});
