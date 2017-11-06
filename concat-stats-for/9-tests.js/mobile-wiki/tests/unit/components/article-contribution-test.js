define('mobile-wiki/tests/unit/components/article-contribution-test', ['ember-qunit', 'require', 'sinon'], function (_emberQunit, _require2, _sinon) {
	'use strict';

	var trackModule = (0, _require2.default)('mobile-wiki/utils/track');
	var trackStub = void 0;

	/**
  * @param {object} testThis
  * @param {bool} editAllowed
  * @returns {*} instance of article-contribution component
  */
	function createComponent(testThis) {
		var editAllowed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		var section = 3,
		    sectionId = 'myId',
		    title = 'hello world',
		    uploadFeatureEnabled = true;

		return testThis.subject({
			section: section,
			sectionId: sectionId,
			title: title,
			uploadFeatureEnabled: uploadFeatureEnabled,
			editAllowed: editAllowed
		});
	}

	(0, _emberQunit.moduleForComponent)('article-contribution', 'Unit | Component | article contribution', {
		unit: true,
		needs: ['service:i18n', 'service:wiki-variables'],

		beforeEach: function beforeEach() {
			trackStub = _sinon.default.stub(trackModule, 'track');
		},
		afterEach: function afterEach() {
			trackStub.restore();
		}
	});

	(0, _emberQunit.test)('component is initialized', function (assert) {
		var section = 3,
		    sectionId = 'myId',
		    title = 'hello world',
		    uploadFeatureEnabled = true,
		    component = createComponent(this);

		assert.equal(component.section, section);
		assert.equal(component.sectionId, sectionId);
		assert.equal(component.title, title);
		assert.equal(component.uploadFeatureEnabled, uploadFeatureEnabled);
	});

	(0, _emberQunit.test)('edit action without editAllowed redirects to login', function (assert) {
		var openLocationSpy = _sinon.default.spy(),
		    component = createComponent(this, false);

		component.openLocation = openLocationSpy;
		component.send('edit');
		assert.ok(openLocationSpy.calledOnce);
	});
});