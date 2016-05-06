import Ember from 'ember';

const OpenGraph = Ember.Object.extend({
	description: null,
	domain:null,
	exists: false,
	id: null,
	imageHeight: null,
	imageUrl: null,
	imageWidth: null,
	siteId: null,
	siteName: null,
	title: null,
	type: null,
	url: null,
});

export default OpenGraph;
