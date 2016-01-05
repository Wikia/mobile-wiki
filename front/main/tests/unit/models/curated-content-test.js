import {test, moduleFor} from 'ember-qunit';

const curatedContentModelClass = require('main/models/curated-content').default;

moduleFor('model:curated-content', 'Unit | Model | curated-content', {
	beforeEach() {
		Mercury.wiki.articlePath = '/wiki/';
	}
});

test('sanitizes sections', (assert) => {
	assert.deepEqual(curatedContentModelClass.sanitizeItem({
		title: 'Title',
		image_url: 'http://vignette/image.jpg',
		type: 'section'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'section'
	});
});

test('sanitizes categories', (assert) => {
	assert.deepEqual(curatedContentModelClass.sanitizeItem({
		label: 'Title',
		image_url: 'http://vignette/image.jpg',
		type: 'category',
		article_local_url: '/wiki/Category:CategoryName'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'category',
		categoryName: 'CategoryName'
	});

	assert.deepEqual(curatedContentModelClass.sanitizeItem({
		title: 'Title',
		image_url: 'http://vignette/image.jpg',
		type: 'category',
		url: '/wiki/Category:CategoryName'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'category',
		categoryName: 'CategoryName'
	});
});

test('sanitizes other items', (assert) => {
	assert.deepEqual(curatedContentModelClass.sanitizeItem({
		title: 'Title',
		thumbnail: 'http://vignette/image.jpg',
		type: 'article',
		url: '/wiki/Article'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'article',
		url: '/wiki/Article'
	});

	assert.deepEqual(curatedContentModelClass.sanitizeItem({
		title: 'Title',
		thumbnail: 'http://vignette/image.jpg',
		ns: 500,
		url: '/wiki/Blog:Post'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'blog',
		url: '/wiki/Blog:Post'
	});
});

