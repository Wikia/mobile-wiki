import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('wikia-drawer', 'Integration | Component | wikia drawer', {
	integration: true
});

test('should close drawer when clicked outside search area', function (assert) {
	const elementOutsideSearchArea = '.wikia-search-wrapper';

	this.set('actions', {
		closeDrawer() {
			assert.ok(true);
		}
	});

	this.render(hbs`
		{{#wikia-drawer
			shouldBeVisible=true
			wikiaHomepage='http://www.wikia.com'
			closeDrawer=(action 'closeDrawer')
		}}
			{{wikia-search
				query='test'
			}}
		{{/wikia-drawer}}`
	);

	this.$(elementOutsideSearchArea).get(0).click();
	assert.expect(1);
});

test('should not close drawer when clicked inside the search area', function (assert) {
	const elementInsideSearchArea = '.side-search__input';

	this.set('actions', {
		closeDrawer() {
			assert.ok(true);
		}
	});

	this.render(hbs`
		{{#wikia-drawer
			shouldBeVisible=true
			wikiaHomepage='http://www.wikia.com'
			closeDrawer=(action 'closeDrawer')
		}}
			{{wikia-search
				query='test'
			}}
		{{/wikia-drawer}}`
	);

	this.$(elementInsideSearchArea).get(0).click();
	assert.expect(0);
});
