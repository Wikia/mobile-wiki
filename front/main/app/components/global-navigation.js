import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['wds-global-navigation'],
	model: {
		"anon": {
			"header": {
				"image": "wds-icons-user",
				"subtitle": {
					"key": "global-navigation-anon-my-account",
					"type": "translatable-text"
				},
				"title": {
					"key": "global-navigation-anon-my-account",
					"type": "translatable-text"
				},
				"type": "line-image"
			},
			"links": [
				{
					"href": "https://www.wikia.com/signin",
					"param-name": "redirect",
					"title": {
						"key": "global-navigation-anon-sign-in",
						"type": "translatable-text"
					},
					"type": "link-authentication"
				},
				{
					"href": "https://www.wikia.com/register",
					"param-name": "redirect",
					"subtitle": {
						"key": "global-navigation-anon-register-description",
						"type": "translatable-text"
					},
					"title": {
						"key": "global-navigation-anon-register",
						"type": "translatable-text"
					},
					"type": "link-authentication"
				}
			]
		},
		"create_wiki": {
			"header": {
				"href": "http://www.wikia.com/Special:CreateNewWiki",
				"title": {
					"key": "global-navigation-create-wiki-link-start-wikia",
					"type": "translatable-text"
				},
				"type": "link-text"
			}
		},
		"fandom_overview": {
			"links": [
				{
					"brand": "games",
					"href": "http://fandom.wikia.com/games",
					"title": {
						"key": "global-navigation-fandom-overview-link-vertical-games",
						"type": "translatable-text"
					},
					"type": "link-branded"
				},
				{
					"brand": "movies",
					"href": "http://fandom.wikia.com/movies",
					"title": {
						"key": "global-navigation-fandom-overview-link-vertical-movies",
						"type": "translatable-text"
					},
					"type": "link-branded"
				},
				{
					"brand": "tv",
					"href": "http://fandom.wikia.com/tv",
					"title": {
						"key": "global-navigation-fandom-overview-link-vertical-tv",
						"type": "translatable-text"
					},
					"type": "link-branded"
				}
			]
		},
		"logo": {
			"header": {
				"href": "http://fandom.wikia.com",
				"image": "wds-company-logo-wikia",
				"subtitle": {
					"key": "global-footer-international-header-subtitle",
					"type": "translatable-text"
				},
				"title": {
					"key": "global-footer-wikia-header",
					"type": "translatable-text"
				},
				"type": "link-image"
			}
		},
		"search": {
			"module": {
				"placeholder-active": {
					"key": "global-navigation-search-placeholder-in-wiki",
					"params": {
						"sitename": {
							"type": "text",
							"value": "Wookieepedia"
						}
					},
					"type": "translatable-text"
				},
				"placeholder-inactive": {
					"key": "global-navigation-search-placeholder-inactive",
					"type": "translatable-text"
				},
				"results": {
					"param-name": "query",
					"url": "http://starwars.grunny.wikia-dev.com/wiki/Special:Search?fulltext=Search"
				},
				"suggestions": {
					"param-name": "query",
					"url": "http://starwars.grunny.wikia-dev.com/index.php?action=ajax&rs=getLinkSuggest&format=json"
				},
				"type": "search"
			}
		},
		"wikis": {
			"header": {
				"title": {
					"key": "global-navigation-wikis-header",
					"type": "translatable-text"
				},
				"type": "line-text"
			},
			"links": [
				{
					"href": "http://fandom.wikia.com/explore",
					"title": {
						"key": "global-navigation-wikis-explore",
						"type": "translatable-text"
					},
					"type": "link-text"
				},
				{
					"href": "http://community.wikia.com/wiki/Community_Central",
					"title": {
						"key": "global-navigation-wikis-community-central",
						"type": "translatable-text"
					},
					"type": "link-text"
				},
				{
					"href": "http://community.wikia.com/wiki/Wikia_University",
					"title": {
						"key": "global-navigation-wikis-fandom-university",
						"type": "translatable-text"
					},
					"type": "link-text"
				}
			]
		}
	}
});
