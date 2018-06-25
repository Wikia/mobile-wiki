import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import require from 'require';
import sinon from 'sinon';

const trackModule = require('mobile-wiki/utils/track');
let trackStub;
let goToLoginStub;

/**
 * @param {object} testThis
 * @param {boolean} editAllowed
 * @returns {*} instance of article-contribution component
 */
function createComponent(testThis, editAllowed = true) {
	const section = 3;
	const sectionId = 'myId';
	const title = 'hello world';
	const uploadFeatureEnabled = true;

	return testThis.owner.factoryFor('component:article-contribution').create({
		section,
		sectionId,
		title,
		uploadFeatureEnabled,
		editAllowed
	});
}

module('Unit | Component | article contribution', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(function () {
		const wikiUrlsService = this.owner.lookup('service:wiki-urls');

		goToLoginStub = sinon.stub(wikiUrlsService, 'goToLogin');
		trackStub = sinon.stub(trackModule, 'track');
	});

	hooks.afterEach(() => {
		trackStub.restore();
	});

	test('component is initialized', function (assert) {
		const section = 3;
		const sectionId = 'myId';
		const title = 'hello world';
		const uploadFeatureEnabled = true;
		const component = createComponent(this);

		assert.equal(component.section, section);
		assert.equal(component.sectionId, sectionId);
		assert.equal(component.title, title);
		assert.equal(component.uploadFeatureEnabled, uploadFeatureEnabled);
	});

	test('edit action without editAllowed redirects to login', function (assert) {
		const component = createComponent(this, false);

		component.send('edit');
		assert.ok(goToLoginStub.calledOnce);
	});
});
