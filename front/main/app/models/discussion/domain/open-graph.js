import Ember from 'ember';
import {extractDomainFromUrl} from '../../../utils/domain';

const OpenGraph = Ember.Object.extend({
	description: null,
	domain: null,
	imageHeight: null,
	imageUrl: null,
	imageWidth: null,
	siteName: null,
	title: null,
	type: null,
	url: null,
});

OpenGraph.reopenClass({
	/**
	 * @param {Object} openGraphData
	 *
	 * @returns {array}
	 */
	create(openGraphData) {
		let openGraph = openGraphData;

		/*
		 * if it's gotten from followed-by end-point we get openGraph in plain object,
		 * not in an array, we still need to support /threads end-point with an array result
		 */
		if (Array.isArray(openGraphData)) {
			openGraph = openGraphData[0];
		}

		return this._super({
			description: openGraph.description,
			domain: extractDomainFromUrl(openGraph.url),
			imageHeight: openGraph.imageHeight,
			imageUrl: openGraph.imageUrl,
			imageWidth: openGraph.imageWidth,
			siteName: openGraph.siteName,
			title: openGraph.title,
			type: openGraph.type,
			url: openGraph.url,
		});
	},
});

export default OpenGraph;
