import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('article-content', 'Unit | Component | article content', {
	unit: true,
	needs: ['component:portable-infobox',
		'component:article-table-of-contents',
		'component:potential-member-page-experiment',
		'service:currentUser']
});

const mobileTopLeaderboardSelector = '.mobile-top-leaderboard';

test('ads are correctly inserted', function (assert) {
	Ember.run(() => {
		const content = '<p>some content</p><aside class="portable-infobox"></aside>',
			component = this.subject();

		component.set('content', content);

		// this.$() renders the component
		this.$();
	});

	assert.equal(this.$(mobileTopLeaderboardSelector).length, 1);
	assert.equal(
		this.$(mobileTopLeaderboardSelector).prev().get(0),
		this.$('.portable-infobox').get(0),
		'previous element is an infobox');
});

test('ads are correctly inserted', function (assert) {
	Ember.run(() => {
		const content = '<p>some content</p><div class="wiki-page-header"></div>',
			component = this.subject();

		component.set('content', content);
		// this.$() renders the component
		this.$();
	});

	assert.equal(this.$(mobileTopLeaderboardSelector).length, 1);
	assert.equal(
		this.$(mobileTopLeaderboardSelector).prev().get(0),
		this.$('.wiki-page-header').get(0),
		'previous element is site header'
	);
});

test('ads are correctly inserted', function (assert) {
	Ember.run(() => {
		const content = '<p>some content</p><div class="wiki-page-header"></div><aside class="portable-infobox"></aside>',
			component = this.subject();

		component.set('content', content);
		// this.$() renders the component
		this.$();
	});

	assert.equal(this.$(mobileTopLeaderboardSelector).length, 1, 'top leaderboard is inserted only once');
	assert.equal(
		this.$(mobileTopLeaderboardSelector).prev().get(0),
		this.$('.portable-infobox').get(0),
		'previous element is an infobox'
	);
});
