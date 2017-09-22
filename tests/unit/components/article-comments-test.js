import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('article-comments', 'Unit | Component | article comments', {
	unit: true,
	needs: [
		'service:wiki-variables'
	]
});

test('page is set correctly within boundaries and buttons are displayed correctly', function (assert) {
	const component = this.subject();

	assert.expect(18);

	Ember.run(() => {
		component.setProperties({
			model: {
				pagesCount: 3
			},
			page: 2,

			scrollToTop() {}
		});
	});

	assert.equal(component.get('page'), 2);
	assert.equal(component.get('nextButtonShown'), true);
	assert.equal(component.get('prevButtonShown'), true);

	Ember.run(() => {
		component.send('nextPage');
	});

	assert.equal(component.get('page'), 3);
	assert.equal(component.get('nextButtonShown'), false);
	assert.equal(component.get('prevButtonShown'), true);

	Ember.run(() => {
		component.send('nextPage');
	});

	assert.equal(component.get('page'), 3);
	assert.equal(component.get('nextButtonShown'), false);
	assert.equal(component.get('prevButtonShown'), true);

	Ember.run(() => {
		component.send('prevPage');
	});

	assert.equal(component.get('page'), 2);
	assert.equal(component.get('nextButtonShown'), true);
	assert.equal(component.get('prevButtonShown'), true);

	Ember.run(() => {
		component.send('prevPage');
	});

	assert.equal(component.get('page'), 1);
	assert.equal(component.get('nextButtonShown'), true);
	assert.equal(component.get('prevButtonShown'), false);

	Ember.run(() => {
		component.send('prevPage');
	});

	assert.equal(component.get('page'), 1);
	assert.equal(component.get('nextButtonShown'), true);
	assert.equal(component.get('prevButtonShown'), false);
});
