import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Component | lightbox wrapper', (hooks) => {
	setupTest(hooks);

	test('toggleFooter method toggles footerExpanded', function (assert) {
		const componentMock = this.owner.factoryFor('component:lightbox-wrapper').create();

		assert.equal(componentMock.get('footerExpanded'), false);

		componentMock.send('toggleFooter');
		assert.equal(componentMock.get('footerExpanded'), true);

		componentMock.send('toggleFooter');
		assert.equal(componentMock.get('footerExpanded'), false);
	});

	test('toggleUI method toggles footerHidden and headerHidden', function (assert) {
		const componentMock = this.owner.factoryFor('component:lightbox-wrapper').create();

		assert.equal(componentMock.get('footerHidden'), false);
		assert.equal(componentMock.get('headerHidden'), false);

		componentMock.send('toggleUI');
		assert.equal(componentMock.get('footerHidden'), true);
		assert.equal(componentMock.get('headerHidden'), true);

		componentMock.send('toggleUI');
		assert.equal(componentMock.get('footerHidden'), false);
		assert.equal(componentMock.get('headerHidden'), false);
	});
});
