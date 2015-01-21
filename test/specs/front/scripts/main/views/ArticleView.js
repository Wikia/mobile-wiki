moduleFor('view:article', 'Article View', {
	needs: ['controller:article', 'controller:application'],
	setup: function () {
		this.view = this.subject();
	},
	teardown: function () {
	}
});

//TODO: write some tests
