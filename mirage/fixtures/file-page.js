import {transparentImageBase64} from '../../app/utils/thumbnail';

export default {
	data: {
		isMainPage: false,
		ns: 6,
		nsSpecificContent: {
			fileUsageList: [
				{
					title: 'Jim_Henson:_A_Man_and_His_Frog',
					id: '122215',
					namespace_id: '0',
					wiki: 'Muppet Wiki',
					wikiUrl: 'http://muppet.damian.wikia-dev.pl',
					titleDBkey: 'Jim_Henson:_A_Man_and_His_Frog',
					titleText: 'Jim Henson: A Man and His Frog',
					articleId: 122215,
					imageUrl: transparentImageBase64,
					url: 'http://muppet.damian.wikia-dev.pl/wiki/Jim_Henson:_A_Man_and_His_Frog',
					snippet: 'Jim Henson: A Man and His Frog was an exhibit at the Center for Puppetry Arts that&lt;' +
					'ellipsis&gt;'
				}
			],
			fileUsageListSeeMoreUrl: '/wiki/Special:WhatLinksHere/File:Example.jpg',
			media: {
				type: 'image',
				url: transparentImageBase64,
				fileUrl: 'http://muppet.igor.wikia-dev.pl/wiki/File:Kerm.jpg',
				title: 'Kerm.jpg',
				user: 'Scarecroe',
				width: 250,
				height: 123
			}
		},
		details: {
			id: 122203,
			title: 'Example.jpg',
			ns: 6,
			url: '/wiki/File:Example.jpg',
			revision: {
				id: 530721,
				user: 'Kermie1',
				user_id: 128112,
				timestamp: '1279738256'
			},
			comments: 0,
			type: 'image',
			abstract: '',
			thumbnail: transparentImageBase64,
			original_dimensions: {
				width: '300',
				height: '400'
			},
			description: ''
		},
		adsContext: {
			opts: {
				showAds: false
			},
			targeting: {
				wikiVertical: 'tv'
			}
		}
	}
};
