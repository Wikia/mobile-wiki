import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Component | article comment', function (hooks) {
	setupTest(hooks);

	test('users is correctly fetched', function (assert) {
		const component = this.owner.factoryFor('component:article-comment').create();

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
