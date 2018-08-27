import articleFixture from './fixtures/article';
import articleCommentsFixture from './fixtures/article-comments';
import blogPostPageFixture from './fixtures/blog-post';
import filePageFixture from './fixtures/file-page';
import jwplayerVideoFixture from './fixtures/jwplayer-video';
import searchSuggestionsFixture from './fixtures/search-suggestion';
import testAFixture from './fixtures/test-page';

/**
 * @returns {void}
 */
export default function () {
	this.passthrough('https://localhost/**');

	this.passthrough('https://services.wikia-dev.pl/**');
	this.passthrough('https://services.wikia-dev.us/**');
	this.passthrough('https://services.wikia.com/**');
	this.passthrough('/wikia.php');
	this.passthrough('/api.php');
	this.passthrough('https://speed.nocookie.net/**');
	this.passthrough('/write-coverage');

	// We have /front/main/assets prefix hardcoded in route and testem use /assets
	// This is a quick (hopefully temporary) fix
	this.get('/front/main/assets/vendor/cropper/cropper.min.js', {});

	this.get('/wikia.php', (schema, request) => {
		const { controller, method, title, id } = request.queryParams;

		if (controller === 'MercuryApi') {
			if (method === 'getPage' && title === 'Mercury_CC_Wikia') {
				// Curated Main Page Data
				return schema.curatedContents.first();
			}

			if (method === 'getPage' && title === 'File:Example.jpg') {
				return filePageFixture;
			}

			if (method === 'getPage' && title === 'User_blog:TimmyQuivy/Bots:_An_Overview_Of_How_They_Are_Used_on_FANDOM') {
				return blogPostPageFixture;
			}

			if (method === 'getPage' && title === 'TestA') {
				return testAFixture;
			}

			if (method === 'getPage' && title === 'Qaga2') {
				return articleFixture;
			}
		}

		if (controller === 'CuratedContent' && method === 'getData') {
			return schema.curatedContentEditorItems.first();
		}

		// fixme probably it shouldn't look like this - it just to have mirage working for backend-less development
		if (controller === 'UserApi') {
			return undefined;
		}
		throw new Error(`Controller or method response isn't yet mocked`);
	});

	this.get('http://fallout.wikia.com/wikia.php', (schema, request) => {
		const { controller, method, title, query, id } = request.queryParams;

		if (controller === 'MercuryApi') {
			if (method === 'getPage' && title === 'File:Example.jpg') {
				return filePageFixture;
			}

			if (method === 'getPage' && title === 'User_blog:TimmyQuivy/Bots:_An_Overview_Of_How_They_Are_Used_on_FANDOM') {
				return blogPostPageFixture;
			}

			if (method === 'getPage' && title === 'testA') {
				return testAFixture;
			}

			if (method === 'getPage' && title === 'Qaga2') {
				return articleFixture;
			}

			if (method === 'getSearchSuggestions') {
				return searchSuggestionsFixture(query);
			}

			if (method === 'getArticleComments' && id === '10') {
				return articleCommentsFixture;
			}
		}

		if (controller === 'SearchApi' && method === 'getList') {
			return schema.searches.first();
		}

		throw new Error(`Controller or method response isn't yet mocked`);
	});

	this.get('https://cdn.jwplayer.com/v2/media/3D92mQ7n', () => jwplayerVideoFixture);
}
