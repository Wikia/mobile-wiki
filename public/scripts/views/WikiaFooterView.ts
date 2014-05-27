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
				name: 'footer.about'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'footer.community-central'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'footer.advertise'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'footer.privacy-policy'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'footer.terms-of-use'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'footer.api'
			}
		]
	}
});
