import userActivityReportsFixtures from './fixtures/discussion-user-activity-reports';
import userActivityPostsFixtures from './fixtures/discussion-user-activity-posts';

/**
 * @returns {void}
 */
export default function () {
	this.passthrough('/write-blanket-coverage');
	this.passthrough('https://localhost/**');

	this.passthrough('https://services-poz.wikia-dev.com/**');
	this.passthrough('/wikia.php');
	this.passthrough('/api.php');
	this.passthrough('http://speed.wikia.net/**');

	// We have /front/main/assets prefix hardcoded in route and testem use /assets
	// This is a quick (hopefully temporary) fix
	this.get('/front/main/assets/vendor/cropper/cropper.min.js', {});

	this.get('/wikia.php', (schema, request) => {
		const {controller, method, title, section, category} = request.queryParams;

		if (controller === 'MercuryApi') {
			if (method === 'getPage' && title === 'Mercury_CC_Wikia') {
				// Curated Main Page Data
				return schema.curatedContents.first();
			}

			if (method === 'getCuratedContentSection' && section === 'Categories') {
				return schema.curatedContentSections.first();
			}
		}

		if (controller === 'ArticlesApi' && method === 'getList' && category === 'Articles') {
			return schema.curatedContentCategories.first();
		}

		if (controller === 'CuratedContent' && method === 'getData') {
			return schema.curatedContentEditorItems.first();
		}

		if (controller === 'SearchApi' && method === 'getList') {
			return schema.searches.first();
		}

		if (controller === 'UserApi') {
			return;
		}
		throw new Error(`Controller or method response isn't yet mocked`);
	});



	this.get('https://localhost/discussion/:siteId/threads', (schema, request) => {
		return schema.discussionThreads.first();
	});

	this.get('https://localhost/discussion/:siteId/forums', (schema, request) => {
		return schema.discussionForums.first();
	});

	this.get('https://localhost/site-attribute/site/:siteId/attr', (schema, request) => {
		return schema.siteAttributes.first();
	});

	this.get('https://services-poz.wikia-dev.com/discussion/3035/leaderboards', (schema, request) => {
		return userActivityPostsFixtures;
	});

	this.get('https://services-poz.wikia-dev.com/discussion/3035/leaderboard/reports', (schema, request) => {
		return userActivityReportsFixtures;
	});
}
