import {getOwner} from '@ember/application';
import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';
import sinon from 'sinon';
import WikiaNavModel from 'mobile-wiki/models/wikia-nav';

module('Unit | Model | wikia nav', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(function () {
		this.owner.register('test-container:wikia-nav-model', WikiaNavModel, {
			singleton: false
		});

		this.subject = function () {
			return this.owner.lookup('test-container:wikia-nav-model');
		};
	});

	const hubsLinksMock = [{
		title: {
			key: 'global-navigation-fandom-overview-link-vertical-games'
		},
		href: 'http://fandom.wikia.com/games',
		brand: 'games'
	}];

	const exploreWikisMock = {
		header: {
			title: {
				key: 'global-navigation-wikis-header'
			}
		},
		links: [{
			title: {
				key: 'global-navigation-wikis-explore'
			},
			href: 'http://fandom.wikia.com/explore',
			trackingLabel: 'global-navigation-wikis-explore'
		}]
	};

	const exploreWikisLabelMock = 'global-navigation-wikis-header';

	function testZeroState(assert, langPath = '') {
		const cases = [
			{
				mock: {
					hubsLinks: [],
					localLinks: [],
					exploreWikis: [],
					exploreWikisLabel: '',
					discussionsEnabled: false,
					wikiName: '',
					i18n: {
						t(key) {
							return key;
						}
					}
				},
				expected: [
					{
						actionId: 'onRandomPageClick',
						name: 'navigation.random-page-label',
						trackLabel: 'random-page',
						type: 'nav-menu-item'
					}
				],
				message: 'Empty api results'
			},
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`
					}],
					exploreWikis: exploreWikisMock,
					discussionsEnabled: false,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test',
					i18n: {
						t(key) {
							return key;
						}
					},
					wikiVariables: {
						mainPageTitle: 'Main_Page'
					}
				},
				expected: [
					{
						className: 'nav-menu--external nav-menu--games',
						href: 'http://fandom.wikia.com/games',
						name: 'global-navigation-fandom-overview-link-vertical-games',
						trackLabel: 'open-hub-global-navigation-fandom-overview-link-vertical-games',
						type: 'nav-menu-external'
					},
					{
						className: 'nav-menu--explore',
						index: 0,
						name: 'global-navigation-wikis-header',
						trackLabel: 'open-global-navigation-wikis-header',
						type: 'nav-menu-root'
					},
					{
						name: 'navigation.explore-wiki',
						type: 'nav-menu-header',
						route: 'wiki-page',
						href: 'Main_Page'
					},
					{
						href: 'Test_1',
						index: 1,
						route: 'wiki-page',
						name: 'Test 1',
						trackLabel: 'local-nav-open-link-index-1',
						type: 'nav-menu-item'
					},
					{
						actionId: 'onRandomPageClick',
						name: 'navigation.random-page-label',
						trackLabel: 'random-page',
						type: 'nav-menu-item'
					}
				],
				message: 'Full nav visible, discussions disabled'
			},
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`
					}],
					exploreWikis: exploreWikisMock,
					discussionsEnabled: true,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test',
					i18n: {
						t(key) {
							return key;
						}
					},
					wikiVariables: {
						mainPageTitle: 'Main_Page'
					}
				},
				expected: [
					{
						className: 'nav-menu--external nav-menu--games',
						href: 'http://fandom.wikia.com/games',
						name: 'global-navigation-fandom-overview-link-vertical-games',
						trackLabel: 'open-hub-global-navigation-fandom-overview-link-vertical-games',
						type: 'nav-menu-external'
					},
					{
						className: 'nav-menu--explore',
						index: 0,
						name: 'global-navigation-wikis-header',
						trackLabel: 'open-global-navigation-wikis-header',
						type: 'nav-menu-root'
					},
					{
						name: 'navigation.explore-wiki',
						type: 'nav-menu-header',
						route: 'wiki-page',
						href: 'Main_Page'
					},
					{
						type: 'nav-menu-external',
						href: `${langPath}/d/f`,
						name: 'app.discussions-label',
						trackCategory: 'discussion',
						trackLabel: 'local-nav'
					},
					{
						href: 'Test_1',
						index: 1,
						route: 'wiki-page',
						name: 'Test 1',
						trackLabel: 'local-nav-open-link-index-1',
						type: 'nav-menu-item'
					},
					{
						actionId: 'onRandomPageClick',
						name: 'navigation.random-page-label',
						trackLabel: 'random-page',
						type: 'nav-menu-item'
					}
				],
				message: 'Full nav visible, discussions enabled'
			},
			{
				mock: {
					hubsLinks: [],
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					discussionsEnabled: false,
					wikiName: 'Test',
					i18n: {
						t(key) {
							return key;
						}
					},
					wikiVariables: {
						mainPageTitle: 'Main_Page'
					}
				},
				expected: [
					{
						index: 0,
						name: 'global-navigation-wikis-header',
						trackLabel: 'open-global-navigation-wikis-header',
						type: 'nav-menu-root',
						className: 'nav-menu--explore'
					},
					{
						name: 'navigation.explore-wiki',
						type: 'nav-menu-header',
						route: 'wiki-page',
						href: 'Main_Page'
					},
					{
						href: 'Test_1',
						index: 1,
						route: 'wiki-page',
						name: 'Test 1',
						trackLabel: 'local-nav-open-link-index-1',
						type: 'nav-menu-item'
					},
					{
						actionId: 'onRandomPageClick',
						name: 'navigation.random-page-label',
						trackLabel: 'random-page',
						type: 'nav-menu-item'
					}
				],
				message: 'Hubs hidden when not returned from DS API'
			},
			{
				mock: {
					hubsLinks: [],
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`
					}],
					exploreWikis: {
						links: [{
							title: {
								key: 'global-navigation-wikis-explore'
							},
							href: 'http://fandom.wikia.com/explore',
							trackingLabel: 'global-navigation-wikis-explore'
						}]
					},
					exploreWikisLabel: exploreWikisLabelMock,
					discussionsEnabled: false,
					wikiName: 'Test',
					i18n: {
						t(key) {
							return key;
						}
					},
					wikiVariables: {
						mainPageTitle: 'Main_Page'
					}
				},
				expected: [
					{
						className: 'nav-menu--external',
						href: 'http://fandom.wikia.com/explore',
						name: 'global-navigation-wikis-explore',
						trackLabel: 'open-global-navigation-wikis-explore',
						type: 'nav-menu-external'
					},
					{
						name: 'navigation.explore-wiki',
						type: 'nav-menu-header',
						route: 'wiki-page',
						href: 'Main_Page'
					},
					{
						href: 'Test_1',
						index: 1,
						route: 'wiki-page',
						name: 'Test 1',
						trackLabel: 'local-nav-open-link-index-1',
						type: 'nav-menu-item'
					},
					{
						actionId: 'onRandomPageClick',
						name: 'navigation.random-page-label',
						trackLabel: 'random-page',
						type: 'nav-menu-item'
					}
				],
				message: 'Show the first link when there is no header for wikis section'
			}
		];

		cases.forEach((testCase) => {
			const nav = this.subject();

			nav.setProperties(testCase.mock);

			assert.deepEqual(nav.get('items'), testCase.expected, testCase.message);
		});
	}

	function testLocalSuvNavTransition(assert, langPath = '') {
		const cases = [
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test',
					i18n: {
						t(key) {
							return key;
						}
					}
				},
				path: [0],
				expected: [
					{
						href: 'http://fandom.wikia.com/explore',
						name: 'global-navigation-wikis-explore',
						trackLabel: 'open-global-navigation-wikis-explore',
						type: 'nav-menu-external'
					}
				],
				message: 'Explore nav displayed'
			},
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`,
						children: [
							{
								text: 'Test 2',
								href: `${langPath}/wiki/Test_2`
							}, {
								text: 'Test 3',
								href: `${langPath}/wiki/Test_3`
							}
						]
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test',
					i18n: {
						t(key) {
							return key;
						}
					}
				},
				path: [1],
				expected: [
					{
						href: 'Test_2',
						index: 1,
						route: 'wiki-page',
						name: 'Test 2',
						trackLabel: 'local-nav-open-link-index-1',
						type: 'nav-menu-item'
					},
					{
						href: 'Test_3',
						index: 2,
						route: 'wiki-page',
						name: 'Test 3',
						trackLabel: 'local-nav-open-link-index-2',
						type: 'nav-menu-item'
					}
				],
				message: 'Get local sub nav'
			},
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`,
						children: [
							{
								text: 'Test 2',
								href: `${langPath}/wiki/Test_2`,
								children: [
									{
										text: 'Test 2.1',
										href: `${langPath}/wiki/Test_2.1`
									},
									{
										text: 'Test 2.2',
										href: `${langPath}/Test_2.2`
									}
								]
							},
							{
								text: 'Test 3',
								href: `${langPath}/wiki/Test_3`
							}
						]
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test',
					i18n: {
						t(key) {
							return key;
						}
					}
				},
				path: [1, 1],
				expected: [
					{
						href: 'Test_2.1',
						index: 1,
						route: 'wiki-page',
						name: 'Test 2.1',
						trackLabel: 'local-nav-open-link-index-1',
						type: 'nav-menu-item'
					},
					{
						href: 'Test_2.2',
						index: 2,
						route: 'wiki-page',
						name: 'Test 2.2',
						trackLabel: 'local-nav-open-link-index-2',
						type: 'nav-menu-item'
					}
				],
				message: 'Get local sub nav with href cleaned up'
			}
		];

		cases.forEach((testCase) => {
			const nav = this.subject();

			nav.setProperties(testCase.mock);

			testCase.path.forEach((i) => {
				nav.goToSubNav(i);
			});
			assert.deepEqual(nav.get('items'), testCase.expected, testCase.message);
		});
	}

	function testHeaderValue(assert, langPath = '') {
		const cases = [
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`,
						children: [
							{
								text: 'Test 2',
								href: `${langPath}/wiki/Test_2`
							},
							{
								text: 'Test 3',
								href: `${langPath}/wiki/Test_3`
							}
						]
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test',
					i18n: {
						t(key) {
							return key;
						}
					}
				},
				path: [1],
				expected: 'Test 1',
				message: 'Show parent text'
			},
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`,
						children: [
							{
								text: 'Test 2',
								href: `${langPath}/wiki/Test_2`
							},
							{
								text: 'Test 3',
								href: `${langPath}/wiki/Test_3`
							}
						]
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test',
					i18n: {
						t(key) {
							return key;
						}
					}
				},
				path: [],
				expected: 'global-navigation-wikis-header',
				message: 'Show parent text'
			}
		];

		cases.forEach((testCase) => {
			const nav = this.subject();

			nav.setProperties(testCase.mock);

			testCase.path.forEach((i) => {
				nav.goToSubNav(i);
			});

			assert.deepEqual(nav.get('header'), testCase.expected, testCase.message);
		});
	}

	function testParentValue(assert, langPath = '') {
		const cases = [
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`,
						children: [
							{
								text: 'Test 2',
								href: `${langPath}/wiki/Test_2`
							},
							{
								text: 'Test 3',
								href: `${langPath}/wiki/Test_3`
							}
						]
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test',
					logger: {
						error: sinon.stub()
					}
				},
				path: [10],
				expected: {},
				message: 'Incorrect state'
			},
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`,
						children: [
							{
								text: 'Test 2',
								href: `${langPath}/wiki/Test_2`
							},
							{
								text: 'Test 3',
								href: `${langPath}/wiki/Test_3`
							}
						]
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test'
				},
				path: [],
				expected: {},
				message: 'Do not move anywhere'
			},
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`,
						children: [
							{
								text: 'Test 2',
								href: `${langPath}/wiki/Test_2`,
								children: [
									{
										text: 'Test 2.1',
										href: `${langPath}/wiki/Test_2.1`
									},
									{
										text: 'Test 2.2',
										href: `${langPath}/Test_2.2`
									}
								]
							},
							{
								text: 'Test 3',
								href: `${langPath}/wiki/Test_3`
							}
						]
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test'
				},
				path: [1],
				expected: {
					text: 'Test 1',
					href: `${langPath}/wiki/Test_1`,
					children: [
						{
							text: 'Test 2',
							href: `${langPath}/wiki/Test_2`,
							children: [
								{
									text: 'Test 2.1',
									href: `${langPath}/wiki/Test_2.1`
								},
								{
									text: 'Test 2.2',
									href: `${langPath}/Test_2.2`
								}
							]
						},
						{
							text: 'Test 3',
							href: `${langPath}/wiki/Test_3`
						}
					]
				},
				message: 'One level deep'
			},
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`,
						children: [
							{
								text: 'Test 2',
								href: `${langPath}/wiki/Test_2`,
								children: [
									{
										text: 'Test 2.1',
										href: `${langPath}/wiki/Test_2.1`
									},
									{
										text: 'Test 2.2',
										href: `${langPath}/Test_2.2`
									}
								]
							},
							{
								text: 'Test 3',
								href: `${langPath}/wiki/Test_3`
							}
						]
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test'
				},
				path: [1, 1],
				expected: {
					text: 'Test 2',
					href: `${langPath}/wiki/Test_2`,
					children: [
						{
							text: 'Test 2.1',
							href: `${langPath}/wiki/Test_2.1`
						},
						{
							text: 'Test 2.2',
							href: `${langPath}/Test_2.2`
						}
					]
				},
				message: 'Two levels deep'
			},
			{
				mock: {
					hubsLinks: hubsLinksMock,
					localLinks: [{
						text: 'Test 1',
						href: `${langPath}/wiki/Test_1`,
						children: [
							{
								text: 'Test 2',
								href: `${langPath}/wiki/Test_2`,
								children: [
									{
										text: 'Test 3',
										href: `${langPath}/wiki/Test_3`,
										children: [
											{
												text: 'Test 3.1',
												href: `${langPath}/wiki/Test_3.1`
											},
											{
												text: 'Test 3.2',
												href: `${langPath}/Test_3.2`
											}
										]
									},
									{
										text: 'Test 4',
										href: `${langPath}/Test_4`
									}
								]
							},
							{
								text: 'Test 5',
								href: `${langPath}/wiki/Test_5`
							}
						]
					}],
					exploreWikis: exploreWikisMock,
					exploreWikisLabel: exploreWikisLabelMock,
					wikiName: 'Test'
				},
				path: [1, 1, 1],
				expected: {
					text: 'Test 3',
					href: `${langPath}/wiki/Test_3`,
					children: [
						{
							text: 'Test 3.1',
							href: `${langPath}/wiki/Test_3.1`
						},
						{
							text: 'Test 3.2',
							href: `${langPath}/Test_3.2`
						}
					]
				},
				message: 'Three levels deep'
			}
		];

		cases.forEach((testCase) => {
			const nav = this.subject();

			nav.setProperties(testCase.mock);

			testCase.path.forEach((i) => {
				nav.goToSubNav(i);
			});

			assert.deepEqual(nav.get('currentLocalNav'), testCase.expected, testCase.message);
		});
	}

	module('Wiki without lang path', () => {
		test('Zero state with values from api', function (assert) {
			testZeroState.call(this, assert);
		});

		test('Local sub nav transitions', function (assert) {
			testLocalSuvNavTransition.call(this, assert);
		});

		test('Header value', function (assert) {
			testHeaderValue.call(this, assert);
		});

		test('Parent value', function (assert) {
			testParentValue.call(this, assert);
		});
	});

	module('Wiki with lang path', (hooks) => {
		const langPath = '/zh-hans';

		hooks.beforeEach(function () {
			const wikiUrlsService = this.owner.lookup('service:wiki-urls');
			wikiUrlsService.set('langPath', langPath);
		});

		test('Zero state with values from api', function (assert) {
			testZeroState.call(this, assert, langPath);
		});

		test('Local sub nav transitions', function (assert) {
			testLocalSuvNavTransition.call(this, assert, langPath);
		});

		test('Header value', function (assert) {
			testHeaderValue.call(this, assert, langPath);
		});

		test('Parent value', function (assert) {
			testParentValue.call(this, assert, langPath);
		});
	});
});
