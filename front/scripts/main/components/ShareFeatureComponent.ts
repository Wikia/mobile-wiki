'use strict';

App.ShareFeatureComponent = Em.Component.extend({
	tagName: 'div',
	classNames: ['share-feature'],
	didInsertElement: function () {
		var headroom = new Headroom(this.get('element'), {
			classes: {
				initial: 'pinned',
				pinned: 'pinned',
				unpinned: 'un-pinned'
			},
			offset: 0
		});

		headroom.init();
	},
	the_title: "To Be Worked On",
	the_permalink: "http://to.be.worked.on"
});
