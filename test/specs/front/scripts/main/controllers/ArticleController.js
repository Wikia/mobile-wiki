moduleFor('controller:article', 'Article Controller', {
	needs: ['controller:application'],
	setup: function () {
		M.prop('firstPage', false);
	}
});

test('action updateHeaders correctly sets sections', function () {
	expect(2);
	var ctrl = this.subject(),
		obj = {
			foo: 'bar'
		};

	// set generic object as model
	ctrl.set('model', Ember.Object.create({
		// this will trigger a route change
		title: 'Example_title',
		wiki: 'test'
	}));

	// check initial state cleanliness
	equal(ctrl.get('model').get('sections'), undefined);

	ctrl.send('updateHeaders', obj);

	equal(ctrl.get('model').get('sections'), obj);
});
