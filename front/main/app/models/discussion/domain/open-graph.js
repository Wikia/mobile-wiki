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
		return this._super({
			description: openGraphData.description,
			domain: extractDomainFromUrl(openGraphData.url),
			imageHeight: openGraphData.imageHeight,
			imageUrl: openGraphData.imageUrl,
			imageWidth: openGraphData.imageWidth,
			siteName: openGraphData.siteName,
			title: openGraphData.title,
			type: openGraphData.type,
			url: openGraphData.url,
		});
	},
});

export default OpenGraph;
