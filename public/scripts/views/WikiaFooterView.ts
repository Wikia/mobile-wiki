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
				name: 'about'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'community-central'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'advertise'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'privacy-policy'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'terms-of-use'
			},
			{
				route: 'wiki',
				context: 'about',
				name: 'api'
			}
		]
	}
});
