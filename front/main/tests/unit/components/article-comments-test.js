import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('article-comments', 'Unit | Component | article comments', {
	unit: true
});

test('page is set correctly within boundaries and buttons are displayed correctly', function (assert) {
	assert.expect(18);
	var component = this.subject({
		scrollToTop: function () {}
	});

	Ember.run(function () {
		component.setProperties({
			model: {
				pagesCount: 3
			},
			page: 2
		});
	});

	assert.equal(component.get('page'), 2);
	assert.equal(component.get('nextButtonShown'), true);
	assert.equal(component.get('prevButtonShown'), true);

	Ember.run(function() {
		component.send('nextPage');
	});
	assert.equal(component.get('page'), 3);
	assert.equal(component.get('nextButtonShown'), false);
	assert.equal(component.get('prevButtonShown'), true);

	Ember.run(function() {
		component.send('nextPage');
	});

	assert.equal(component.get('page'), 3);
	assert.equal(component.get('nextButtonShown'), false);
	assert.equal(component.get('prevButtonShown'), true);

	Ember.run(function() {
		component.send('prevPage');
	});
	assert.equal(component.get('page'), 2);
	assert.equal(component.get('nextButtonShown'), true);
	assert.equal(component.get('prevButtonShown'), true);

	Ember.run(function() {
		component.send('prevPage');
	});
	assert.equal(component.get('page'), 1);
	assert.equal(component.get('nextButtonShown'), true);
	assert.equal(component.get('prevButtonShown'), false);

	Ember.run(function() {
		component.send('prevPage');
	});
	assert.equal(component.get('page'), 1);
	assert.equal(component.get('nextButtonShown'), true);
	assert.equal(component.get('prevButtonShown'), false);
});
