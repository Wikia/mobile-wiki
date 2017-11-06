define('mobile-wiki/mirage/fixtures/curated-content', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		data: {
			isMainPage: true,
			ns: 0,
			curatedMainPageData: {
				curatedContent: {
					items: [{
						label: 'Categories',
						imageUrl: 'https://vignette.wikia.nocookie.net/mercurycc/images/3/3e/Burton-jane-' + 'ginger-domestic-kitten-felis-catus-rolling-on-back-playing.jpg/revision/latest' + '?cb=20150706160548',
						type: 'section',
						items: [{
							label: 'Articles label',
							imageUrl: 'https://vignette.wikia.nocookie.net/mercurycc/images/5/5a/Red.jpg' + '/revision/latest?cb=20150708092401',
							type: 'category',
							url: '/wiki/Category:Articles',
							imageCrop: null
						}, {
							label: 'Blogs label',
							imageUrl: 'https://vignette.wikia.nocookie.net/mercurycc/images/5/5a/Red.jpg' + '/revision/latest?cb=20150708092401',
							type: 'category',
							url: '/wiki/Category:Blog_posts',
							imageCrop: null
						}, {
							label: 'Photos label',
							imageUrl: 'https://vignette.wikia.nocookie.net/mercurycc/images/5/5a/Red.jpg' + '/revision/latest?cb=20150708092401',
							type: 'category',
							url: '/wiki/Category:Images',
							imageCrop: null
						}, {
							label: 'Videos label',
							imageUrl: 'https://vignette.wikia.nocookie.net/mercurycc/images/5/5a/Red.jpg' + '/revision/latest?cb=20150708092401',
							type: 'category',
							url: '/wiki/Category:Videos',
							imageCrop: null
						}],
						imageCrop: null
					}, {
						label: 'Templates label',
						imageUrl: 'https://vignette.wikia.nocookie.net/mercurycc/images/5/5a/Red.jpg' + '/revision/latest?cb=20150708092401',
						type: 'category',
						url: '/wiki/Category:Templates',
						imageCrop: null
					}, {
						label: 'Broken',
						imageUrl: 'https://vignette.wikia.nocookie.net/mercurycc/images/5/57/UC39.jpg' + '/revision/latest?cb=20150715133441',
						type: 'category',
						url: '/wiki/Category:Broken',
						imageCrop: null
					}]
				},
				wikiaStats: {
					edits: 910,
					articles: 13,
					pages: 184,
					users: 9300499,
					activeUsers: 0,
					images: 67,
					videos: 6,
					admins: 3
				}
			},
			details: {
				id: 1461,
				title: 'Mercury CC Wikia',
				ns: 0,
				url: '/wiki/Mercury_CC_Wikia',
				revision: {
					id: 4077,
					user: 'Tomasz.napieralski',
					user_id: 25832797,
					timestamp: 1436194543
				},
				comments: 0,
				type: 'article',
				abstract: 'About Mercury CC Write a description about your topic.' + ' Let your readers know what your topic is...',
				thumbnail: null,
				original_dimensions: null,
				description: 'Mercury CC Wikia is a community site that anyone can contribute to.' + ' Discover, share and add your knowledge!'
			},
			articleType: 'other'
		}
	};
});