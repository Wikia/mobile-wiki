import {run} from '@ember/runloop';
import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Component | loading spinner', function (hooks) {
	setupTest(hooks);

	test('should be hidden by default', function (assert) {
		run(() => {
			const componentMock = this.owner.factoryFor('component:wds-spinner').create();

			assert.equal(componentMock.get('isVisible'), false);
		});
	});

	test('should be visible if loading param is truthy', function (assert) {
		run(() => {
			const componentMock = this.owner.factoryFor('component:wds-spinner').create();

			componentMock.set('active', true);
			assert.equal(componentMock.get('isVisible'), true);
		});
	});

	test('should be hidden if loading param is falsy', function (assert) {
		run(() => {
			const componentMock = this.owner.factoryFor('component:wds-spinner').create();

			componentMock.set('active', false);
			assert.equal(componentMock.get('isVisible'), false);
		});
	});
});
