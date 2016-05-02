import { moduleFor, test } from 'ember-qunit';
import WikiaNavModel from 'main/models/wikia-nav';

moduleFor('model:wikia-nav', 'Unit | Model | global nav', {
	unit: true
});

test('test zero state with values from api', function (assert) {
	const cases = [
		{
			mock: {
				hubsLinks: [],
				localLinks: [],
				exploreWikiaLinks: [],
				exploreWikiaLabel: '',
				wikiName: '',
				wikiLang: ''
			},
			expected: [
				{
					type: 'side-nav-menu-item',
					link: 'recent-wiki-activity',
					name: '',
					trackCategory: 'recent-wiki-activity',
					trackLabel: 'local-nav'
				},
				{
					type: 'side-nav-menu-item',
					href: '#',
					name: '',
					trackLabel: 'random-page',
					clickHandler: 'loadRandomArticle'
				}
			],
			message: 'Empty api results'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', 'specialAttr': 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikiaLinks: [{textEscaped: 'Explore test', href: 'http://test.com/expolore', 'trackingLabel': 'exp-test'}],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			expected: [
				{
					"className": "tests",
					"href": "http://test.com/hub",
					"name": "Hub test",
					"trackLabel": "open-hub-tests",
					"type": "side-nav-menu-external"
				},
				{
					"index": 0,
					"name": "Explore menu",
					"trackLabel": "open-explore-wikia",
					"type": "side-nav-menu-root"
				},
				{
					"name": "",
					"type": "side-nav-menu-header"
				},
				{
					"link": "recent-wiki-activity",
					"name": "",
					"trackCategory": "recent-wiki-activity",
					"trackLabel": "local-nav",
					"type": "side-nav-menu-item"
				},
				{
					"href": "Test_1",
					"index": 1,
					"link": "wiki-page",
					"name": "Test 1",
					"trackLabel": "local-nav-open-link-index-1",
					"type": "side-nav-menu-item"
				},
				{
					"clickHandler": "loadRandomArticle",
					"href": "#",
					"name": "",
					"trackLabel": "random-page",
					"type": "side-nav-menu-item"
				}
			],
			message: 'Full nav visible'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', 'specialAttr': 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikiaLinks: [{textEscaped: 'Explore test', href: 'http://test.com/expolore', 'trackingLabel': 'exp-test'}],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'pl'
			},
			expected: [
				{
					"index": 0,
					"name": "Explore menu",
					"trackLabel": "open-explore-wikia",
					"type": "side-nav-menu-root"
				},
				{
					"name": "",
					"type": "side-nav-menu-header"
				},
				{
					"link": "recent-wiki-activity",
					"name": "",
					"trackCategory": "recent-wiki-activity",
					"trackLabel": "local-nav",
					"type": "side-nav-menu-item"
				},
				{
					"href": "Test_1",
					"index": 1,
					"link": "wiki-page",
					"name": "Test 1",
					"trackLabel": "local-nav-open-link-index-1",
					"type": "side-nav-menu-item"
				},
				{
					"clickHandler": "loadRandomArticle",
					"href": "#",
					"name": "",
					"trackLabel": "random-page",
					"type": "side-nav-menu-item"
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

test('test local sub nav transitions', function (assert) {
	const cases = [
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', 'specialAttr': 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1'}],
				exploreWikiaLinks: [{textEscaped: 'Explore test', href: 'http://test.com/explore', 'trackingLabel': 'exp-test-1'}],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [0],
			expected: [
				{
					"href": "http://test.com/explore",
					"name": "Explore test",
					"trackLabel": "open-exp-test-1",
					"type": "side-nav-menu-external"
				}
			],
			message: 'Explore nav displayed'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', 'specialAttr': 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikiaLinks: [{textEscaped: 'Explore test', href: 'http://test.com/explore', 'trackingLabel': 'exp-test-1'}],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [1],
			expected: [
				{
					"href": "Test_2",
					"index": 1,
					"link": "wiki-page",
					"name": "Test 2",
					"trackLabel": "local-nav-open-link-index-1",
					"type": "side-nav-menu-item"
				},
				{
					"href": "Test_3",
					"index": 2,
					"link": "wiki-page",
					"name": "Test 3",
					"trackLabel": "local-nav-open-link-index-2",
					"type": "side-nav-menu-item"
				}
			],
			message: 'Get local sub nav'
		},
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', 'specialAttr': 'tests'}],
				localLinks: [{
					text: 'Test 1', href: '/wiki/Test_1', children: [
						{text: 'Test 2', href: '/wiki/Test_2', children: [
							{text: 'Test 2.1', href: '/wiki/Test_2.1'},
							{text: 'Test 2.2', href: '/Test_2.2'}
						]},
						{text: 'Test 3', href: '/wiki/Test_3'}
					]
				}],
				exploreWikiaLinks: [{textEscaped: 'Explore test', href: 'http://test.com/explore', 'trackingLabel': 'exp-test-1'}],
				exploreWikiaLabel: 'Explore menu',
				wikiName: 'Test',
				wikiLang: 'en'
			},
			path: [1,1],
			expected: [
				{
					"href": "Test_2.1",
					"index": 1,
					"link": "wiki-page",
					"name": "Test 2.1",
					"trackLabel": "local-nav-open-link-index-1",
					"type": "side-nav-menu-item"
				},
				{
					"href": "Test_2.2",
					"index": 2,
					"link": "wiki-page",
					"name": "Test 2.2",
					"trackLabel": "local-nav-open-link-index-2",
					"type": "side-nav-menu-item"
				}
			],
			message: 'Get local sub nav with href cleaned up'
		}
	];

	cases.forEach((testCase) => {
		const nav = WikiaNavModel.create(testCase.mock);

		for (let i of testCase.path) {
			nav.goToSubNav(i);
		}
		assert.deepEqual(nav.get('items'), testCase.expected, testCase.message);
	});
});

test('Incorrect state', function (assert) {
	const nav = WikiaNavModel.create({
		hubsLinks: [],
		localLinks: [],
		exploreWikiaLinks: [],
		exploreWikiaLabel: '',
		wikiName: '',
		wikiLang: ''
	});

	assert.throws(function () {
		nav.goToSubNav(10);
		nav.get('items');
	}, new Error('Incorrect navigation state'));
});

test('Header value', function (assert) {
	const cases = [
		{
			mock: {
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', 'specialAttr': 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikiaLinks: [{textEscaped: 'Explore test', href: 'http://test.com/explore', 'trackingLabel': 'exp-test-1'}],
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
				hubsLinks: [{textEscaped: 'Hub test', href: 'http://test.com/hub', 'specialAttr': 'tests'}],
				localLinks: [{text: 'Test 1', href: '/wiki/Test_1', children: [
					{text: 'Test 2', href: '/wiki/Test_2'}, {text: 'Test 3', href: '/wiki/Test_3'}
				]}],
				exploreWikiaLinks: [{textEscaped: 'Explore test', href: 'http://test.com/explore', 'trackingLabel': 'exp-test-1'}],
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

		for (let i of testCase.path) {
			nav.goToSubNav(i);
		}

		assert.deepEqual(nav.get('header'), testCase.expected, testCase.message);
	});
});
