import Ember from 'ember';
import {module} from 'qunit';
import CuratedContentThumbnailMixin from 'main/mixins/curated-content-thumbnail';
import {test} from 'ember-qunit';

module('Unit | Mixin | curated content thumbnail', () => {
	test('sets aspectRatio property correctly', (assert) => {
		const mixin = Ember.Object.extend(CuratedContentThumbnailMixin).create();

		mixin.set('block', 'featured');
		assert.equal(mixin.get('aspectRatio'), 16 / 9);

		mixin.set('block', 'curated');
		assert.equal(mixin.get('aspectRatio'), 1);

		mixin.set('block', 'optional');
		assert.equal(mixin.get('aspectRatio'), 1);
	});

	test('sets aspectRatioName property correctly', (assert) => {
		const mixin = Ember.Object.extend(CuratedContentThumbnailMixin).create();

		mixin.set('aspectRatio', 16 / 9);
		assert.equal(mixin.get('aspectRatioName'), 'landscape');

		mixin.set('aspectRatio', 1);
		assert.equal(mixin.get('aspectRatioName'), 'square');
	});

	test('sets imageHeight property correctly', (assert) => {
		const mixin = Ember.Object.extend(CuratedContentThumbnailMixin).create();

		mixin.setProperties({
			aspectRatio: 16 / 9,
			imageWidth: 400
		});
		assert.equal(mixin.get('imageHeight'), 400 / (16 / 9));

		mixin.setProperties({
			aspectRatio: 1,
			imageWidth: 200
		});
		assert.equal(mixin.get('imageHeight'), 200);
	});

	test('generates thumbnail URL correctly with image crop data', (assert) => {
		const imageUrl = 'http://vignette/image.jpg',
			imageWidth = 400,
			imageCrop = {
				x: 100,
				y: 100,
				width: 1600,
				height: 900
			},
			mixin = Ember.Object.extend(CuratedContentThumbnailMixin).create();

		mixin.setProperties({
			thumbnailer: {
				mode: {
					windowCrop: 'window-crop'
				}
			},
			cropMode: 'top-crop',
			imageWidth
		});

		mixin.thumbnailer.getThumbURL = function (url, {mode, width, xOffset1, yOffset1, xOffset2, yOffset2}) {
			return `${url}/${mode}/${width}/${xOffset1}/${yOffset1}/${xOffset2}/${yOffset2}`;
		};

		assert.equal(
			mixin.generateThumbUrl(imageUrl, imageCrop),
			`http://vignette/image.jpg/window-crop/\
${imageWidth}/${imageCrop.x}/${imageCrop.y}/${imageCrop.x + imageCrop.width}/${imageCrop.y + imageCrop.height}`
		);
	});

	test('generates thumbnail URL correctly without image crop data', (assert) => {
		const imageUrl = 'http://vignette/image.jpg',
			imageWidth = 400,
			imageHeight = 225,
			mixin = Ember.Object.extend(CuratedContentThumbnailMixin).create();

		mixin.setProperties({
			cropMode: 'top-crop',
			imageHeight,
			imageWidth
		});

		mixin.thumbnailer.getThumbURL = function (url, {mode, width, height}) {
			return `${url}/${mode}/${width}/${height}`;
		};

		assert.equal(
			mixin.generateThumbUrl(imageUrl),
			`http://vignette/image.jpg/top-crop/${imageWidth}/${imageHeight}`
		);
	});
});
