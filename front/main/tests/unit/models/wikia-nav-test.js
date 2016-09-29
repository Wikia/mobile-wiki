import {moduleFor, test} from 'ember-qunit';
import sinon from 'sinon';
import WikiaNavModel from 'main/models/wikia-nav';

moduleFor('model:wikia-nav', 'Unit | Model | wikia nav', {
	unit: true
});

const hubsLinksMock = [{
		title: {
			key: 'global-navigation-fandom-overview-link-vertical-games'
		},
		href: 'http://fandom.wikia.com/games',
		brand: 'games'
	}],
	exploreWikisMock = {
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
	},
	exploreWikisLabelMock = 'global-navigation-wikis-header';

test('test zero state with values from api', (assert) => {
	const cases = [
		{
			mock: {
				hubsLinks: [],
				localLinks: [],
				exploreWikis: [],
				exploreWikisLabel: '',
				discussionsEnabled: false,
				wikiName: ''
			},
			expected: [
				{
					type: 'nav-menu-item',
					route: 'recent-wiki-activity',
					name: 'main.title',
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav'
				},
				{
					actionId: 'onRandomPageClick',
					name: 'app.random-page-label',
					trackLabel: 'random-page',
					type: 'nav-menu-item'
				}
			],
			message: 'Empty api results'
		},
		{
			mock: {
				hubsLinks: hubsLinksMock,
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikis: exploreWikisMock,
				discussionsEnabled: false,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
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
					name: 'app.explore-wiki',
					type: 'nav-menu-header',
					route: 'wiki-page',
					href: ''
				},
				{
					route: 'recent-wiki-activity',
					name: 'main.title',
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav',
					type: 'nav-menu-item'
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
					name: 'app.random-page-label',
					trackLabel: 'random-page',
					type: 'nav-menu-item'
				}
			],
			message: 'Full nav visible, discussions disabled'
		},
		{
			mock: {
				hubsLinks: hubsLinksMock,
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikis: exploreWikisMock,
				discussionsEnabled: true,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
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
					name: 'app.explore-wiki',
					type: 'nav-menu-header',
					route: 'wiki-page',
					href: ''
				},
				{
					type: 'nav-menu-item',
					route: 'discussion',
					name: 'main.discussions-header-title',
					trackCategory: 'discussion',
					trackLabel: 'local-nav'
				},
				{
					route: 'recent-wiki-activity',
					name: 'main.title',
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav',
					type: 'nav-menu-item'
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
					name: 'app.random-page-label',
					trackLabel: 'random-page',
					type: 'nav-menu-item'
				}
			],
			message: 'Full nav visible, discussions enabled'
		},
		{
			mock: {
				hubsLinks: [],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				discussionsEnabled: false,
				wikiName: 'Test'
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
					name: 'app.explore-wiki',
					type: 'nav-menu-header',
					route: 'wiki-page',
					href: ''
				},
				{
					route: 'recent-wiki-activity',
					name: 'main.title',
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav',
					type: 'nav-menu-item'
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
					name: 'app.random-page-label',
					trackLabel: 'random-page',
					type: 'nav-menu-item'
				}
			],
			message: 'Hubs hidden when not returned from DS API'
		},
		{
			mock: {
				hubsLinks: [],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
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
				wikiName: 'Test'
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
					name: 'app.explore-wiki',
					type: 'nav-menu-header',
					route: 'wiki-page',
					href: ''
				},
				{
					route: 'recent-wiki-activity',
					name: 'main.title',
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav',
					type: 'nav-menu-item'
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
					name: 'app.random-page-label',
					trackLabel: 'random-page',
					type: 'nav-menu-item'
				}
			],
			message: 'Show the first link when there is no header for wikis section'
		}
	];

	const i18nStub = sinon.stub(window.i18n, 't');

	i18nStub.returnsArg(0);

	cases.forEach((testCase) => {
		const nav = WikiaNavModel.create(testCase.mock);

		assert.deepEqual(nav.get('items'), testCase.expected, testCase.message);
	});

	i18nStub.restore();
});

