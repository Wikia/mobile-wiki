import Ember from 'ember';

export default Ember.Test.registerHelper('mockFastbootService', () => {
	mockService(Ember.Service.extend({
		shoebox: {
			retrieve(key) {
				if (key === 'wikiVariables') {
					return {
						"cacheBuster": 1491394449,
						"contentNamespaces": [0, "114"],
						"dbName": "fallout",
						"defaultSkin": "oasis",
						"disableAnonymousEditing": false,
						"disableAnonymousUploadForMercury": false,
						"disableMobileSectionEditor": false,
						"enableCommunityData": true,
						"enableDiscussions": true,
						"enableOnSiteNotifications": true,
						"enableNewAuth": true,
						"favicon": "https://vignette3.wikia.nocookie.net/fallout/images/6/64/Favicon.ico/revision/latest?cb=20120126213838",
						"homepage": "http://www.wikia.com/fandom",
						"id": 3035,
						"isCoppaWiki": false,
						"isDarkTheme": false,
						"language": {"content": "en", "contentDir": "ltr"},
						"mainPageTitle": "Fallout_Wiki",
						"namespaces": {
							"0": "",
							"1": "Talk",
							"2": "User",
							"3": "User_talk",
							"4": "Fallout_Wiki",
							"5": "Fallout_Wiki_talk",
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
							"112": "Portal",
							"113": "Portal_talk",
							"114": "ModelData",
							"115": "ModelData_talk",
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
						"siteName": "Fallout Wiki",
						"theme": {
							"color-body": "#c9cdac",
							"color-body-middle": "#c9cdac",
							"color-page": "#ffffff",
							"color-buttons": "#006722",
							"color-links": "#002bb8",
							"color-header": "#044d22",
							"background-image": "http://img4.wikia.nocookie.net/__cb39/fallout/images/5/50/Wiki-background",
							"background-image-width": "556",
							"background-image-height": "714",
							"background-dynamic": "1",
							"page-opacity": "100"
						},
						"tracking": {
							"vertical": "games",
							"comscore": {"c7Value": "wikiacsid_fallout"},
							"ivw3": {"countries": ["AT", "CH"], "cmKey": "games/pc"},
							"nielsen": {"enabled": false, "apid": "FIXME"},
							"netzathleten": {
								"enabled": true,
								"url": "//s.adadapter.netzathleten-media.de/API-1.0/NA-828433-1/naMediaAd.js"
							}
						},
						"wikiCategories": [],
						"localNav": [{
							"text": "News",
							"href": "/wiki/Portal:Live_News_Portal",
							"children": [{
								"text": "Fallout and Wiki news page",
								"href": "/wiki/Portal:Live_News_Portal"
							}]
						}, {
							"text": "Fallout games",
							"href": "/wiki/Fallout_series",
							"children": [{
								"text": "Classic Games",
								"href": "/wiki/Classic_Games",
								"children": [{"text": "Fallout", "href": "/wiki/Portal:Fallout"}, {
									"text": "Fallout 2",
									"href": "/wiki/Portal:Fallout_2"
								}, {"text": "Fallout Tactics", "href": "/wiki/Portal:Fallout_Tactics"}]
							}, {
								"text": "Fallout 3",
								"href": "/wiki/Portal:Fallout_3",
								"children": [{
									"text": "Add-ons (DLC)",
									"href": "/wiki/Fallout_3_add-ons"
								}, {"text": "Characters", "href": "/wiki/Fallout_3_characters"}, {
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
								}, {"text": "Factions", "href": "/wiki/Fallout:_New_Vegas_factions"}, {
									"text": "Items",
									"href": "/wiki/Fallout:_New_Vegas_items"
								}, {
									"text": "Locations",
									"href": "/wiki/Fallout:_New_Vegas_locations"
								}, {"text": "Quests", "href": "/wiki/Fallout:_New_Vegas_quests"}, {
									"text": "SPECIAL",
									"href": "/wiki/Fallout:_New_Vegas_SPECIAL"
								}]
							}, {
								"text": "Shelter",
								"href": "/wiki/Portal:Fallout_Shelter",
								"children": [{
									"text": "Characters",
									"href": "/wiki/Fallout_Shelter_characters"
								}, {"text": "Outfits", "href": "/wiki/Fallout_Shelter_outfits"}, {
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
								"children": [{"text": "Boston", "href": "/wiki/Boston"}, {
									"text": "The Commonwealth",
									"href": "/wiki/The_Commonwealth"
								}, {
									"text": "Diamond City",
									"href": "/wiki/Diamond_City"
								}, {
									"text": "Massachusetts State House",
									"href": "/wiki/Massachusetts_State_House"
								}, {"text": "Memory Den", "href": "/wiki/Memory_Den"}, {
									"text": "Paul Revere Monument",
									"href": "/wiki/Paul_Revere_Monument"
								}, {"text": "Power Noodles", "href": "/wiki/Power_Noodles"}, {
									"text": "Scollay Square",
									"href": "/wiki/Scollay_Square"
								}, {"text": "USS Constitution", "href": "/wiki/USS_Constitution"}, {
									"text": "Vault 111",
									"href": "/wiki/Vault_111"
								}]
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
								}, {"text": "Dogmeat", "href": "/wiki/Dogmeat_(Fallout_4)"}, {
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
									"text": "Fallout 4 gameplay help",
									"href": "/wiki/Forum:Fallout_4_gameplay_help"
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
								}, {"text": "Fallout world discussion", "href": "/wiki/Forum:Fallout_world_discussion"}]
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
						"isGASpecialWiki": true,
						"articlePath": "/wiki/",
						"smartBanner": {
							"disabled": 0,
							"name": "Wikia: Fallout 4 Fan App",
							"icon": "https://vignette.wikia.nocookie.net/outwiki_image_hosting_00/images/2/27/ios_image-fallout/revision/latest",
							"appId": {"ios": "1002376814", "android": "com.wikia.singlewikia.fallout"},
							"appScheme": {"ios": null, "android": null}
						},
						"image": "https://vignette2.wikia.nocookie.net/fallout/images/c/c1/Fallout_launch.jpg/revision/latest/window-crop/width/500/x-offset/208/y-offset/0/window-width/1338/window-height/1337?cb=20170307014046",
						"specialRobotPolicy": "noindex,nofollow",
						"htmlTitle": {"separator": " | ", "parts": ["Fallout Wiki", "Fandom powered by Wikia"]},
						"host": "fallout.wikia.com",
						"globalFooter": {
							"header": {
								"type": "link-image",
								"image": "wds-company-logo-fandom-powered-by-wikia-two-lines",
								"image-data": {
									"type": "wds-svg",
									"name": "wds-company-logo-fandom-powered-by-wikia-two-lines"
								},
								"href": "http://fandom.wikia.com",
								"title": {"type": "text", "value": "Fandom powered by Wikia"},
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
									"href": "http://www.wikia.com/about",
									"tracking_label": "company-overview.about"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-company-overview-link-careers"
									},
									"href": "http://careers.wikia.com",
									"tracking_label": "company-overview.careers"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-company-overview-link-press"
									},
									"href": "http://fandom.wikia.com/press",
									"tracking_label": "company-overview.press"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-company-overview-link-contact"
									},
									"href": "http://fandom.wikia.com/contact",
									"tracking_label": "company-overview.contact"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-company-overview-link-wikia-org"
									},
									"href": "http://wikia.org",
									"tracking_label": "company-overview.wikia-org"
								}]
							},
							"site_overview": {
								"links": [{
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-site-overview-link-terms-of-use"
									},
									"href": "http://www.wikia.com/Terms_of_use",
									"tracking_label": "site-overview.terms-of-use"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-site-overview-link-privacy-policy"
									},
									"href": "http://www.wikia.com/Privacy_Policy",
									"tracking_label": "site-overview.privacy-policy"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-site-overview-link-global-sitemap"
									},
									"href": "http://www.wikia.com/Sitemap",
									"tracking_label": "site-overview.global-sitemap"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-site-overview-link-local-sitemap"
									},
									"href": "/wiki/Local_Sitemap",
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
									"href": "http://www.wikia.com/Special:CreateNewWiki",
									"tracking_label": "start-a-wiki"
								}]
							},
							"community_apps": {
								"header": {
									"type": "line-text",
									"title": {"type": "translatable-text", "key": "global-footer-community-apps-header"}
								},
								"description": {
									"type": "translatable-text",
									"key": "global-footer-community-apps-description"
								},
								"links": [{
									"type": "link-image",
									"image": "wds-company-store-appstore",
									"image-data": {"type": "wds-svg", "name": "wds-company-store-appstore"},
									"title": {
										"type": "translatable-text",
										"key": "global-footer-community-apps-link-app-store"
									},
									"href": "https://itunes.apple.com/developer/wikia-inc./id422467077",
									"tracking_label": "community-apps.app-store"
								}, {
									"type": "link-image",
									"image": "wds-company-store-googleplay",
									"image-data": {"type": "wds-svg", "name": "wds-company-store-googleplay"},
									"title": {
										"type": "translatable-text",
										"key": "global-footer-community-apps-link-google-play"
									},
									"href": "https://play.google.com/store/apps/developer?id=Fandom+powered+by+Wikia",
									"tracking_label": "community-apps.google-play"
								}]
							},
							"licensing_and_vertical": {
								"description": {
									"type": "translatable-text",
									"key": "global-footer-licensing-and-vertical-description",
									"params": {
										"sitename": {"type": "text", "value": "Fallout Wiki"},
										"vertical": {
											"type": "translatable-text",
											"key": "global-footer-licensing-and-vertical-description-param-vertical-games"
										},
										"license": {
											"type": "link-text",
											"title": {"type": "text", "value": "CC-BY-SA"},
											"href": "http://www.wikia.com/Licensing",
											"tracking_label": "license"
										}
									}
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
									"href": "http://fandom.wikia.com/games",
									"tracking_label": "fandom-overview.games"
								}, {
									"type": "link-branded",
									"brand": "movies",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-fandom-overview-link-vertical-movies"
									},
									"href": "http://fandom.wikia.com/movies",
									"tracking_label": "fandom-overview.movies"
								}, {
									"type": "link-branded",
									"brand": "tv",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-fandom-overview-link-vertical-tv"
									},
									"href": "http://fandom.wikia.com/tv",
									"tracking_label": "fandom-overview.tv"
								}, {
									"type": "link-branded",
									"brand": "explore-wikis",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-fandom-overview-link-explore-wikis"
									},
									"href": "http://fandom.wikia.com/explore",
									"tracking_label": "fandom-overview.explore-wikis"
								}]
							},
							"follow_us": {
								"header": {
									"type": "line-text",
									"title": {"type": "translatable-text", "key": "global-footer-follow-us-header"}
								},
								"links": [{
									"type": "link-image",
									"image": "wds-icons-facebook",
									"image-data": {"type": "wds-svg", "name": "wds-icons-facebook"},
									"title": {
										"type": "translatable-text",
										"key": "global-footer-follow-us-link-facebook"
									},
									"href": "https://www.facebook.com/getfandom",
									"tracking_label": "follow-us.facebook"
								}, {
									"type": "link-image",
									"image": "wds-icons-twitter",
									"image-data": {"type": "wds-svg", "name": "wds-icons-twitter"},
									"title": {
										"type": "translatable-text",
										"key": "global-footer-follow-us-link-twitter"
									},
									"href": "https://twitter.com/getfandom",
									"tracking_label": "follow-us.twitter"
								}, {
									"type": "link-image",
									"image": "wds-icons-youtube",
									"image-data": {"type": "wds-svg", "name": "wds-icons-youtube"},
									"title": {
										"type": "translatable-text",
										"key": "global-footer-follow-us-link-youtube"
									},
									"href": "https://www.youtube.com/channel/UC988qTQImTjO7lUdPfYabgQ",
									"tracking_label": "follow-us.youtube"
								}, {
									"type": "link-image",
									"image": "wds-icons-instagram",
									"image-data": {"type": "wds-svg", "name": "wds-icons-instagram"},
									"title": {
										"type": "translatable-text",
										"key": "global-footer-follow-us-link-instagram"
									},
									"href": "https://www.instagram.com/getfandom/",
									"tracking_label": "follow-us.instagram"
								}, {
									"type": "link-image",
									"image": "wds-icons-linkedin",
									"image-data": {"type": "wds-svg", "name": "wds-icons-linkedin"},
									"title": {
										"type": "translatable-text",
										"key": "global-footer-follow-us-link-linkedin"
									},
									"href": "https://www.linkedin.com/company/157252",
									"tracking_label": "follow-us.linkedin"
								}]
							},
							"community": {
								"header": {
									"type": "line-text",
									"title": {"type": "translatable-text", "key": "global-footer-community-header"}
								},
								"links": [{
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-community-link-community-central"
									},
									"href": "http://community.wikia.com/wiki/Community_Central",
									"tracking_label": "community.community-central"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-community-link-support"
									},
									"href": "http://community.wikia.com/wiki/Special:Contact",
									"tracking_label": "community.support"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-community-link-fan-contributor-program"
									},
									"href": "http://fandom.wikia.com/fan-contributor",
									"tracking_label": "community.fan-contributor"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-community-link-wam-score"
									},
									"href": "http://www.wikia.com/WAM",
									"tracking_label": "community.wam"
								}, {
									"type": "link-text",
									"title": {"type": "translatable-text", "key": "global-footer-community-link-help"},
									"href": "http://community.wikia.com/wiki/Help:Contents",
									"tracking_label": "community.help"
								}]
							},
							"advertise": {
								"header": {
									"type": "line-text",
									"title": {"type": "translatable-text", "key": "global-footer-advertise-header"}
								},
								"links": [{
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-advertise-link-media-kit"
									},
									"href": "http://www.wikia.com/mediakit",
									"tracking_label": "advertise.media-kit"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-footer-advertise-link-contact"
									},
									"href": "http://www.wikia.com/mediakit/contact",
									"tracking_label": "advertise.contact"
								}]
							}
						},
						"globalNavigation": {
							"logo": {
								"header": {
									"type": "link-image",
									"href": "http://fandom.wikia.com",
									"image": "wds-company-logo-fandom-powered-by-wikia",
									"image-data": {
										"type": "wds-svg",
										"name": "wds-company-logo-fandom-powered-by-wikia"
									},
									"title": {"type": "text", "value": "Fandom powered by Wikia"},
									"tracking_label": "logo"
								},
								"module": {
									"type": "logo",
									"main": {
										"type": "link-image",
										"href": "http://fandom.wikia.com",
										"image": "wds-company-logo-fandom",
										"image-data": {"type": "wds-svg", "name": "wds-company-logo-fandom"},
										"title": {"type": "text", "value": "Fandom powered by Wikia"},
										"tracking_label": "logo"
									},
									"tagline": {
										"type": "link-image",
										"href": "http://fandom.wikia.com",
										"image-data": {"type": "wds-svg", "name": "wds-company-logo-powered-by-wikia"},
										"title": {"type": "text", "value": "Fandom powered by Wikia"},
										"tracking_label": "logo-tagline"
									}
								}
							},
							"search": {
								"module": {
									"type": "search",
									"results": {
										"url": "http://fallout.wikia.com/wiki/Special:Search?fulltext=Search",
										"param-name": "query",
										"tracking_label": "search"
									},
									"placeholder-inactive": {
										"type": "translatable-text",
										"key": "global-navigation-search-placeholder-inactive"
									},
									"placeholder-active": {
										"type": "translatable-text",
										"key": "global-navigation-search-placeholder-in-wiki",
										"params": {"sitename": {"type": "text", "value": "Fallout Wiki"}}
									},
									"suggestions": {
										"url": "http://fallout.wikia.com/index.php?action=ajax\u0026rs=getLinkSuggest\u0026format=json",
										"param-name": "query",
										"tracking_label": "search-suggestion"
									}
								}
							},
							"create_wiki": {
								"header": {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-navigation-create-wiki-link-start-wikia"
									},
									"href": "http://www.wikia.com/Special:CreateNewWiki",
									"tracking_label": "start-a-wiki"
								}
							},
							"fandom_overview": {
								"links": [{
									"type": "link-branded",
									"brand": "games",
									"title": {
										"type": "translatable-text",
										"key": "global-navigation-fandom-overview-link-vertical-games"
									},
									"href": "http://fandom.wikia.com/games",
									"tracking_label": "link.games"
								}, {
									"type": "link-branded",
									"brand": "movies",
									"title": {
										"type": "translatable-text",
										"key": "global-navigation-fandom-overview-link-vertical-movies"
									},
									"href": "http://fandom.wikia.com/movies",
									"tracking_label": "link.movies"
								}, {
									"type": "link-branded",
									"brand": "tv",
									"title": {
										"type": "translatable-text",
										"key": "global-navigation-fandom-overview-link-vertical-tv"
									},
									"href": "http://fandom.wikia.com/tv",
									"tracking_label": "link.tv"
								}]
							},
							"wikis": {
								"header": {
									"type": "line-text",
									"title": {"type": "translatable-text", "key": "global-navigation-wikis-header"},
									"tracking_label": "link.wikis"
								},
								"links": [{
									"type": "link-text",
									"title": {"type": "translatable-text", "key": "global-navigation-wikis-explore"},
									"href": "http://fandom.wikia.com/explore",
									"tracking_label": "link.explore"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-navigation-wikis-community-central"
									},
									"href": "http://community.wikia.com/wiki/Community_Central",
									"tracking_label": "link.community-central"
								}, {
									"type": "link-text",
									"title": {
										"type": "translatable-text",
										"key": "global-navigation-wikis-fandom-university"
									},
									"href": "http://community.wikia.com/wiki/Fandom_University",
									"tracking_label": "link.fandom-university"
								}]
							},
							"anon": {
								"header": {
									"type": "line-image",
									"image": "wds-icons-user",
									"image-data": {"type": "wds-svg", "name": "wds-icons-user"},
									"title": {"type": "translatable-text", "key": "global-navigation-anon-my-account"},
									"subtitle": {
										"type": "translatable-text",
										"key": "global-navigation-anon-my-account"
									},
									"tracking_label": "account"
								},
								"links": [{
									"type": "link-authentication",
									"title": {"type": "translatable-text", "key": "global-navigation-anon-sign-in"},
									"href": "http://www.wikia.com/signin",
									"param-name": "redirect",
									"tracking_label": "account.sign-in"
								}, {
									"type": "link-authentication",
									"title": {"type": "translatable-text", "key": "global-navigation-anon-register"},
									"subtitle": {
										"type": "translatable-text",
										"key": "global-navigation-anon-register-description"
									},
									"href": "http://www.wikia.com/register",
									"param-name": "redirect",
									"tracking_label": "account.register"
								}]
							}
						}
					};
				} else if (key === 'wikiPage') {
					return {"data":{"ns":6,"isMainPage":false,"categories":[{"title":"User page images","url":"/wiki/Category:User_page_images"},{"title":"Forum images","url":"/wiki/Category:Forum_images"}],"details":{"id":159796,"title":"Example.jpg","ns":6,"url":"/wiki/File:Example.jpg","revision":{"id":1169096,"user":"Alex6122","user_id":3272780,"timestamp":"1308570199"},"comments":0,"type":"image","abstract":"Licensing This file was taken from the video game Fallout: New Vegas or from websites created...","thumbnail":"https://vignette2.wikia.nocookie.net/fallout/images/a/a9/Example.jpg/revision/latest/window-crop/width/200/x-offset/0/y-offset/0/window-width/438/window-height/438?cb=20100503114020","original_dimensions":{"width":"438","height":"599"},"description":"Licensing This file was taken from the video game Fallout: New Vegas or from websites created..."},"articleType":"","adsContext":{"opts":{"adsInContent":1,"delayBtf":true,"enableAdsInMaps":true,"pageType":"all_ads","showAds":true,"sourcePointDetectionUrl":"http://sandbox-xw2.fallout.wikia.com/__load/-/cb%3D1491394449%26debug%3Dfalse%26lang%3Den%26only%3Dscripts%26skin%3Dwikiamobile/fde9cd08c8d4722e90ee6059dac8c6b2","yavliUrl":"http://sandbox-xw2.fallout.wikia.com/__load/-/cb%3D1491394449%26debug%3Dfalse%26lang%3Den%26only%3Dscripts%26skin%3Dwikiamobile/8c56a18a3638374dd6308c11d4b3891e","pageFairDetectionUrl":"http://sandbox-xw2.fallout.wikia.com/__load/-/cb%3D1491394449%26debug%3Dfalse%26lang%3Den%26only%3Dscripts%26skin%3Dwikiamobile/261805554227e47846605169b2b93aff","prebidBidderUrl":["http://sandbox-xw2.slot1.wikia.com/__am/1491394449/group/-/prebid_prod_js"],"sourcePointRecovery":false,"sourcePointMMS":false,"sourcePointMMSDomain":"mms.bre.wikia.com","pageFairRecovery":false},"targeting":{"enableKruxTargeting":true,"enablePageCategories":true,"esrbRating":"mature","mappedVerticalName":"gaming","pageArticleId":159796,"pageIsArticle":true,"pageName":"File:Example.jpg","pageType":"file","skin":"mercury","wikiCategory":"gaming","wikiCustomKeyValues":"sex=m;age=under18;age=18-24;age=25-34;age=18-34;age=teen;pform=xboxone;pform=ps4;pform=pc;pform=xbox360;pform=ps3;pform=mobile;gnre=3rdpersonshooter;gnre=action;gnre=adventure;gnre=fps;gnre=openworld;gnre=rpg;gnre=scifi;gnre=shooter;esrb=mature;pub=bethesda;theme=mature;theme=military;theme=postapocalypse;theme=robots","wikiDbName":"fallout","wikiIsTop1000":true,"wikiLanguage":"en","wikiVertical":"games","newWikiCategories":["gaming"]},"providers":{"evolve2":true,"rubiconFastlane":true},"slots":{"exitstitial":true,"exitstitialRedirectDelay":30,"invisibleHighImpact":true},"forcedProvider":null},"htmlTitle":"Image - Example.jpg","nsSpecificContent":{"fileUsageList":[{"title":"Structure","id":"549718","namespace_id":"1","wiki":"Fallout Wiki","wikiUrl":"http://sandbox-xw2.fallout.wikia.com","titleDBkey":"Talk:Structure","titleText":"Talk:Structure","articleId":549718,"imageUrl":"https://vignette2.wikia.nocookie.net/fallout/images/a/a9/Example.jpg/revision/latest/window-crop/width/200/x-offset/0/y-offset/60/window-width/438/window-height/219?cb=20100503114020","url":"http://sandbox-xw2.fallout.wikia.com/wiki/Talk:Structure","snippet":"I've been looking at updating the crafting section of this article and the best fit I could come..."},{"title":"RyzerScoots999","id":"148881","namespace_id":"2","wiki":"Fallout Wiki","wikiUrl":"http://sandbox-xw2.fallout.wikia.com","titleDBkey":"User:RyzerScoots999","titleText":"User:RyzerScoots999","articleId":148881,"imageUrl":"http://static.wikia.nocookie.net/1268164d-07fe-4c45-a350-4e589417e616/scale-to-width-down/200px-0,100,10,60","url":"http://sandbox-xw2.fallout.wikia.com/wiki/User:RyzerScoots999","snippet":""},{"title":"Scootisspah/sandbox","id":"137320","namespace_id":"2","wiki":"Fallout Wiki","wikiUrl":"http://sandbox-xw2.fallout.wikia.com","titleDBkey":"User:Scootisspah/sandbox","titleText":"User:Scootisspah/sandbox","articleId":137320,"imageUrl":"http://static.wikia.nocookie.net/3dbf6ef7-6d9e-46e2-ba30-2fea6034ee58/scale-to-width-down/200px-0,100,10,60","url":"http://sandbox-xw2.fallout.wikia.com/wiki/User:Scootisspah/sandbox","snippet":"What an incredibly fun page to write on :P Arcade Gannon is awesome THIS TEXT IS BOLD AND..."}],"fileUsageListSeeMoreUrl":"/wiki/Special:WhatLinksHere/File:Example.jpg","media":{"type":"image","url":"https://vignette2.wikia.nocookie.net/fallout/images/a/a9/Example.jpg/revision/latest?cb=20100503114020","fileUrl":"http://sandbox-xw2.fallout.wikia.com/wiki/File:Example.jpg","title":"Example.jpg","user":"PontusJohansson","href":"https://vignette2.wikia.nocookie.net/fallout/images/a/a9/Example.jpg/revision/latest?cb=20100503114020","isLinkedByUser":false,"width":438,"height":599}}}};
				}
			}
		}
	}), 'fastboot');
});
