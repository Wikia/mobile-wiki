export default {
	data: {
		ns: 0,
		isMainPage: false,
		details: {
			id: 123123123,
			title: 'Test_article',
			ns: 0,
			url: '/wiki/Test_article',
			revision: {
				id: 4270,
				user: 'Agse',
				user_id: 4809883,
				timestamp: '1481896151'
			},
			abstract: '04:04 I am Maru. The strangest cat on the planet! 03:48 Smolik Kev Fox - Run (Official Audio...',
			thumbnail: 'https://vignette.wikia.nocookie.net/agas/images/9/95/Harajuku_Girl.jpg/revision/latest/' +
			'window-crop/width/200/x-offset/84/y-offset/0/window-width/335/window-height/334?cb=20140512132255',
			original_dimensions: {
				width: '500',
				height: '334'
			},
			description: '04:04 I am Maru. The strangest cat on the planet! 03:48 Smolik Kev Fox - Run (Official Audio...'
		},
		articleType: '',
		adsContext: {
			opts: {
				adsInContent: 1,
				delayBtf: true,
				enableAdsInMaps: true,
				pageType: 'all_ads',
				showAds: true,
				pageFairDetectionUrl: '/load.php?cb=1521720057&debug=false&lang=en&modules=' +
				'6704ffcaede8f70b2a9d20ace3b81d77&only=scripts&skin=wikiamobile&*',
				prebidBidderUrl: [
					'//slot1.preview.wikia.com/__am/1521720057/group/-/pr3b1d_prod_js'
				]
			},
			targeting: {
				enableKruxTargeting: true,
				enablePageCategories: true,
				esrbRating: 'teen',
				mappedVerticalName: 'life',
				pageArticleId: 2231,
				pageIsArticle: true,
				pageName: 'Test_zdjecia_nowe',
				pageType: 'article',
				skin: 'mercury',
				wikiCategory: 'life',
				wikiDbName: 'agas',
				wikiLanguage: 'en',
				wikiVertical: 'lifestyle',
				newWikiCategories: [
					'life'
				]
			},
			providers: {
				evolve2: true
			},
			slots: {
				invisibleHighImpact: true
			},
			forcedProvider: null
		},
		htmlTitle: 'Test_article',
		article: {
			content: 'This is test article',
			media: [],
			users: []
		}
	},
	categories: [],
	displayTitle: 'Test_article',
	heroImage: null,
	hasPortableInfobox: false,
	topContributors: [
		{
			user_id: 4809883,
			title: 'Agse',
			name: 'Agse',
			url: '/wiki/User:Agse',
			numberofedits: 74,
			avatar: 'https://static.wikia.nocookie.net/dd4adf64-6ba7-41b2-a859-b65ec1f90717/scale-to-width-down/100'
		}
	]
};
