define('mobile-wiki/tests/unit/components/article-comment-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('article-comment', 'Unit | Component | article comment', {
		unit: true,
		needs: ['service:i18n', 'service:wiki-variables']
	});

	(0, _emberQunit.test)('users is correctly fetched', function (assert) {
		var component = this.subject();

		assert.expect(2);

		component.setProperties({
			users: {
				test: 'test'
			},
			comment: {
				userName: 'test'
			}
		});

		assert.equal(component.get('user'), 'test');

		component.setProperties({
			users: {
				test: 'test'
			},
			comment: {
				userName: 'nope'
			}
		});

		assert.deepEqual(component.get('user'), {});
	});
});