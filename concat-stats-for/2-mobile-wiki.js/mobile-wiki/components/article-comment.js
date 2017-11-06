define('mobile-wiki/components/article-comment', ['exports', 'mobile-wiki/modules/thumbnailer'], function (exports, _thumbnailer) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var $ = Ember.$;
	var Component = Ember.Component;
	var computed = Ember.computed;
	exports.default = Component.extend({
		i18n: service(),
		wikiVariables: service(),
		tagName: 'li',
		classNames: ['article-comment'],

		isExpanded: false,
		users: null,
		comment: null,
		thumbnailWidth: 480,

		text: computed('comment.text', function () {
			var $text = $('<div/>').html(this.get('comment.text')),
			    $figure = $text.find('figure');

			if ($figure.length) {
				this.convertThumbnails($figure);
			}

			return $text.html();
		}),

		user: computed('users', function () {
			var users = this.get('users');

			if (users) {
				return users[this.get('comment.userName')] || {};
			}
		}),

		userName: computed('comment.userName', function () {
			// Checks for an IP address to identify an anonymous user. This is very crude and obviously doesn't check IPv6.
			var userName = this.get('comment.userName'),
			    regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

			if (regex.test(userName)) {
				return this.get('i18n').t('app.username-anonymous');
			} else {
				return userName;
			}
		}),

		actions: {
			toggleExpand: function toggleExpand() {
				this.toggleProperty('isExpanded');
			}
		},

		/**
   * This is temporary workaround so we can display thumbnails in comments.
   * It parses <figure> element, gets data-params from <img> and creates new figures based on that.
   * Clicking on thumbnail will open File page instead of lightbox.
   *
   * TODO: this should be done properly starting from changing the API response
   *
   * @param {JQuery} $originalFigure
   * @returns {void}
   */
		convertThumbnails: function convertThumbnails($originalFigure) {
			var _this = this;

			var thumbnailer = _thumbnailer.default,

			/**
    * @param {ArticleCommentThumbnailData} thumbnailData
    * @returns {JQuery}
    */
			createFigureFromThumbnailData = function createFigureFromThumbnailData(thumbnailData) {
				var thumbnailURL = thumbnailer.getThumbURL(thumbnailData.full, {
					mode: thumbnailer.mode.scaleToWidth,
					width: _this.thumbnailWidth
				}),
				    $thumbnail = $('<img/>').attr('src', thumbnailURL),
				    articlePath = _this.get('wikiVariables.articlePath'),
				    fileNamespace = _this.get('wikiVariables.namespaces.6') || 'File',
				    href = '' + articlePath + fileNamespace + ':' + thumbnailData.name,
				    $anchor = $('<a/>').attr('href', href).append($thumbnail),
				    $figure = $('<figure/>');

				var $figcaption = void 0;

				if (thumbnailData.type === 'video') {
					$figure.addClass('comment-video');
				}

				$figure.append($anchor);

				if (thumbnailData.capt) {
					$figcaption = $('<figcaption/>').text(thumbnailData.capt);
					$figure.append($figcaption);
				}

				return $figure;
			};

			var thumbnailsData = void 0,
			    newFigures = void 0;

			try {
				thumbnailsData = JSON.parse($originalFigure.find('img[data-params]').attr('data-params'));
			} catch (exception) {
				return;
			}

			newFigures = thumbnailsData.map(createFigureFromThumbnailData);

			$originalFigure.replaceWith(newFigures);
		}
	});
});