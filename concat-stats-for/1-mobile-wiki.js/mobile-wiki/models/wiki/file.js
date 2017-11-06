define('mobile-wiki/models/wiki/file', ['exports', 'mobile-wiki/models/wiki/base', 'mobile-wiki/models/media', 'mobile-wiki/utils/url'], function (exports, _base, _media, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var get = Ember.get,
	    getOwner = Ember.getOwner;
	exports.default = _base.default.extend({
		hasArticle: false,
		heroImage: null,
		fileUsageList: null,
		fileUsageListSeeMoreUrl: null,

		/**
   * @param {Object} data
   * @returns {void}
   */
		setData: function setData(_ref) {
			var data = _ref.data;

			this._super.apply(this, arguments);
			var pageProperties = void 0;

			if (data) {
				var media = get(data, 'nsSpecificContent.media');

				// This data should always be set - no matter if file has an article or not
				pageProperties = {
					articleType: 'file',
					fileUsageList: get(data, 'nsSpecificContent.fileUsageList').map(this.prepareFileUsageItem),
					fileUsageListSeeMoreUrl: get(data, 'nsSpecificContent.fileUsageListSeeMoreUrl'),
					fileThumbnail: media,
					fileMedia: {
						// This is for lightbox only
						media: _media.default.create(getOwner(this).ownerInjection(), { media: media }),
						mediaRef: 0
					}
				};
			}

			this.setProperties(pageProperties);
		},
		prepareFileUsageItem: function prepareFileUsageItem(_ref2) {
			var title = _ref2.titleText,
			    snippet = _ref2.snippet,
			    url = _ref2.url;

			return {
				title: title,
				snippet: snippet,
				prefixedTitle: (0, _url.extractEncodedTitle)(url)
			};
		}
	});
});