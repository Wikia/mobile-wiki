import {moduleFor, test} from 'ember-qunit';
import WikiaNavModel from 'main/models/wikia-nav';

moduleFor('model:wikia-nav', 'Unit | Model | global nav', {
	unit: true
});

test('test zero state with values from api', (assert) => {
	const cases = [
		{
			mock: {
				hubsLinks: [],
				localLinks: [],
				exploreWikiaLinks: [],
				exploreWikiaLabel: '',
				discussionsEnabled: false,
				wikiName: '',
				wikiLang: ''
			},
			expected: [
				{
					type: 'nav-menu-item',
					route: 'recent-wiki-activity',
					name: '',
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav'
				},
				{
					actionId: 'onRandomPageClick',
					name: '',
					trackLabel: 'random-page',
					type: 'nav-menu-item'
				}
			],
			message: 'Empty api results'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/expolore', trackingLabel: 'exp-test'}
				],
				discussionsEnabled: false,
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			expected: [
				{
					className: 'nav-menu--external nav-menu--tests',
					href: 'http://test.com/hub',
					name: 'Hub test',
					trackLabel: 'open-hub-tests',
					type: 'nav-menu-external'
				},
				{
					className: 'nav-menu--explore',
					index: 0,
					name: 'Explore menu',
					trackLabel: 'open-explore-wikia',
					type: 'nav-menu-root'
				},
				{
					name: '',
					type: 'nav-menu-header'
				},
				{
					route: 'recent-wiki-activity',
					name: '',
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
					type: 'nav-menu-item',
				},
				{
					actionId: 'onRandomPageClick',
					name: '',
					trackLabel: 'random-page',
					type: 'nav-menu-item',
				}
			],
			message: 'Full nav visible, discussions disabled'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/expolore', trackingLabel: 'exp-test'}
				],
				discussionsEnabled: true,
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			expected: [
				{
					className: 'nav-menu--external nav-menu--tests',
					href: 'http://test.com/hub',
					name: 'Hub test',
					trackLabel: 'open-hub-tests',
					type: 'nav-menu-external'
				},
				{
					className: 'nav-menu--explore',
					index: 0,
					name: 'Explore menu',
					trackLabel: 'open-explore-wikia',
					type: 'nav-menu-root'
				},
				{
					name: '',
					type: 'nav-menu-header'
				},
				{
					type: 'side-nav-menu-item',
					route: 'discussion',
					name: '',
					trackCategory: 'discussion',
					trackLabel: 'local-nav'
				},
				{
					className: 'nav-menu--local',
					route: 'recent-wiki-activity',
					name: '',
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav',
					type: 'nav-menu-item'
				},
				{
					className: 'nav-menu--local',
					href: 'Test_1',
					index: 1,
					route: 'wiki-page',
					name: 'Test 1',
					trackLabel: 'local-nav-open-link-index-1',
					type: 'nav-menu-item'
				},
				{
					className: 'nav-menu--local',
					actionId: 'onRandomPageClick',
					name: '',
					trackLabel: 'random-page',
					type: 'nav-menu-item'
				}
			],
			message: 'Full nav visible, discussions enabled'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikiaLinks: [{textEscaped: 'Explore test', href: 'http://test.com/expolore', trackingLabel: 'exp-test'}],
				exploreWikiaLabel: 'Explore menu',
				discussionsEnabled: false,
				wikiName: 'Test',
				wikiLang: 'pl'
			},
			expected: [
				{
					index: 0,
					name: 'Explore menu',
					trackLabel: 'open-explore-wikia',
					type: 'nav-menu-root',
					className: 'nav-menu--explore'
				},
				{
					name: '',
					type: 'nav-menu-header'
				},
				{
					route: 'recent-wiki-activity',
					name: '',
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
					name: '',
					trackLabel: 'random-page',
					type: 'nav-menu-item'
				}
			],
			message: 'Hubs hidden for non english'
		}
	];

	cases.forEach((testCase) => {
		const nav = WikiaNavModel.create(testCase.mock);

		assert.deepEqual(nav.get('items'), testCase.expected, testCase.message);
	});
});

test('test local sub nav transitions', (assert) => {
	const cases = [
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [0],
			expected: [
				{
					href: 'http://test.com/explore',
					name: 'Explore test',
					trackLabel: 'open-exp-test-1',
					type: 'nav-menu-external'
				}
			],
			message: 'Explore nav displayed'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [1],
			expected: [
				{
					className: '',
					href: 'Test_2',
					index: 1,
					route: 'wiki-page',
					name: 'Test 2',
					trackLabel: 'local-nav-open-link-index-1',
					type: 'nav-menu-item'
				},
				{
					className: '',
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
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{
					text: 'Test 1', href: '/wiki/Test_1', children: [
						{text: 'Test 2', href: '/wiki/Test_2', children: [
							{text: 'Test 2.1', href: '/wiki/Test_2.1'},
							{text: 'Test 2.2', href: '/Test_2.2'}
						]},
						{text: 'Test 3', href: '/wiki/Test_3'}
					]
				}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [1, 1],
			expected: [
				{
					className: '',
					href: 'Test_2.1',
					index: 1,
					route: 'wiki-page',
					name: 'Test 2.1',
					trackLabel: 'local-nav-open-link-index-1',
					type: 'nav-menu-item'
				},
				{
					className: '',
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
		const nav = WikiaNavModel.create(testCase.mock);

		testCase.path.forEach((i) => {
			nav.goToSubNav(i);
		});
		assert.deepEqual(nav.get('items'), testCase.expected, testCase.message);
	});
});

test('Header value', (assert) => {
	const cases = [
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [1],
			expected: 'Test 1',
			message: 'Show parent text'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [],
			expected: 'Explore menu',
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
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [10],
			expected: {},
			message: 'Incorrect state'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [],
			expected: {},
			message: 'Do not move anywhere'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{
					text: 'Test 1', href: '/wiki/Test_1', children: [
						{text: 'Test 2', href: '/wiki/Test_2', children: [
							{text: 'Test 2.1', href: '/wiki/Test_2.1'},
							{text: 'Test 2.2', href: '/Test_2.2'}
						]},
						{text: 'Test 3', href: '/wiki/Test_3'}
					]
				}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
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
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
				localLinks: [{
					text: 'Test 1', href: '/wiki/Test_1', children: [
						{text: 'Test 2', href: '/wiki/Test_2', children: [
							{text: 'Test 2.1', href: '/wiki/Test_2.1'},
							{text: 'Test 2.2', href: '/Test_2.2'}
						]},
						{text: 'Test 3', href: '/wiki/Test_3'}
					]
				}],
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
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
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', specialAttr: 'tests'}],
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
				exploreWikiaLinks: [
					{textEscaped: 'Explore test', href: 'http://test.com/explore', trackingLabel: 'exp-test-1'}
				],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
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
