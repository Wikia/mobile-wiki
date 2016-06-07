/**
 * @returns {void}
 */
export default function () {
	// We have /front/main/assets prefix hardcoded in route and testem use /assets
	// This is a quick (hopefully temporary) fix
	this.get('/front/main/assets/vendor/cropper/cropper.min.js', {});

	this.get('/wikia.php', (schema, request) => {
		const {controller, method} = request.queryParams;

		if (controller === 'CuratedContent' && method === 'getData') {
			return schema.curatedContentEditorItems.all();
		}

		if (controller === 'SearchApi' && method === 'getList') {
			return schema.searches.first();
		}

		throw new Error(`Controller or method response isn't yet mocked`);
	});
}
