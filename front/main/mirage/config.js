/**
 * @returns {void}
 */
export default function () {
	// We have /front/main/assets prefix hardcoded in route and testem use /assets
	// This is a quick (hopefully temporary) fix
	this.get('/front/main/assets/vendor/cropper/cropper.min.js', {});

	this.get('/wikia.php', (schema, request) => {
		const {controller, method, title, section, category} = request.queryParams;

		if (controller === 'MercuryApi') {
			if (method === 'getPage') {
				// Curated Main Page Data
				if (title === 'Mercury_CC_Wikia') {
					return schema.curatedContents.first();
				}
			}

			if (method === 'getCuratedContentSection') {
				if (section === 'Categories') {
					return schema.curatedContentSections.first();
				}
			}
		}

		if (controller === 'ArticlesApi' && method === 'getList' && category === 'Articles') {
			return schema.curatedContentCategories.first();
		}

		if (controller === 'CuratedContent' && method === 'getData') {
			return schema.curatedContentEditorItems.all();
		}

		if (controller === 'SearchApi' && method === 'getList') {
			return schema.searches.first();
		}

		throw new Error(`Controller or method response isn't yet mocked`);
	});
}
