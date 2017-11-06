define('mobile-wiki/mirage/fixtures/curated-content-editor-item', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		data: [{
			label: 'Section 1',
			image_id: 2202,
			items: [{
				article_id: 2216,
				image_id: 2216,
				items: '',
				label: 'Category Test',
				title: 'Category:Test',
				type: 'category',
				image_url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
				node_type: 'item'
			}],
			image_crop: {
				square: {
					x: 92,
					y: 0,
					width: 412,
					height: 412
				}
			},
			image_url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
			node_type: 'section'
		}, {
			label: 'Section 2',
			image_id: 2361,
			items: [{
				article_id: 2303,
				image_id: 2303,
				items: '',
				label: 'Category Test 2',
				title: 'Category:Test2',
				type: 'category',
				image_url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
				node_type: 'item'
			}],
			image_crop: {
				square: {
					x: 114,
					y: 0,
					width: 381,
					height: 381
				}
			},
			image_url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
			node_type: 'section'
		}, {
			label: 'Featured Content',
			image_id: 0,
			items: [{
				article_id: 2178,
				image_id: 2364,
				image_crop: {
					landscape: {
						x: 0,
						y: 699,
						width: 2344,
						height: 1319
					}
				},
				items: '',
				label: 'Featured item',
				title: 'Test',
				type: 'article',
				image_url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
				node_type: 'item'
			}],
			featured: 'true',
			node_type: 'section'
		}, {
			label: '',
			image_id: 0,
			items: [{
				article_id: 1766,
				image_id: 2182,
				image_crop: {
					square: {
						x: 0,
						y: 0,
						width: 620,
						height: 620
					}
				},
				items: '',
				label: 'Optional category',
				title: 'Category:Test3',
				type: 'category',
				image_url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
				node_type: 'item'
			}],
			node_type: 'section'
		}]
	};
});