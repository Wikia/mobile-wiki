export default function (owner) {
	let fastboot = owner.lookup('service:fastboot');

	fastboot.shoebox.retrieve = function (key) {
		if (key === 'applicationData') {
			/* eslint-disable */
			return {
				"wikiVariables": {
					"cacheBuster": 1492171378,
					"contentNamespaces": [0],
					"dbName": "fallout",
					"defaultSkin": "oasis",
					"disableAnonymousEditing": false,
					"disableAnonymousUploadForMercury": false,
					"disableMobileSectionEditor": false,
					"enableCommunityData": true,
					"enableDiscussions": true,
					"enableOnSiteNotifications": true,
					"enableNewAuth": true,
					"favicon": "https://vignette.wikia-dev.pl//images/6/64/Favicon.ico/revision/latest?cb=20120126213838",
					"homepage": "http://www.wikia.com/fandom",
					"id": 3035,
					"isCoppaWiki": false,
					"isDarkTheme": true,
					"language": {"content": "en", "contentDir": "ltr"},
					"mainPageTitle": "Fallout_Wiki",
					"namespaces": {
						"0": "",
						"1": "Talk",
						"2": "User",
						"3": "User_talk",
						"4": "MediaWiki",
						"5": "MediaWiki_talk",
						"6": "File",
						"7": "File_talk",
						"8": "MediaWiki",
						"9": "MediaWiki_talk",
						"10": "Template",
						"11": "Template_talk",
						"12": "Help",
						"13": "Help_talk",
						"14": "Category",
						"15": "Category_talk",
						"110": "Forum",
						"111": "Forum_talk",
						"420": "Layer",
						"421": "Layer_talk",
						"500": "User_blog",
						"501": "User_blog_comment",
						"502": "Blog",
						"503": "Blog_talk",
						"828": "Module",
						"829": "Module_talk",
						"1200": "Message_Wall",
						"1201": "Thread",
						"1202": "Message_Wall_Greeting",
						"-2": "Media",
						"-1": "Special"
					},
					"siteMessage": "The Fallout wiki - Fallout: New Vegas and more",
					"siteName": "MediaWiki",
					"theme": {
						"color-body": "#060606",
						"color-body-middle": "#bacdd8",
						"color-page": "#474646",
						"color-buttons": "#092f71",
						"color-links": "#ffd500",
						"color-header": "#000000",
						"background-image": "/skins/oasis/images/themes/plated.jpg",
						"background-image-width": "1900",
						"background-image-height": "1086",
						"background-dynamic": "false",
						"page-opacity": "100"
					},
					"tracking": {
						"vertical": "games",
						"comscore": {"c7Value": "wikiacsid_games"},
						"netzathleten": {
							"enabled": true,
							"url": "//s.adadapter.netzathleten-media.de/API-1.0/NA-828433-1/naMediaAd.js"
						}
					},
					"wikiCategories": [],
					"localNav": [{
						"text": "News",
						"href": "/wiki/Blog:News",
						"children": [{"text": "Recent news", "href": "/wiki/Blog:News"}, {
							"text": "Submit news",
							"href": "/wiki/Special:CreateBlogPage"
						}, {
							"text": "Fallout 4 news",
							"href": "/wiki/Blog:Fallout_4_news"
						}, {"text": "Community news", "href": "/wiki/Blog:Community_news"}, {
							"text": "More...",
							"href": "/wiki/Category:News"
						}]
					}, {
						"text": "Fallout games",
						"href": "/wiki/Fallout_series",
						"children": [{
							"text": "Classic Games",
							"href": "/wiki/Classic_Games",
							"children": [{
								"text": "Fallout",
								"href": "/wiki/Portal:Fallout"
							}, {
								"text": "Fallout 2",
								"href": "/wiki/Portal:Fallout_2"
							}, {"text": "Fallout Tactics", "href": "/wiki/Portal:Fallout_Tactics"}]
						}, {
							"text": "Fallout 3",
							"href": "/wiki/Portal:Fallout_3",
							"children": [{
								"text": "Add-ons (DLC)",
								"href": "/wiki/Fallout_3_add-ons"
							}, {
								"text": "Characters",
								"href": "/wiki/Fallout_3_characters"
							}, {
								"text": "Companions",
								"href": "/wiki/Fallout_3_companions"
							}, {
								"text": "Creatures",
								"href": "/wiki/Fallout_3_creatures"
							}, {
								"text": "Robots and computers",
								"href": "/wiki/Fallout_3_robots_and_computers"
							}, {"text": "Factions", "href": "/wiki/Fallout_3_factions"}, {
								"text": "Items",
								"href": "/wiki/Fallout_3_items"
							}, {"text": "Locations", "href": "/wiki/Fallout_3_locations"}, {
								"text": "Quests",
								"href": "/wiki/Fallout_3_quests"
							}, {"text": "SPECIAL", "href": "/wiki/Fallout_3_SPECIAL"}]
						}, {
							"text": "Fallout: New Vegas",
							"href": "/wiki/Portal:Fallout:_New_Vegas",
							"children": [{
								"text": "Add-ons (DLC)",
								"href": "/wiki/Fallout:_New_Vegas_add-ons"
							}, {
								"text": "Characters",
								"href": "/wiki/Fallout:_New_Vegas_characters"
							}, {
								"text": "Companions",
								"href": "/wiki/Fallout:_New_Vegas_companions"
							}, {
								"text": "Creatures",
								"href": "/wiki/Fallout:_New_Vegas_creatures"
							}, {
								"text": "Robots and computers",
								"href": "/wiki/Fallout:_New_Vegas_robots_and_computers"
							}, {
								"text": "Factions",
								"href": "/wiki/Fallout:_New_Vegas_factions"
							}, {
								"text": "Items",
								"href": "/wiki/Fallout:_New_Vegas_items"
							}, {
								"text": "Locations",
								"href": "/wiki/Fallout:_New_Vegas_locations"
							}, {
								"text": "Quests",
								"href": "/wiki/Fallout:_New_Vegas_quests"
							}, {"text": "SPECIAL", "href": "/wiki/Fallout:_New_Vegas_SPECIAL"}]
						}, {
							"text": "Shelter",
							"href": "/wiki/Portal:Fallout_Shelter",
							"children": [{
								"text": "Characters",
								"href": "/wiki/Fallout_Shelter_characters"
							}, {
								"text": "Outfits",
								"href": "/wiki/Fallout_Shelter_outfits"
							}, {
								"text": "Resources",
								"href": "/wiki/Fallout_Shelter_resources"
							}, {"text": "Rooms", "href": "/wiki/Fallout_Shelter_rooms"}, {
								"text": "Weapons",
								"href": "/wiki/Fallout_Shelter_weapons"
							}, {"text": "Creatures", "href": "/wiki/Fallout_Shelter_creatures"}, {
								"text": "FAQ",
								"href": "/wiki/Fallout_Shelter_FAQ"
							}, {"text": "Project", "href": "/wiki/Fallout_Wiki:Fallout_Shelter_pages"}]
						}, {
							"text": "Other games",
							"href": "/wiki/Fallout_series",
							"children": [{
								"text": "Fallout: Brotherhood of Steel",
								"href": "/wiki/Portal:Fallout:_Brotherhood_of_Steel"
							}, {"text": "Lionheart", "href": "/wiki/Lionheart"}, {
								"text": "Wasteland Wiki",
								"href": "http://community.wikia.com/wiki/c:Wasteland"
							}]
						}, {
							"text": "Canceled Games",
							"href": "/wiki/Portal:Canceled_Games",
							"children": [{
								"text": "Van Buren",
								"href": "/wiki/Portal:Van_Buren"
							}, {
								"text": "Project V13",
								"href": "/wiki/Project_V13"
							}, {
								"text": "Fallout: Brotherhood of Steel 2",
								"href": "/wiki/Fallout:_Brotherhood_of_Steel_2"
							}, {
								"text": "Fallout Extreme",
								"href": "/wiki/Fallout_Extreme"
							}, {
								"text": "Fallout Tactics 2",
								"href": "/wiki/Fallout_Tactics_2"
							}, {
								"text": "Fallout Pen and Paper d20",
								"href": "/wiki/Fallout_Pen_and_Paper_d20"
							}, {
								"text": "Fallout (PlayStation)",
								"href": "/wiki/Fallout_(PlayStation)"
							}, {"text": "TORN", "href": "/wiki/TORN"}]
						}]
					}, {
						"text": "Fallout 4",
						"href": "/wiki/Portal:Fallout_4",
						"children": [{"text": "About", "href": "/wiki/Fallout_4"}, {
							"text": "Locations",
							"href": "/wiki/Fallout_4_locations",
							"children": [{
								"text": "Boston",
								"href": "/wiki/Boston"
							}, {
								"text": "The Commonwealth",
								"href": "/wiki/The_Commonwealth"
							}, {
								"text": "Diamond City",
								"href": "/wiki/Diamond_City"
							}, {
								"text": "Massachusetts State House",
								"href": "/wiki/Massachusetts_State_House"
							}, {
								"text": "Memory Den",
								"href": "/wiki/Memory_Den"
							}, {
								"text": "Paul Revere Monument",
								"href": "/wiki/Paul_Revere_Monument"
							}, {
								"text": "Power Noodles",
								"href": "/wiki/Power_Noodles"
							}, {
								"text": "Scollay Square",
								"href": "/wiki/Scollay_Square"
							}, {
								"text": "USS Constitution",
								"href": "/wiki/USS_Constitution"
							}, {"text": "Vault 111", "href": "/wiki/Vault_111"}]
						}, {
							"text": "Characters",
							"href": "/wiki/Fallout_4_characters",
							"children": [{
								"text": "Sole Survivor",
								"href": "/wiki/Sole_Survivor"
							}, {"text": "Codsworth", "href": "/wiki/Codsworth"}, {
								"text": "Shaun",
								"href": "/wiki/Shaun"
							}, {"text": "Vault-Tec rep", "href": "/wiki/Vault-Tec_rep"}, {
								"text": "Piper",
								"href": "/wiki/Piper"
							}, {
								"text": "Dogmeat",
								"href": "/wiki/Dogmeat_(Fallout_4)"
							}, {
								"text": "Preston Garvey",
								"href": "/wiki/Preston_Garvey"
							}, {"text": "John Hancock", "href": "/wiki/John_Hancock"}]
						}, {
							"text": "Creatures",
							"href": "/wiki/Fallout_4_creatures",
							"children": [{"text": "Bloodbug", "href": "/wiki/Bloodbug"}, {
								"text": "Brahmin",
								"href": "/wiki/Brahmin_(Fallout_4)"
							}, {"text": "Deathclaw", "href": "/wiki/Deathclaw_(Fallout_4)"}, {
								"text": "Dog",
								"href": "/wiki/Dog_(Fallout_4)"
							}, {
								"text": "Feral ghoul",
								"href": "/wiki/Feral_ghoul_(Fallout_4)"
							}, {"text": "Mirelurk", "href": "/wiki/Mirelurk_(Fallout_4)"}, {
								"text": "Yao guai",
								"href": "/wiki/Yao_guai_(Fallout_4)"
							}]
						}, {
							"text": "Robots and computers",
							"href": "/wiki/Fallout_4_robots_and_computers",
							"children": [{
								"text": "Eyebot",
								"href": "/wiki/Eyebot_(Fallout_4)"
							}, {
								"text": "Mister Handy",
								"href": "/wiki/Mister_Handy_(Fallout_4)"
							}, {
								"text": "Protectron",
								"href": "/wiki/Protectron_(Fallout_4)"
							}, {"text": "Sentry bot", "href": "/wiki/Sentry_bot_(Fallout_4)"}, {
								"text": "Synth",
								"href": "/wiki/Synth"
							}]
						}, {
							"text": "Items",
							"href": "/wiki/Fallout_4_items",
							"children": [{
								"text": "Ammunition",
								"href": "/wiki/Fallout_4_ammunition"
							}, {
								"text": "Armor and clothing",
								"href": "/wiki/Fallout_4_armor_and_clothing"
							}, {
								"text": "Consumables",
								"href": "/wiki/Fallout_4_consumables"
							}, {
								"text": "Miscellaneous items",
								"href": "/wiki/Fallout_4_miscellaneous_items"
							}, {"text": "Magazines", "href": "/wiki/Fallout_4_magazines"}, {
								"text": "Weapons",
								"href": "/wiki/Fallout_4_weapons"
							}]
						}, {
							"text": "Other",
							"href": "/wiki/Fallout_4_items",
							"children": [{"text": "Perks", "href": "/wiki/Fallout_4_perks"}, {
								"text": "SPECIAL",
								"href": "/wiki/Fallout_4_SPECIAL"
							}]
						}]
					}, {
						"text": "Comm.",
						"href": "/wiki/Portal:Community",
						"children": [{
							"text": "Forum",
							"href": "/wiki/Forum:Index",
							"children": [{
								"text": "Wiki discussion",
								"href": "/wiki/Forum:Wiki_discussion"
							}, {
								"text": "Wiki proposals and applications",
								"href": "/wiki/Forum:Wiki_proposals_and_applications"
							}, {
								"text": "Fallout 4 general discussion",
								"href": "/wiki/Forum:Fallout_4_general_discussion"
							}, {
								"text": "Fallout and Fallout 2 general discussion",
								"href": "/wiki/Forum:Fallout_and_Fallout_2_general_discussion"
							}, {
								"text": "Fallout 3 general discussion",
								"href": "/wiki/Forum:Fallout_3_general_discussion"
							}, {
								"text": "Fallout: New Vegas general discussion",
								"href": "/wiki/Forum:Fallout:_New_Vegas_general_discussion"
							}, {
								"text": "Fallout: New Vegas gameplay help",
								"href": "/wiki/Forum:Fallout:_New_Vegas_gameplay_help"
							}, {
								"text": "Fallout series general discussion",
								"href": "/wiki/Forum:Fallout_series_general_discussion"
							}, {
								"text": "Fallout world discussion",
								"href": "/wiki/Forum:Fallout_world_discussion"
							}]
						}, {
							"text": "Help",
							"href": "/wiki/Help:Contents",
							"children": [{
								"text": "Wikia basics",
								"href": "/wiki/Help:Wikia_Basics"
							}, {
								"text": "Contributing",
								"href": "/wiki/Help:Contributing"
							}, {
								"text": "Advanced editing",
								"href": "/wiki/Help:Getting_Technical"
							}, {
								"text": "New User Network",
								"href": "/wiki/Fallout_Wiki:New_User_Network"
							}, {
								"text": "Managing your account",
								"href": "/wiki/Help:Managing_Your_Account"
							}, {
								"text": "Frequently asked questions",
								"href": "/wiki/Help:Contents#Frequently Asked Questions"
							}, {
								"text": "Managing your community",
								"href": "/wiki/Help:Managing_Your_Community"
							}, {
								"text": "Designing your wiki",
								"href": "/wiki/Help:Designing_Your_Wiki"
							}, {"text": "More help...", "href": "/wiki/Help:Index"}]
						}, {
							"text": "Policies \u0026 Guidelines",
							"href": "/wiki/Fallout_Wiki:Policies_and_guidelines",
							"children": [{
								"text": "Administrators",
								"href": "/wiki/Fallout_Wiki:Administrators_and_moderators"
							}, {
								"text": "Administration policy",
								"href": "/wiki/Fallout_Wiki:Administration_policy"
							}, {
								"text": "Content policy",
								"href": "/wiki/Fallout_Wiki:Content_policy"
							}, {
								"text": "Image and video policy",
								"href": "/wiki/Fallout_Wiki:Image_and_video_policy"
							}, {
								"text": "Article layout guideline",
								"href": "/wiki/Fallout_Wiki:Article_layout_guideline"
							}, {
								"text": "Content organization guideline",
								"href": "/wiki/Fallout_Wiki:Content_organization_guideline"
							}, {
								"text": "Editing guideline",
								"href": "/wiki/Fallout_Wiki:Editing_guideline"
							}, {
								"text": "User conduct guideline",
								"href": "/wiki/Fallout_Wiki:User_conduct_guideline"
							}, {"text": "Chat conduct guideline", "href": "/wiki/Fallout_Wiki:Chat"}]
						}, {
							"text": "Projects",
							"href": "/wiki/Fallout_Wiki:Projects",
							"children": [{
								"text": "Bug verification project",
								"href": "/wiki/Fallout_Wiki:Bug_Verification_Project"
							}, {
								"text": "New User Network",
								"href": "/wiki/Fallout_Wiki:New_User_Network"
							}, {
								"text": "FO3 and FNV quotations project",
								"href": "/wiki/Fallout_Wiki:Fallout_3_and_New_Vegas_quotations_project"
							}, {
								"text": "FO3 locations project",
								"href": "/wiki/Fallout_Wiki:Fallout_3_locations_project"
							}, {
								"text": "Logical history project",
								"href": "/wiki/Fallout_Wiki:Logical_history_project"
							}, {
								"text": "Military conflicts project",
								"href": "/wiki/Fallout_Wiki:Military_conflicts_project"
							}, {
								"text": "Navigation beautification project",
								"href": "/wiki/Fallout_Wiki:Navigation_Beautification_Project"
							}, {
								"text": "Notable quotes audio project",
								"href": "/wiki/Fallout_Wiki:Notable_Quotes_Audio_Project"
							}, {
								"text": "Stub Removal project",
								"href": "/wiki/Fallout_Wiki:Stub_Removal_project"
							}, {"text": "Sound project", "href": "/wiki/Fallout_Wiki:Sound_project"}]
						}, {"text": "Blogs", "href": "/wiki/Blog:Recent_posts"}, {
							"text": "Leaderboard",
							"href": "/wiki/Special:Leaderboard"
						}, {"text": "Reference Library", "href": "/wiki/Portal:ReferenceLibrary"}]
					}],
					"vertical": "games",
					"basePath": "http://fallout.wikia.com",
					"articlePath": "/wiki/",
					"specialRobotPolicy": "noindex,nofollow",
					"htmlTitle": {
						"separator": " | ",
						"parts": ["Fallout Wiki", "FANDOM"]
					},
					"host": "fallout.wikia.com"
				},
				"navigation": {
					"globalFooter": {
						"header": {
							"type": "link-image",
							"image": "wds-company-logo-fandom-powered-by-wikia-two-lines",
							"image-data": {
								"type": "wds-svg",
								"name": "wds-company-logo-fandom-powered-by-wikia-two-lines"
							},
							"href": "\/\/fandom.wikia.com\/",
							"title": { "type": "text", "value": "Fandom powered by Wikia" },
							"tracking_label": "logo"
						},
						"company_overview": {
							"header": {
								"type": "line-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-company-overview-header"
								}
							},
							"links": [{
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-company-overview-link-about"
								},
								"href": "\/\/www.wikia.com\/about",
								"tracking_label": "company-overview.about"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-company-overview-link-careers"
								},
								"href": "https:\/\/careers.wikia.com",
								"tracking_label": "company-overview.careers"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-company-overview-link-press"
								},
								"href": "\/\/fandom.wikia.com\/press",
								"tracking_label": "company-overview.press"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-company-overview-link-contact"
								},
								"href": "\/\/fandom.wikia.com\/about#contact",
								"tracking_label": "company-overview.contact"
							}]
						},
						"site_overview": {
							"links": [{
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-site-overview-link-terms-of-use"
								},
								"href": "\/\/www.wikia.com\/Terms_of_use",
								"tracking_label": "site-overview.terms-of-use"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-site-overview-link-privacy-policy"
								},
								"href": "\/\/www.wikia.com\/Privacy_Policy",
								"tracking_label": "site-overview.privacy-policy"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-site-overview-link-global-sitemap"
								},
								"href": "\/\/www.wikia.com\/Sitemap",
								"tracking_label": "site-overview.global-sitemap"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-site-overview-link-local-sitemap"
								},
								"href": "\/wiki\/Local_Sitemap",
								"tracking_label": "site-overview.local-sitemap"
							}]
						},
						"create_wiki": {
							"description": {
								"type": "translatable-text",
								"key": "global-footer-create-wiki-description"
							},
							"links": [{
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-create-wiki-link-start-wikia"
								},
								"href": "\/\/www.wikia.com\/Special:CreateNewWiki",
								"tracking_label": "start-a-wiki"
							}]
						},
						"community_apps": {
							"header": {
								"type": "line-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-fandom-app-header"
								}
							},
							"description": {
								"type": "translatable-text",
								"key": "global-footer-fandom-app-description"
							},
							"links": [{
								"type": "link-image",
								"image": "wds-company-store-appstore",
								"image-data": {
									"type": "wds-svg",
									"name": "wds-company-store-appstore"
								},
								"title": {
									"type": "translatable-text",
									"key": "global-footer-community-apps-link-app-store"
								},
								"href": "https:\/\/itunes.apple.com\/us\/app\/fandom-videos-news-reviews\/id1230063803?ls=1&mt=8",
								"tracking_label": "community-apps.app-store"
							}, {
								"type": "link-image",
								"image": "wds-company-store-googleplay",
								"image-data": {
									"type": "wds-svg",
									"name": "wds-company-store-googleplay"
								},
								"title": {
									"type": "translatable-text",
									"key": "global-footer-community-apps-link-google-play"
								},
								"href": "https:\/\/play.google.com\/store\/apps\/details?id=com.fandom.app&referrer=utm_source%3Dwikia%26utm_medium%3Dglobalfooter",
								"tracking_label": "community-apps.google-play"
							}]
						},
						"licensing_and_vertical": {
							"description": {
								"type": "translatable-text",
								"key": "global-footer-licensing-and-vertical-description",
								"params": {
									"sitename": {
										"type": "text",
										"value": "Harry Potter Wiki"
									},
									"vertical": {
										"type": "translatable-text",
										"key": "global-footer-licensing-and-vertical-description-param-vertical-books"
									},
									"license": {
										"type": "link-text",
										"title": { "type": "text", "value": "CC-BY-SA" },
										"href": "http:\/\/www.wikia.com\/Licensing",
										"tracking_label": "license"
									}
								}
							}
						},
						"mobile_site_button": {
							"type": "link-text",
							"title": {
								"type": "translatable-text",
								"key": "global-footer-mobile-site-link"
							}
						},
						"fandom_overview": {
							"links": [{
								"type": "link-branded",
								"brand": "games",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-fandom-overview-link-vertical-games"
								},
								"href": "\/\/fandom.wikia.com\/games",
								"tracking_label": "fandom-overview.games"
							}, {
								"type": "link-branded",
								"brand": "movies",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-fandom-overview-link-vertical-movies"
								},
								"href": "\/\/fandom.wikia.com\/movies",
								"tracking_label": "fandom-overview.movies"
							}, {
								"type": "link-branded",
								"brand": "tv",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-fandom-overview-link-vertical-tv"
								},
								"href": "\/\/fandom.wikia.com\/tv",
								"tracking_label": "fandom-overview.tv"
							}, {
								"type": "link-branded",
								"brand": "explore-wikis",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-fandom-overview-link-explore-wikis"
								},
								"href": "\/\/fandom.wikia.com\/explore",
								"tracking_label": "fandom-overview.explore-wikis"
							}]
						},
						"follow_us": {
							"header": {
								"type": "line-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-follow-us-header"
								}
							},
							"links": [{
								"type": "link-image",
								"image": "wds-icons-facebook",
								"image-data": { "type": "wds-svg", "name": "wds-icons-facebook" },
								"title": {
									"type": "translatable-text",
									"key": "global-footer-follow-us-link-facebook"
								},
								"href": "https:\/\/www.facebook.com\/getfandom",
								"tracking_label": "follow-us.facebook"
							}, {
								"type": "link-image",
								"image": "wds-icons-twitter",
								"image-data": { "type": "wds-svg", "name": "wds-icons-twitter" },
								"title": {
									"type": "translatable-text",
									"key": "global-footer-follow-us-link-twitter"
								},
								"href": "https:\/\/twitter.com\/getfandom",
								"tracking_label": "follow-us.twitter"
							}, {
								"type": "link-image",
								"image": "wds-icons-youtube",
								"image-data": { "type": "wds-svg", "name": "wds-icons-youtube" },
								"title": {
									"type": "translatable-text",
									"key": "global-footer-follow-us-link-youtube"
								},
								"href": "https:\/\/www.youtube.com\/channel\/UC988qTQImTjO7lUdPfYabgQ",
								"tracking_label": "follow-us.youtube"
							}, {
								"type": "link-image",
								"image": "wds-icons-instagram",
								"image-data": { "type": "wds-svg", "name": "wds-icons-instagram" },
								"title": {
									"type": "translatable-text",
									"key": "global-footer-follow-us-link-instagram"
								},
								"href": "https:\/\/www.instagram.com\/getfandom\/",
								"tracking_label": "follow-us.instagram"
							}, {
								"type": "link-image",
								"image": "wds-icons-linkedin",
								"image-data": { "type": "wds-svg", "name": "wds-icons-linkedin" },
								"title": {
									"type": "translatable-text",
									"key": "global-footer-follow-us-link-linkedin"
								},
								"href": "https:\/\/www.linkedin.com\/company\/157252",
								"tracking_label": "follow-us.linkedin"
							}]
						},
						"community": {
							"header": {
								"type": "line-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-community-header"
								}
							},
							"links": [{
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-community-link-community-central"
								},
								"href": "\/\/community.wikia.com\/wiki\/Community_Central",
								"tracking_label": "community.community-central"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-community-link-support"
								},
								"href": "\/\/community.wikia.com\/wiki\/Special:Contact",
								"tracking_label": "community.support"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-community-link-fan-contributor-program"
								},
								"href": "\/\/fandom.wikia.com\/fan-contributor",
								"tracking_label": "community.fan-contributor"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-community-link-wam-score"
								},
								"href": "\/\/www.wikia.com\/WAM",
								"tracking_label": "community.wam"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-community-link-help"
								},
								"href": "\/\/community.wikia.com\/wiki\/Help:Contents",
								"tracking_label": "community.help"
							}]
						},
						"advertise": {
							"header": {
								"type": "line-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-advertise-header"
								}
							},
							"links": [{
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-advertise-link-media-kit"
								},
								"href": "\/\/fandom.wikia.com\/mediakit",
								"tracking_label": "advertise.media-kit"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-footer-advertise-link-contact"
								},
								"href": "\/\/fandom.wikia.com\/mediakit#contact",
								"tracking_label": "advertise.contact"
							}]
						}
					},
					"globalNavigation": {
						"logo": {
							"type": "link-image",
							"href": "\/\/fandom.wikia.com\/",
							"image-data": {
								"type": "wds-svg",
								"name": "wds-company-logo-fandom-white"
							},
							"tracking-label": "logo"
						},
						"search": {
							"type": "search",
							"results": {
								"tracking-label": "search",
								"param-name": "query",
								"url": "\/\/harrypotter.wikia.com\/wiki\/Special:Search"
							},
							"placeholder-inactive": {
								"type": "translatable-text",
								"key": "global-navigation-search-placeholder-inactive"
							},
							"placeholder-active": {
								"type": "translatable-text",
								"key": "global-navigation-search-placeholder-in-wiki",
								"params": {
									"sitename": {
										"type": "text",
										"value": "Harry Potter Wiki"
									}
								}
							},
							"suggestions": {
								"url": "\/\/harrypotter.wikia.com\/index.php?action=ajax&rs=getLinkSuggest&format=json",
								"param-name": "query",
								"tracking-label": "search-suggestion"
							}
						},
						"create-wiki": {
							"type": "link-button",
							"title": {
								"type": "translatable-text",
								"key": "global-navigation-create-wiki-link-start-wikia"
							},
							"href": "\/\/www.wikia.com\/Special:CreateNewWiki",
							"tracking-label": "start-a-wiki"
						},
						"main-navigation": [{
							"type": "link-text",
							"title": {
								"type": "translatable-text",
								"key": "global-navigation-fandom-overview-link-vertical-games"
							},
							"href": "\/\/fandom.wikia.com\/topics\/games",
							"tracking-label": "link.games"
						}, {
							"type": "link-text",
							"title": {
								"type": "translatable-text",
								"key": "global-navigation-fandom-overview-link-vertical-movies"
							},
							"href": "\/\/fandom.wikia.com\/topics\/movies",
							"tracking-label": "link.movies"
						}, {
							"type": "link-text",
							"title": {
								"type": "translatable-text",
								"key": "global-navigation-fandom-overview-link-vertical-tv"
							},
							"href": "\/\/fandom.wikia.com\/topics\/tv",
							"tracking-label": "link.tv"
						}, {
							"type": "link-text",
							"title": {
								"type": "translatable-text",
								"key": "global-navigation-fandom-overview-link-video"
							},
							"href": "\/\/fandom.wikia.com\/video",
							"tracking-label": "link.video"
						}, {
							"type": "link-group",
							"title": {
								"type": "translatable-text",
								"key": "global-navigation-wikis-header"
							},
							"tracking-label": "link.wikis",
							"items": [{
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-navigation-wikis-explore"
								},
								"href": "\/\/fandom.wikia.com\/explore",
								"tracking-label": "link.explore"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "global-navigation-wikis-community-central"
								},
								"href": "\/\/community.wikia.com\/wiki\/Community_Central",
								"tracking-label": "link.community-central"
							}, {
								"type": "link-button",
								"title": {
									"type": "translatable-text",
									"key": "global-navigation-create-wiki-link-start-wikia"
								},
								"href": "\/\/www.wikia.com\/Special:CreateNewWiki",
								"tracking-label": "link.start-a-wiki"
							}]
						}],
						"anon": {
							"signin": {
								"type": "link-authentication",
								"title": {
									"type": "translatable-text",
									"key": "global-navigation-anon-sign-in"
								},
								"href": "https:\/\/www.wikia.com\/signin",
								"param-name": "redirect",
								"tracking-label": "account.sign-in"
							},
							"register": {
								"type": "link-authentication",
								"title": {
									"type": "translatable-text",
									"key": "global-navigation-anon-register"
								},
								"href": "https:\/\/www.wikia.com\/register",
								"param-name": "redirect",
								"tracking-label": "account.register"
							}
						},
						"services-domain": "https:\/\/services.wikia.com\/"
					},
					"communityHeader": {
						"sitename": {
							"type": "link-text",
							"title": { "type": "text", "value": "Harry Potter Wiki" },
							"href": "\/\/harrypotter.wikia.com\/wiki\/Main_Page",
							"tracking_label": "sitename"
						},
						"navigation": [{
							"type": "dropdown",
							"title": { "type": "text", "value": "Books" },
							"href": "\/wiki\/Category:Books_(real-world)",
							"tracking_label": "custom-level-1",
							"items": [{
								"type": "dropdown",
								"title": { "type": "text", "value": "The Seven Novels" },
								"href": "\/wiki\/Harry_Potter_(book_series)",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Philosopher's Stone"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Philosopher%27s_Stone",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Chamber of Secrets"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Chamber_of_Secrets",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Prisoner of Azkaban"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Prisoner_of_Azkaban",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Goblet of Fire"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Goblet_of_Fire",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Order of the Phoenix"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Order_of_the_Phoenix",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Half-Blood Prince"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Half-Blood_Prince",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Deathly Hallows"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Deathly_Hallows",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": {
									"type": "text",
									"value": "Rowling's Companion Writings"
								},
								"href": "\/wiki\/Category:Books_(real-world)",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Fantastic Beasts and Where to Find Them"
									},
									"href": "\/wiki\/Fantastic_Beasts_and_Where_to_Find_Them_(real)",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Quidditch Through the Ages"
									},
									"href": "\/wiki\/Quidditch_Through_the_Ages_(real)",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "The Tales of Beedle the Bard"
									},
									"href": "\/wiki\/The_Tales_of_Beedle_the_Bard_(real)",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Harry Potter Prequel" },
									"href": "\/wiki\/Harry_Potter_Prequel",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Pottermore" },
									"href": "\/wiki\/Pottermore",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": { "type": "text", "value": "Other Written Works" },
								"href": "\/wiki\/Category:Books_(real-world)",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter: A Pop-Up Book"
									},
									"href": "\/wiki\/Harry_Potter:_A_Pop-Up_Book",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter Film Wizardry"
									},
									"href": "\/wiki\/Harry_Potter_Film_Wizardry",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter Page to Screen: The Complete Filmmaking Journey"
									},
									"href": "\/wiki\/Harry_Potter_Page_to_Screen:_The_Complete_Filmmaking_Journey",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "LEGO Harry Potter: Building the Magical World"
									},
									"href": "\/wiki\/LEGO_Harry_Potter:_Building_the_Magical_World",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "LEGO Harry Potter: Characters of the Magical World"
									},
									"href": "\/wiki\/LEGO_Harry_Potter:_Characters_of_the_Magical_World",
									"tracking_label": "custom-level-3"
								}]
							}]
						}, {
							"type": "dropdown",
							"title": { "type": "text", "value": "Films" },
							"href": "\/wiki\/Category:Films_(real-world)",
							"tracking_label": "custom-level-1",
							"items": [{
								"type": "dropdown",
								"title": { "type": "text", "value": "The Eight Films" },
								"href": "\/wiki\/Harry_Potter_(film_series)",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Philosopher's Stone"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Philosopher%27s_Stone_(film)",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Chamber of Secrets"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Chamber_of_Secrets_(film)",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Prisoner of Azkaban"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Prisoner_of_Azkaban_(film)",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Goblet of Fire"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Goblet_of_Fire_(film)",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Order of the Phoenix"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Order_of_the_Phoenix_(film)",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Half-Blood Prince"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Half-Blood_Prince_(film)",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Deathly Hallows: Part 1"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Deathly_Hallows:_Part_1",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Harry Potter and the Deathly Hallows: Part 2"
									},
									"href": "\/wiki\/Harry_Potter_and_the_Deathly_Hallows:_Part_2",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": { "type": "text", "value": "Other films\/documentaries" },
								"href": "\/wiki\/Category:Films_(real-world)",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": { "type": "text", "value": "Harry Potter and Me" },
									"href": "\/wiki\/Harry_Potter_and_Me",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "The Queen's Handbag" },
									"href": "\/wiki\/The_Queen%27s_Handbag",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "J.K. Rowling: A Year in the Life"
									},
									"href": "\/wiki\/J.K._Rowling:_A_Year_in_the_Life",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Magic Beyond Words: The J.K. Rowling Story"
									},
									"href": "\/wiki\/Magic_Beyond_Words:_The_J.K._Rowling_Story",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": {
										"type": "text",
										"value": "Fantastic Beasts and Where to Find Them"
									},
									"href": "\/wiki\/Fantastic_Beasts_and_Where_to_Find_Them_(film_trilogy)",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": { "type": "text", "value": "Actors" },
								"href": "\/wiki\/Category:Actors_(real-world)",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": { "type": "text", "value": "Daniel Radcliffe" },
									"href": "\/wiki\/Daniel_Radcliffe",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Rupert Grint" },
									"href": "\/wiki\/Rupert_Grint",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Emma Watson" },
									"href": "\/wiki\/Emma_Watson",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Tom Felton" },
									"href": "\/wiki\/Tom_Felton",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Ralph Fiennes" },
									"href": "\/wiki\/Ralph_Fiennes",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Alan Rickman" },
									"href": "\/wiki\/Alan_Rickman",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Maggie Smith" },
									"href": "\/wiki\/Maggie_Smith",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Michael Gambon" },
									"href": "\/wiki\/Michael_Gambon",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": { "type": "text", "value": "Directors" },
								"href": "\/wiki\/Category:Directors_(real-world)",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": { "type": "text", "value": "Chris Columbus" },
									"href": "\/wiki\/Chris_Columbus",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Alfonso Cuar\u00f3n" },
									"href": "\/wiki\/Alfonso_Cuar%C3%B3n",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Mike Newell" },
									"href": "\/wiki\/Mike_Newell",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "David Yates" },
									"href": "\/wiki\/David_Yates",
									"tracking_label": "custom-level-3"
								}]
							}]
						}, {
							"type": "dropdown",
							"title": { "type": "text", "value": "Characters" },
							"href": "\/wiki\/Category:Individuals",
							"tracking_label": "custom-level-1",
							"items": [{
								"type": "dropdown",
								"title": { "type": "text", "value": "Students" },
								"href": "\/wiki\/Category:Hogwarts_students",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": { "type": "text", "value": "Harry Potter" },
									"href": "\/wiki\/Harry_Potter",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Hermione Granger" },
									"href": "\/wiki\/Hermione_Granger",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Ronald Weasley" },
									"href": "\/wiki\/Ronald_Weasley",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Ginny Weasley" },
									"href": "\/wiki\/Ginevra_Weasley",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Neville Longbottom" },
									"href": "\/wiki\/Neville_Longbottom",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Luna Lovegood" },
									"href": "\/wiki\/Luna_Lovegood",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": { "type": "text", "value": "Teachers" },
								"href": "\/wiki\/Category:Hogwarts_employees",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": { "type": "text", "value": "Minerva McGonagall" },
									"href": "\/wiki\/Minerva_McGonagall",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Severus Snape" },
									"href": "\/wiki\/Severus_Snape",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Filius Flitwick" },
									"href": "\/wiki\/Filius_Flitwick",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Pomona Sprout" },
									"href": "\/wiki\/Pomona_Sprout",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Horace Slughorn" },
									"href": "\/wiki\/Horace_Slughorn",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Rubeus Hagrid" },
									"href": "\/wiki\/Rubeus_Hagrid",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": { "type": "text", "value": "Order of the Phoenix" },
								"href": "\/wiki\/Category:Order_of_the_Phoenix",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": { "type": "text", "value": "Albus Dumbledore" },
									"href": "\/wiki\/Albus_Dumbledore",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Alastor Moody" },
									"href": "\/wiki\/Alastor_Moody",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Kingsley Shacklebolt" },
									"href": "\/wiki\/Kingsley_Shacklebolt",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Sirius Black" },
									"href": "\/wiki\/Sirius_Black",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Remus Lupin" },
									"href": "\/wiki\/Remus_Lupin",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Nymphadora Tonks" },
									"href": "\/wiki\/Nymphadora_Tonks",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": { "type": "text", "value": "Ministry of Magic" },
								"href": "\/wiki\/Category:Ministry_of_Magic_employees",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": { "type": "text", "value": "Rufus Scrimgeour" },
									"href": "\/wiki\/Rufus_Scrimgeour",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Cornelius Fudge" },
									"href": "\/wiki\/Cornelius_Fudge",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Dolores Umbridge" },
									"href": "\/wiki\/Dolores_Umbridge",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Pius Thicknesse" },
									"href": "\/wiki\/Pius_Thicknesse",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Barty Crouch Sr." },
									"href": "\/wiki\/Bartemius_Crouch_Sr.",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Arthur Weasley" },
									"href": "\/wiki\/Arthur_Weasley",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": { "type": "text", "value": "Death Eaters" },
								"href": "\/wiki\/Category:Death_Eaters",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": { "type": "text", "value": "Lord Voldemort" },
									"href": "\/wiki\/Tom_Riddle",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Bellatrix Lestrange" },
									"href": "\/wiki\/Bellatrix_Lestrange",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Lucius Malfoy" },
									"href": "\/wiki\/Lucius_Malfoy",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Draco Malfoy" },
									"href": "\/wiki\/Draco_Malfoy",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Peter Pettigrew" },
									"href": "\/wiki\/Peter_Pettigrew",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Antonin Dolohov" },
									"href": "\/wiki\/Antonin_Dolohov",
									"tracking_label": "custom-level-3"
								}]
							}, {
								"type": "dropdown",
								"title": { "type": "text", "value": "Muggles" },
								"href": "\/wiki\/Category:Muggles",
								"tracking_label": "custom-level-2",
								"items": [{
									"type": "link-text",
									"title": { "type": "text", "value": "Vernon Dursley" },
									"href": "\/wiki\/Vernon_Dursley",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Petunia Dursley" },
									"href": "\/wiki\/Petunia_Dursley",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Dudley Dursley" },
									"href": "\/wiki\/Dudley_Dursley",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Marjorie Dursley" },
									"href": "\/wiki\/Marjorie_Dursley",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Frank Bryce" },
									"href": "\/wiki\/Frank_Bryce",
									"tracking_label": "custom-level-3"
								}, {
									"type": "link-text",
									"title": { "type": "text", "value": "Tom Riddle Sr." },
									"href": "\/wiki\/Tom_Riddle_Sr.",
									"tracking_label": "custom-level-3"
								}]
							}]
						}, {
							"type": "dropdown",
							"title": { "type": "text", "value": "Community" },
							"href": "\/wiki\/Harry_Potter_Wiki:Community_portal",
							"tracking_label": "custom-level-1",
							"items": [{
								"type": "link-text",
								"title": { "type": "text", "value": "Forums" },
								"href": "\/wiki\/Forum:Harry_Potter_Wiki_Forums",
								"tracking_label": "custom-level-2"
							}, {
								"type": "link-text",
								"title": { "type": "text", "value": "Chat" },
								"href": "\/wiki\/Harry_Potter_Wiki:IRC",
								"tracking_label": "custom-level-2"
							}, {
								"type": "link-text",
								"title": { "type": "text", "value": "Policies" },
								"href": "\/wiki\/Harry_Potter_Wiki:Policy",
								"tracking_label": "custom-level-2"
							}, {
								"type": "link-text",
								"title": { "type": "text", "value": "Administrators" },
								"href": "\/wiki\/Harry_Potter_Wiki:Administrators",
								"tracking_label": "custom-level-2"
							}, {
								"type": "link-text",
								"title": { "type": "text", "value": "Help" },
								"href": "\/wiki\/Help:Editing",
								"tracking_label": "custom-level-2"
							}, {
								"type": "link-text",
								"title": { "type": "text", "value": "Sandbox" },
								"href": "\/wiki\/Harry_Potter_Wiki:Sandbox",
								"tracking_label": "custom-level-2"
							}, {
								"type": "link-text",
								"title": { "type": "text", "value": "Recent changes" },
								"href": "\/wiki\/Special:RecentChanges",
								"tracking_label": "custom-level-2"
							}]
						}, {
							"type": "dropdown",
							"title": {
								"type": "translatable-text",
								"key": "community-header-explore"
							},
							"image-data": { "type": "wds-svg", "name": "wds-icons-explore-tiny" },
							"items": [{
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "community-header-wiki-activity"
								},
								"href": "\/\/harrypotter.wikia.com\/wiki\/Special:WikiActivity",
								"tracking_label": "explore-activity"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "community-header-random-page"
								},
								"href": "\/\/harrypotter.wikia.com\/wiki\/Special:Random",
								"tracking_label": "explore-random"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "community-header-community"
								},
								"href": "\/\/harrypotter.wikia.com\/wiki\/Special:Community",
								"tracking_label": "explore-community"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "community-header-videos"
								},
								"href": "\/\/harrypotter.wikia.com\/wiki\/Special:Videos",
								"tracking_label": "explore-videos"
							}, {
								"type": "link-text",
								"title": {
									"type": "translatable-text",
									"key": "community-header-images"
								},
								"href": "\/\/harrypotter.wikia.com\/wiki\/Special:Images",
								"tracking_label": "explore-images"
							}]
						}, {
							"type": "link-text",
							"title": {
								"type": "translatable-text",
								"key": "community-header-discuss"
							},
							"href": "\/d\/f",
							"tracking_label": "discuss",
							"image-data": { "type": "wds-svg", "name": "wds-icons-reply-small" }
						}],
						"wordmark": {
							"type": "link-image",
							"href": "\/\/harrypotter.wikia.com\/wiki\/Main_Page",
							"image-data": {
								"type": "image-external",
								"url": "https:\/\/vignette4.wikia.nocookie.net\/harrypotter\/images\/8\/89\/Wiki-wordmark.png\/revision\/latest?cb=20170307181250",
								"width": "250",
								"height": "65"
							},
							"title": { "type": "text", "value": "Harry Potter Wiki" },
							"tracking_label": "wordmark-image"
						}
					}
				}
			};
			/* eslint-enable */
		} else if (key === 'wikiPage') {
			/* eslint-disable */
			return {
				"data": {
					"ns": 6,
					"isMainPage": false,
					"categories": [{
						"title": "User page images",
						"url": "/wiki/Category:User_page_images"
					}, {"title": "Forum images", "url": "/wiki/Category:Forum_images"}],
					"details": {
						"id": 159796,
						"title": "Example.jpg",
						"ns": 6,
						"url": "/wiki/File:Example.jpg",
						"revision": {
							"id": 1169096,
							"user": "Alex6122",
							"user_id": 3272780,
							"timestamp": "1308570199"
						},
						"comments": 0,
						"type": "image",
						"abstract": "Licensing This file was taken from the video game Fallout: New Vegas or from websites created...",
						"thumbnail": "https://vignette.wikia.nocookie.net/fallout/images/a/a9/Example.jpg/revision/latest/window-crop/width/200/x-offset/0/y-offset/0/window-width/438/window-height/438?cb=20100503114020",
						"original_dimensions": {"width": "438", "height": "599"},
						"description": "Licensing This file was taken from the video game Fallout: New Vegas or from websites created..."
					},
					"articleType": "",
					"adsContext": {
						"opts": {
							"adsInContent": 1,
							"delayBtf": true,
							"enableAdsInMaps": true,
							"pageType": "all_ads",
							"showAds": true,
							"yavliUrl": "http://sandbox-xw2.fallout.wikia.com/__load/-/cb%3D1491394449%26debug%3Dfalse%26lang%3Den%26only%3Dscripts%26skin%3Dwikiamobile/8c56a18a3638374dd6308c11d4b3891e",
							"prebidBidderUrl": ["http://sandbox-xw2.slot1.wikia.com/__am/1491394449/group/-/prebid_prod_js"]
						},
						"targeting": {
							"enableKruxTargeting": true,
							"enablePageCategories": true,
							"esrbRating": "mature",
							"mappedVerticalName": "gaming",
							"pageArticleId": 159796,
							"pageIsArticle": true,
							"pageName": "File:Example.jpg",
							"pageType": "file",
							"skin": "mercury",
							"wikiCategory": "gaming",
							"wikiCustomKeyValues": "sex=m;age=under18;age=18-24;age=25-34;age=18-34;age=teen;pform=xboxone;pform=ps4;pform=pc;pform=xbox360;pform=ps3;pform=mobile;gnre=3rdpersonshooter;gnre=action;gnre=adventure;gnre=fps;gnre=openworld;gnre=rpg;gnre=scifi;gnre=shooter;esrb=mature;pub=bethesda;theme=mature;theme=military;theme=postapocalypse;theme=robots",
							"wikiDbName": "fallout",
							"wikiIsTop1000": true,
							"wikiLanguage": "en",
							"wikiVertical": "games",
							"newWikiCategories": ["gaming"]
						},
						"providers": {"rubiconFastlane": true},
						"slots": {
							"exitstitial": true,
							"exitstitialRedirectDelay": 30,
							"invisibleHighImpact": true
						},
						"forcedProvider": null
					},
					"htmlTitle": "Image - Example.jpg",
					"nsSpecificContent": {
						"fileUsageList": [{
							"title": "Structure",
							"id": "549718",
							"namespace_id": "1",
							"wiki": "Fallout Wiki",
							"wikiUrl": "http://sandbox-xw2.fallout.wikia.com",
							"titleDBkey": "Talk:Structure",
							"titleText": "Talk:Structure",
							"articleId": 549718,
							"imageUrl": "https://vignette.wikia.nocookie.net/fallout/images/a/a9/Example.jpg/revision/latest/window-crop/width/200/x-offset/0/y-offset/60/window-width/438/window-height/219?cb=20100503114020",
							"url": "http://sandbox-xw2.fallout.wikia.com/wiki/Talk:Structure",
							"snippet": "I've been looking at updating the crafting section of this article and the best fit I could come..."
						}, {
							"title": "RyzerScoots999",
							"id": "148881",
							"namespace_id": "2",
							"wiki": "Fallout Wiki",
							"wikiUrl": "http://sandbox-xw2.fallout.wikia.com",
							"titleDBkey": "User:RyzerScoots999",
							"titleText": "User:RyzerScoots999",
							"articleId": 148881,
							"imageUrl": "http://static.wikia.nocookie.net/1268164d-07fe-4c45-a350-4e589417e616/scale-to-width-down/200px-0,100,10,60",
							"url": "http://sandbox-xw2.fallout.wikia.com/wiki/User:RyzerScoots999",
							"snippet": ""
						}, {
							"title": "Scootisspah/sandbox",
							"id": "137320",
							"namespace_id": "2",
							"wiki": "Fallout Wiki",
							"wikiUrl": "http://sandbox-xw2.fallout.wikia.com",
							"titleDBkey": "User:Scootisspah/sandbox",
							"titleText": "User:Scootisspah/sandbox",
							"articleId": 137320,
							"imageUrl": "http://static.wikia.nocookie.net/3dbf6ef7-6d9e-46e2-ba30-2fea6034ee58/scale-to-width-down/200px-0,100,10,60",
							"url": "http://sandbox-xw2.fallout.wikia.com/wiki/User:Scootisspah/sandbox",
							"snippet": "What an incredibly fun page to write on :P Arcade Gannon is awesome THIS TEXT IS BOLD AND..."
						}],
						"fileUsageListSeeMoreUrl": "/wiki/Special:WhatLinksHere/File:Example.jpg",
						"media": {
							"type": "image",
							"url": "https://vignette.wikia.nocookie.net/fallout/images/a/a9/Example.jpg/revision/latest?cb=20100503114020",
							"fileUrl": "http://sandbox-xw2.fallout.wikia.com/wiki/File:Example.jpg",
							"title": "Example.jpg",
							"user": "PontusJohansson",
							"href": "https://vignette.wikia.nocookie.net/fallout/images/a/a9/Example.jpg/revision/latest?cb=20100503114020",
							"isLinkedByUser": false,
							"width": 438,
							"height": 599
						}
					}
				}
			};
			/* eslint-enable */
		}
		return undefined;
	};
}
