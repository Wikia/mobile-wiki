import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('article-comment', 'Unit | Component | article comment', {
	unit: true,
	needs: [
		'service:i18n',
		'service:wiki-variables'
	]
});

test('users is correctly fetched', function (assert) {
	const component = this.subject();

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
