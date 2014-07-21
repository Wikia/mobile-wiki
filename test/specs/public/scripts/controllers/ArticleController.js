moduleFor('controller:article', 'Article Controller', {
	needs: ['controller:application'],
	setup: function () {
		// TODO: need to consolidate mocking for Wikia obj
		Wikia._state = {};
		Wikia._state.firstPage = false;
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

test('displayUsers is the first five elements of users', function () {
	var ctrl = this.subject(),
		tests = [
			[],
			['one', 'two', 'three'],
			['one', 'two', 'three', 'four', 'five'],
			['one', 'two', 'three', 'four', 'five', 'six']
		],
		self = this,
		displayUsers;

	ctrl.set('model', Ember.Object.create());

	expect(tests.length * 2);

	tests.forEach(function (test, i, arr) {
		ctrl.set('model.users', test);
		displayUsers = ctrl.get('displayUsers');
		// checks if it exists
		ok(displayUsers);
		equal(displayUsers.length, Math.min(test.length, 5));
	});
});
