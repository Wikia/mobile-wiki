import {run} from '@ember/runloop';
import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Component | article comments', function (hooks) {
	setupTest(hooks);

	test('page is set correctly within boundaries and buttons are displayed correctly', function (assert) {
		const component = this.owner.factoryFor('component:article-comments').create();

		assert.expect(18);

		run(() => {
			component.setProperties({
				model: {
					pagesCount: 3
				},
				page: 2,

				scrollToTop() {
				}
			});
		});

		assert.equal(component.get('page'), 2);
		assert.equal(component.get('nextButtonShown'), true);
		assert.equal(component.get('prevButtonShown'), true);

		run(() => {
			component.send('nextPage');
		});

		assert.equal(component.get('page'), 3);
		assert.equal(component.get('nextButtonShown'), false);
		assert.equal(component.get('prevButtonShown'), true);

		run(() => {
			component.send('nextPage');
		});

		assert.equal(component.get('page'), 3);
		assert.equal(component.get('nextButtonShown'), false);
		assert.equal(component.get('prevButtonShown'), true);

		run(() => {
			component.send('prevPage');
		});

		assert.equal(component.get('page'), 2);
		assert.equal(component.get('nextButtonShown'), true);
		assert.equal(component.get('prevButtonShown'), true);

		run(() => {
			component.send('prevPage');
		});

		assert.equal(component.get('page'), 1);
		assert.equal(component.get('nextButtonShown'), true);
		assert.equal(component.get('prevButtonShown'), false);

		run(() => {
			component.send('prevPage');
		});

		assert.equal(component.get('page'), 1);
		assert.equal(component.get('nextButtonShown'), true);
		assert.equal(component.get('prevButtonShown'), false);
	});
});
