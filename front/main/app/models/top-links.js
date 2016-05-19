import Ember from 'ember';

const TopLinksModel = Ember.Object.extend({
	article: null,
	init() {
		this._super(...arguments);
		this.items = [];
	},

	/**
	 * @returns {Ember.RSVP.Promise} model
	 */
	load() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const titles = this.getMostLinkedArticles();

			let width = 100,
				height = 100;

			if (this.get('style') === 'landscape') {
				width = 320;
				height = 180;
			}

			Ember.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'ArticlesApi',
					method: 'getDetails',
					format: 'json',
					titles: titles.join(','),
					abstract: 0,
					width,
					height
				},
				success: (data) => {
					this.setProperties(this.formatData(data));
					resolve(this);
				},
				error: (data) => reject(data)
			});
		});
	},

	formatData(data) {
		let items = [];

		// data.items is an object, using `each` here to force it into an array.
		Ember.$.each(data.items, (index, item) => {
			item.index = index;
			items.push(item);
		});

		return {
			items
		};
	},

	getMostLinkedArticles() {
		const article = this.get('article'),
			$links = article.$('a[title]').filter((index, element) => this.validLink(element, article)),
			minimumLinksNumber = 8;

		let topTitles = [];

		// If this page does not have enough links we don't want to show this widget
		if ($links.length > minimumLinksNumber) {
			topTitles = this.findTopTitles($links);
		}

		return topTitles;
	},

	findTopTitles($links) {
		let links = [],
			titles,
			sortedTitles;

		$links.each((index, element) => {
			links[element.title] = links[element.title] || 0;
			links[element.title] ++;
		});

		titles = Object.keys(links);
		sortedTitles = titles.sort((title1, title2) => {
			return links[title2] - links[title1];
		});

		return sortedTitles.length >= 3 ? sortedTitles.slice(0, 3) : [];
	},

	validLink(element, article) {
		// Not a link to current article
		if (element.title === article.displayTitle) {
			return false;
		}

		// The API can't handle articles with commas in the title
		if (element.title.indexOf(',') !== -1) {
			return false;
		}

		// This is a pretty heavy handed Regex, and it may only work for EN communities
		// but the idea is to not display links to special pages
		if (element.title.match(/\S:\S/)) {
			return false;
		}

		return true;
	}


});

export default TopLinksModel;
