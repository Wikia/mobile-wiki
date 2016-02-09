import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';

let originalDocumentTitle,
	originalWikiVariables;

moduleFor('route:article', 'Integration | Route | article', {
	beforeEach() {
		originalDocumentTitle = document.title;
		originalWikiVariables = Mercury.wiki;
	},

	afterEach() {
		document.title = originalDocumentTitle;
		Mercury.wiki = originalWikiVariables;
	}
});

test('sets correct title tag', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({
			displayTitle: 'Article title'
		});

	Mercury.wiki.htmlTitleTemplate = '$1 - Test';
	route.updateTitleTag(model);
	assert.equal(document.title, 'Article title - Test');

	Mercury.wiki.htmlTitleTemplate = null;
	route.updateTitleTag(model);
	assert.equal(document.title, 'Article title - Wikia');

	delete Mercury.wiki.htmlTitleTemplate;
	route.updateTitleTag(model);
	assert.equal(document.title, 'Article title - Wikia');
});

test('sets correct canonical link without existing element', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({
			url: '/wiki/Kermit'
		}),
		canonicalLinkTag = '<link rel="canonical" href="http://muppet.wikia.com/wiki/Kermit">';

	Mercury.wiki.basePath = 'http://muppet.wikia.com';
	route.updateCanonicalLinkTag(model);
	assert.equal($(document.head).find('link[rel=canonical]').prop('outerHTML'), canonicalLinkTag);
});

test('sets correct canonical link with existing element', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({
			url: '/wiki/Yoda'
		}),
		canonicalLinkTag = '<link rel="canonical" href="http://starwars.wikia.com/wiki/Yoda">';

	Mercury.wiki.basePath = 'http://starwars.wikia.com';
	route.updateCanonicalLinkTag(model);
	assert.equal($(document.head).find('link[rel=canonical]').prop('outerHTML'), canonicalLinkTag);
});

test('sets correct description meta tag with existing empty hardcoded element in index.html', function (assert) {
	const route = this.subject(),
		description = 'Article description',
		descriptionMetaTag = `<meta name="description" content="${description}">`,
		model = Ember.Object.create({
			description
		});

	route.updateDescriptionMetaTag(model);
	assert.equal($(document.head).find('meta[name=description]').prop('outerHTML'), descriptionMetaTag);
});

test('sets correct description meta tag with existing element', function (assert) {
	const route = this.subject(),
		description = 'Another article description',
		descriptionMetaTag = `<meta name="description" content="${description}">`,
		model = Ember.Object.create({
			description
		});

	route.updateDescriptionMetaTag(model);
	assert.equal($(document.head).find('meta[name=description]').prop('outerHTML'), descriptionMetaTag);
});

test('sets correct apple-itunes-app meta tag without existing element', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({
			url: '/wiki/Geralt_of_Rivia'
		}),
		iOSSmartBannerMetaTag = '<meta name="apple-itunes-app" ' +
			'content="app-id=951103682, app-argument=http://witcher.wikia.com/wiki/Geralt_of_Rivia">';

	Mercury.wiki.smartBanner.appId.ios = '951103682';
	Mercury.wiki.basePath = 'http://witcher.wikia.com';
	route.updateIOSSmartBannerMetaTag(model);
	assert.equal($(document.head).find('meta[name=apple-itunes-app]').prop('outerHTML'), iOSSmartBannerMetaTag);
});

test('sets correct apple-itunes-app meta tag with existing element', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({
			url: '/wiki/Teemo'
		}),
		iOSSmartBannerMetaTag = '<meta name="apple-itunes-app" ' +
			'content="app-id=739258886, app-argument=http://leagueoflegends.wikia.com/wiki/Teemo">';

	Mercury.wiki.smartBanner.appId.ios = '739258886';
	Mercury.wiki.basePath = 'http://leagueoflegends.wikia.com';
	route.updateIOSSmartBannerMetaTag(model);
	assert.equal($(document.head).find('meta[name=apple-itunes-app]').prop('outerHTML'), iOSSmartBannerMetaTag);
});

test('sets correct apple-itunes-app meta tag when no url is present', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({}),
		iOSSmartBannerMetaTag = '<meta name="apple-itunes-app" content="app-id=739258886">';

	Mercury.wiki.smartBanner.appId.ios = '739258886';
	Mercury.wiki.basePath = 'http://leagueoflegends.wikia.com';
	route.updateIOSSmartBannerMetaTag(model);
	assert.equal($(document.head).find('meta[name=apple-itunes-app]').prop('outerHTML'), iOSSmartBannerMetaTag);
});

test('doesn\'t set apple-itunes-app meta tag when no smart banner data is present', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({}),
		$head = $(document.head),
		selector = 'meta[name=apple-itunes-app]';

	$head.find(selector).remove();
	delete Mercury.wiki.smartBanner;
	Mercury.wiki.basePath = 'http://leagueoflegends.wikia.com';
	route.updateIOSSmartBannerMetaTag(model);
	assert.strictEqual($head.find(selector).length, 0);
});