test('test local sub nav transitions', (assert) => {
	const cases = [
		{
			mock: {
				hubsLinks: hubsLinksMock,
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
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
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
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
					text: 'Test 1', href: '/wiki/Test_1', children: [
						{text: 'Test 2', href: '/wiki/Test_2', children: [
							{text: 'Test 2.1', href: '/wiki/Test_2.1'},
							{text: 'Test 2.2', href: '/Test_2.2'}
						]},
						{text: 'Test 3', href: '/wiki/Test_3'}
					]
				}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
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

	const i18nStub = sinon.stub(window.i18n, 't');

	i18nStub.returnsArg(0);

	cases.forEach((testCase) => {
		const nav = WikiaNavModel.create(testCase.mock);

		testCase.path.forEach((i) => {
			nav.goToSubNav(i);
		});
		assert.deepEqual(nav.get('items'), testCase.expected, testCase.message);
	});

	i18nStub.restore();
});

test('Header value', (assert) => {
	const cases = [
		{
			mock: {
				hubsLinks: hubsLinksMock,
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
			},
			path: [1],
			expected: 'Test 1',
			message: 'Show parent text'
		},
		{
			mock: {
				hubsLinks: hubsLinksMock,
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
			},
			path: [],
			expected: 'global-navigation-wikis-header',
			message: 'Show parent text'
		}
	];

	cases.forEach((testCase) => {
		const nav = WikiaNavModel.create(testCase.mock);

		testCase.path.forEach((i) => {
			nav.goToSubNav(i);
		});

		assert.deepEqual(nav.get('header'), testCase.expected, testCase.message);
	});
});

test('Parent value', (assert) => {
	const cases = [
		{
			mock: {
				hubsLinks: hubsLinksMock,
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
			},
			path: [10],
			expected: {},
			message: 'Incorrect state'
		},
		{
			mock: {
				hubsLinks: hubsLinksMock,
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
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
					text: 'Test 1', href: '/wiki/Test_1', children: [
						{text: 'Test 2', href: '/wiki/Test_2', children: [
							{text: 'Test 2.1', href: '/wiki/Test_2.1'},
							{text: 'Test 2.2', href: '/Test_2.2'}
						]},
						{text: 'Test 3', href: '/wiki/Test_3'}
					]
				}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
			},
			path: [1],
			expected: {
				text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2', children: [
						{text: 'Test 2.1', href: '/wiki/Test_2.1'},
						{text: 'Test 2.2', href: '/Test_2.2'}
					]},
					{text: 'Test 3', href: '/wiki/Test_3'}
				]
			},
			message: 'One level deep'
		},
		{
			mock: {
				hubsLinks: hubsLinksMock,
				localLinks: [{
					text: 'Test 1', href: '/wiki/Test_1', children: [
						{text: 'Test 2', href: '/wiki/Test_2', children: [
							{text: 'Test 2.1', href: '/wiki/Test_2.1'},
							{text: 'Test 2.2', href: '/Test_2.2'}
						]},
						{text: 'Test 3', href: '/wiki/Test_3'}
					]
				}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
			},
			path: [1, 1],
			expected: {
				text: 'Test 2',
				href: '/wiki/Test_2',
				children: [
					{text: 'Test 2.1', href: '/wiki/Test_2.1'},
					{text: 'Test 2.2', href: '/Test_2.2'}
				]
			},
			message: 'Two levels deep'
		},
		{
			mock: {
				hubsLinks: hubsLinksMock,
				localLinks: [{
					text: 'Test 1', href: '/wiki/Test_1', children: [
						{text: 'Test 2', href: '/wiki/Test_2', children: [
							{text: 'Test 3', href: '/wiki/Test_3', children: [
								{text: 'Test 3.1', href: '/wiki/Test_3.1'},
								{text: 'Test 3.2', href: '/Test_3.2'}
							]},
							{text: 'Test 4', href: '/Test_4'}
						]},
						{text: 'Test 5', href: '/wiki/Test_5'}
					]
				}],
				exploreWikis: exploreWikisMock,
				exploreWikisLabel: exploreWikisLabelMock,
				wikiName: 'Test'
			},
			path: [1, 1, 1],
			expected: {
				text: 'Test 3', href: '/wiki/Test_3', children: [
					{text: 'Test 3.1', href: '/wiki/Test_3.1'},
					{text: 'Test 3.2', href: '/Test_3.2'}
				]
			},
			message: 'Three levels deep'
		}
	];

	cases.forEach((testCase) => {
		const nav = WikiaNavModel.create(testCase.mock);

		testCase.path.forEach((i) => {
			nav.goToSubNav(i);
		});

		assert.deepEqual(nav.get('currentLocalNav'), testCase.expected, testCase.message);
	});
});
