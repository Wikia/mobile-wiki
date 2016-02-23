import {test} from 'ember-qunit';

module('Unit | Utils | mediawiki-handler | article', (hooks) => {
	let originalDocumentTitle,
		originalWikiVariables;

	const articleHandler = require('main/utils/mediawiki-handlers/article').default;

	hooks.beforeEach(() => {
		originalDocumentTitle = document.title;
		originalWikiVariables = Mercury.wiki;
	});

	hooks.afterEach(() => {
		document.title = originalDocumentTitle;
		Mercury.wiki = originalWikiVariables;
	});

	test('sets correct title tag', (assert) => {
		const model = Ember.Object.create({
			displayTitle: 'Article title'
		});

		Mercury.wiki.htmlTitleTemplate = '$1 - Test';
		articleHandler.updateTitleTag(model);
		assert.equal(document.title, 'Article title - Test');

		Mercury.wiki.htmlTitleTemplate = null;
		articleHandler.updateTitleTag(model);
		assert.equal(document.title, 'Article title - Wikia');

		delete Mercury.wiki.htmlTitleTemplate;
		articleHandler.updateTitleTag(model);
		assert.equal(document.title, 'Article title - Wikia');
	});

	test('sets correct canonical link without existing element', (assert) => {
		const model = Ember.Object.create({
				url: '/wiki/Kermit'
			}),
			canonicalLinkTag = '<link rel="canonical" href="http://muppet.wikia.com/wiki/Kermit">';

		Mercury.wiki.basePath = 'http://muppet.wikia.com';
		articleHandler.updateCanonicalLinkTag(model);
		assert.equal($(document.head).find('link[rel=canonical]').prop('outerHTML'), canonicalLinkTag);
	});

	test('sets correct canonical link with existing element', (assert) => {
		const model = Ember.Object.create({
				url: '/wiki/Yoda'
			}),
			canonicalLinkTag = '<link rel="canonical" href="http://starwars.wikia.com/wiki/Yoda">';

		Mercury.wiki.basePath = 'http://starwars.wikia.com';
		articleHandler.updateCanonicalLinkTag(model);
		assert.equal($(document.head).find('link[rel=canonical]').prop('outerHTML'), canonicalLinkTag);
	});

	test('sets correct description meta tag with existing empty hardcoded element in index.html', (assert) => {
		const description = 'Article description',
			descriptionMetaTag = `<meta name="description" content="${description}">`,
			model = Ember.Object.create({
				description
			});

		articleHandler.updateDescriptionMetaTag(model);
		assert.equal($(document.head).find('meta[name=description]').prop('outerHTML'), descriptionMetaTag);
	});

	test('sets correct description meta tag with existing element', (assert) => {
		const description = 'Another article description',
			descriptionMetaTag = `<meta name="description" content="${description}">`,
			model = Ember.Object.create({
				description
			});

		articleHandler.updateDescriptionMetaTag(model);
		assert.equal($(document.head).find('meta[name=description]').prop('outerHTML'), descriptionMetaTag);
	});

	test('sets correct apple-itunes-app meta tag without existing element', (assert) => {
		const model = Ember.Object.create({
				url: '/wiki/Geralt_of_Rivia'
			}),
			iOSSmartBannerMetaTag = '<meta name="apple-itunes-app" ' +
				'content="app-id=951103682, app-argument=http://witcher.wikia.com/wiki/Geralt_of_Rivia">';

		Mercury.wiki.smartBanner.appId.ios = '951103682';
		Mercury.wiki.basePath = 'http://witcher.wikia.com';
		articleHandler.updateIOSSmartBannerMetaTag(model);
		assert.equal($(document.head).find('meta[name=apple-itunes-app]').prop('outerHTML'), iOSSmartBannerMetaTag);
	});

	test('sets correct apple-itunes-app meta tag with existing element', (assert) => {
		const model = Ember.Object.create({
				url: '/wiki/Teemo'
			}),
			iOSSmartBannerMetaTag = '<meta name="apple-itunes-app" ' +
				'content="app-id=739258886, app-argument=http://leagueoflegends.wikia.com/wiki/Teemo">';

		Mercury.wiki.smartBanner.appId.ios = '739258886';
		Mercury.wiki.basePath = 'http://leagueoflegends.wikia.com';
		articleHandler.updateIOSSmartBannerMetaTag(model);
		assert.equal($(document.head).find('meta[name=apple-itunes-app]').prop('outerHTML'), iOSSmartBannerMetaTag);
	});

	test('sets correct apple-itunes-app meta tag when no url is present', (assert) => {
		const model = Ember.Object.create({}),
			iOSSmartBannerMetaTag = '<meta name="apple-itunes-app" content="app-id=739258886">';

		Mercury.wiki.smartBanner.appId.ios = '739258886';
		Mercury.wiki.basePath = 'http://leagueoflegends.wikia.com';
		articleHandler.updateIOSSmartBannerMetaTag(model);
		assert.equal($(document.head).find('meta[name=apple-itunes-app]').prop('outerHTML'), iOSSmartBannerMetaTag);
	});

	test('doesn\'t set apple-itunes-app meta tag when no smart banner data is present', (assert) => {
		const model = Ember.Object.create({}),
			$head = $(document.head),
			selector = 'meta[name=apple-itunes-app]';

		$head.find(selector).remove();
		delete Mercury.wiki.smartBanner;
		Mercury.wiki.basePath = 'http://leagueoflegends.wikia.com';
		articleHandler.updateIOSSmartBannerMetaTag(model);
		assert.strictEqual($head.find(selector).length, 0);
	});
});

