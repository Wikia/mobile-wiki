'use strict';

App.WikiaFooterView = Ember.View.extend({
	classNames: ['wikia-footer'],
	tagName: 'footer',
	templateName: 'components/wikia-footer',
	context: {
		links: [
			{
				route: 'wiki.article',
				context: 'about',
				name: 'About'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'Community Central'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'Advertise'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'Privacy Policy'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'Terms of use'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'API'
			}
		]
	}
});
