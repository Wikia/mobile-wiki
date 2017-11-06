define('mobile-wiki/tests/unit/components/article-comments-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('article-comments', 'Unit | Component | article comments', {
		unit: true,
		needs: ['service:wiki-variables']
	});

	(0, _emberQunit.test)('page is set correctly within boundaries and buttons are displayed correctly', function (assert) {
		var component = this.subject();

		assert.expect(18);

		Ember.run(function () {
			component.setProperties({
				model: {
					pagesCount: 3
				},
				page: 2,

				scrollToTop: function scrollToTop() {}
			});
		});

		assert.equal(component.get('page'), 2);
		assert.equal(component.get('nextButtonShown'), true);
		assert.equal(component.get('prevButtonShown'), true);

		Ember.run(function () {
			component.send('nextPage');
		});

		assert.equal(component.get('page'), 3);
		assert.equal(component.get('nextButtonShown'), false);
		assert.equal(component.get('prevButtonShown'), true);

		Ember.run(function () {
			component.send('nextPage');
		});

		assert.equal(component.get('page'), 3);
		assert.equal(component.get('nextButtonShown'), false);
		assert.equal(component.get('prevButtonShown'), true);

		Ember.run(function () {
			component.send('prevPage');
		});

		assert.equal(component.get('page'), 2);
		assert.equal(component.get('nextButtonShown'), true);
		assert.equal(component.get('prevButtonShown'), true);

		Ember.run(function () {
			component.send('prevPage');
		});

		assert.equal(component.get('page'), 1);
		assert.equal(component.get('nextButtonShown'), true);
		assert.equal(component.get('prevButtonShown'), false);

		Ember.run(function () {
			component.send('prevPage');
		});

		assert.equal(component.get('page'), 1);
		assert.equal(component.get('nextButtonShown'), true);
		assert.equal(component.get('prevButtonShown'), false);
	});
});