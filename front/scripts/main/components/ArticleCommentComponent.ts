/// <reference path="../app.ts" />
'use strict';

App.ArticleCommentComponent = Em.Component.extend({
	tagName: 'li',
	classNames: ['article-comment'],

	isExpanded: false,
	users: null,
	comment: null,
	thumbnailWidth: 480,

	text: Em.computed('comment.text', function () {
		var $text = $('<div/>').html(this.get('comment.text')),
			$figure = $text.find('figure');

		if ($figure.length) {
			this.convertThumbnails($figure);
		}

		return $text.html();
	}),

	user: Em.computed('users', function () {
		var users = this.get('users');
		if (users) {
			return users[this.get('comment.userName')] || {};
		}
	}),

	userName: Em.computed('comment.userName', function () {
		// Checks for an IP address to identify an anonymous user. This is very crude and obviously doesn't check IPv6.
		var userName = this.get('comment.userName'),
			regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

		if (regex.test(userName)) {
			return i18n.t('app.username-anonymous');
		} else {
			return userName;
		}
	}),

	actions: {
		toggleExpand: function () {
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
	 */
	convertThumbnails: function ($originalFigure: JQuery): void {
		var thumbnailsData: any,
			thumbnailer = Mercury.Modules.Thumbnailer,
			newFigures: JQuery[] = [];

		try {
			thumbnailsData = JSON.parse($originalFigure.find('img[data-params]').attr('data-params'));
		} catch (exception) {
			return;
		}

		thumbnailsData.forEach((thumbnailData: {name: string; full: string; capt?: string; type?: string}) => {
			var thumbnailURL = thumbnailer.getThumbURL(thumbnailData.full, {
					mode: thumbnailer.mode.scaleToWidth,
					width: this.thumbnailWidth
				}),
				$thumbnail = $('<img/>').attr('src', thumbnailURL),
				href = '%@%@:%@'.fmt(
					Em.get(Mercury, 'wiki.articlePath'),
					Em.getWithDefault(Mercury, 'wiki.namespaces.6', 'File'),
					thumbnailData.name
				),
				$anchor = $('<a/>').attr('href', href).append($thumbnail),
				$figcaption: JQuery,
				$figure = $('<figure/>');

			if (thumbnailData.type === 'video') {
				$figure.addClass('comment-video');
			}

			$figure.append($anchor);

			if (thumbnailData.capt) {
				$figcaption = $('<figcaption/>').text(thumbnailData.capt);
				$figure.append($figcaption);
			}

			newFigures.push($figure);
		});

		$originalFigure.replaceWith(newFigures);
	}
});
