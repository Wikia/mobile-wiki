import Ember from 'ember';

import OpenGraph from '../models/discussion/domain/open-graph';

export default Ember.Component.extend({
	classNames: ['discussion-standalone-editor'],

	currentUser: Ember.inject.service(),

	labelMessageKey: 'TODO',
	placeholderMessageKey: 'TODO',
	submitMessageKey: 'TODO',

	content: '',
	openGraph: OpenGraph.create({
		description: 'Some description',
		domain: 'glee.wikia.com',
		exists: true,
		id: 2702253634848394020,
		imageHeight: 348,
		imageUrl: 'https://i.ytimg.com/vi/ybQ__WdAqvE/hqdefault.jpg',
		imageWidth: 464,
		siteId: 26337,
		siteName: '@Wikia',
		title: 'Glee TV Show Wiki',
		type: 'website',
		url: 'http://glee.wikia.com/wiki/Glee_TV_Show_Wiki',
	}),

	submitDisabled: false,
	showSuccess: false,
	isLoading: false,
	showsOpenGraphCard: true,
	isOpenGraphLoading: false,

	actions: {
		close() {

		},
		submit() {

		},
		removeOpenGraph() {

		},
		handleKeyPress() {

		}
	}
});
