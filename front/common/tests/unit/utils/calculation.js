QUnit.module('mercury/utils/calculation', function () {
	QUnit.test('container size calculation', function (assert) {
		var testCases = [
			//horizontal viewport
			{
				maxWidth: 640,
				maxHeight: 480,
				contentWidth: 1280,
				contentHeight: 720,
				expectedOutput: {
					width: 640,
					height: 480
				}
			},
			{
				maxWidth: 640,
				maxHeight: 480,
				contentWidth: 320,
				contentHeight: 300,
				expectedOutput: {
					width: 512,
					height: 480
				}
			},
			{
				maxWidth: 640,
				maxHeight: 480,
				contentWidth: 720,
				contentHeight: 1280,
				expectedOutput: {
					width: 270,
					height: 480
				}
			},

			//vertical viewport
			{
				maxWidth: 480,
				maxHeight: 640,
				contentWidth: 1280,
				contentHeight: 720,
				expectedOutput: {
					width: 480,
					height: 270
				}
			},
			{
				maxWidth: 480,
				maxHeight: 640,
				contentWidth: 1280,
				contentHeight: 1200,
				expectedOutput: {
					width: 480,
					height: 450
				}
			},
			{
				maxWidth: 480,
				maxHeight: 640,
				contentWidth: 720,
				contentHeight: 1280,
				expectedOutput: {
					width: 480,
					height: 640
				}
			}
		];

		testCases.forEach(function (testCase) {
			assert.deepEqual(
					mrequire('mercury/utils/calculation').containerSize(
							testCase.maxWidth, testCase.maxHeight, testCase.contentWidth, testCase.contentHeight
					),
					testCase.expectedOutput
			);
		});
	});
});
