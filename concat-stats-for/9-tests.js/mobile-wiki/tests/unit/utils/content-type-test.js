define('mobile-wiki/tests/unit/utils/content-type-test', ['mobile-wiki/utils/content-type', 'qunit'], function (_contentType, _qunit) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | content type');

	(0, _qunit.test)('it works', function (assert) {
		assert.equal(_contentType.form, 'application/x-www-form-urlencoded; charset=utf-8');
		assert.equal(_contentType.json, 'application/json; charset=utf-8');
	});
});