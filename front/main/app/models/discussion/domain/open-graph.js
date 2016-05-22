import Ember from 'ember';
import {extractDomainFromUrl} from '../../../utils/domain';

const OpenGraph = Ember.Object.extend({
	description: null,
	domain: null,
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
			href: Ember.get(openGraphData, '_links.self.href'),
			id: openGraphData.id,
			imageHeight: openGraphData.imageHeight,
			imageUrl: openGraphData.imageUrl,
			imageWidth: openGraphData.imageWidth,
			siteId: openGraphData.siteId,
			siteName: openGraphData.siteName,
			title: openGraphData.title,
			type: openGraphData.type,
			url: openGraphData.url,
		});
	},
});

export default OpenGraph;
