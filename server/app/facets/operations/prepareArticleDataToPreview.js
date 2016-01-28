import * as Utils from '../../lib/Utils';
import localSettings from '../../../config/localSettings';
import deepExtend from 'deep-extend';
import {getCachedWikiDomainName, getCDNBaseUrl} from '../../lib/Utils';

/**
 * Prepares article preview data to be rendered in preview window
 *
 * @param {object} data
 * @param {object} wikiVariables
 * @returns {object}
 */
export default function prepareArticleDataToPreview(data, wikiVariables = {}) {
	let title,
		contentDir = 'ltr',
		result = {
			article: {
				data: data,
				adsContext: {},
				details: {
					ns: 0,
					id: 0,
					title: '',
					revision: {},
					type: 'article',
					comments: 0,
					user: 0
				},
				isMainPage: 'false',
				htmlTitle: '',
				preview: true
			},
			wikiVariables: wikiVariables,
			userId: 0,
			server: {
				cdnBaseUrl: getCDNBaseUrl(localSettings)
			},
			//required for UniversalAnalytics to work
			tracking: localSettings.tracking,
		};

	if (data.article) {
		title = data.article.displayTitle || '';
		// TODO: DO WE? we want to return the article content only once - as HTML and not JS variable
		result.articleContent = data.article.content;
		delete data.article.content;
	}

	if (wikiVariables.language) {
		contentDir = wikiVariables.language.contentDir;
		result.isRtl = (contentDir === 'rtl');
	}

	result.displayTitle = title || '';
	result.htmlTitle = Utils.getHtmlTitle(wikiVariables, title);

	// clone object to avoid overriding real localSettings for future requests
	result.localSettings = deepExtend({}, localSettings);

	//TODO: REMOVE THIS MOCK!!

	result.article.data.article.media = [
		{
			type: "image",
			url: "http://vignette-poz.wikia-dev.com/muppet/images/9/91/BB-Funny.jpg/revision/latest?cb=20160114013619",
			fileUrl: "http://muppet.diana.wikia-dev.com/wiki/File:BB-Funny.jpg",
			title: "BB-Funny.jpg",
			user: "Oscarfan",
			width: 622,
			height: 470,
			context: "article-image"
		}
	];

	result.article.data.article.content = '<p>This is a test page </p> <p>óćżńłćżńćżłć </p> <p><br></p> <aside class="portable-infobox pi-background pi-theme-wikia pi-layout-default"><h2 class="pi-item pi-item-spacing pi-title">Jestę defoltę</h2> </aside> <p><br><img src="//:0" class="article-media" data-ref="0" width="622" height="470"></p>';

	console.log(">>>>>>>>>>>>> dane po przetworzeniu: ", result);

	return result;
}
