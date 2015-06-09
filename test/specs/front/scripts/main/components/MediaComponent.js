moduleForComponent('media', 'MediaComponent');

test('Is this media inside infobox?', function () {
	var component = this.subject(),
		testCases = [
			{
				media: {
					context: 'infobox-big',
					width: 50,
					height: 50
				},
				insideInfobox: true,
				expected: false,
				expectedWidth: null,
				expectedHeight: null,
				description: 'the main infobox image'
			},
			{
				media: {
					context: 'infobox-big',
					width: 50,
					height: 50
				},
				insideInfobox: false,
				expected: false,
				expectedWidth: null,
				expectedHeight: null,
				description: 'should hever happen'
			},
			{
				media: {
					context: '',
					width: 50,
					height: 50
				},
				insideInfobox: true,
				expected: true,
				expectedWidth: 20,
				expectedHeight: 20,
				description: 'the icon infobox image'
			},
			{
				media: {
					context: '',
					width: 55,
					height: 13
				},
				insideInfobox: true,
				expected: true,
				expectedWidth: 84,
				expectedHeight: 20,
				description: 'the icon infobox image'
			},
			{
				media: {
					context: '',
					width: 18,
					height: 53
				},
				insideInfobox: true,
				expected: true,
				expectedWidth: 6,
				expectedHeight: 20,
				description: 'the icon infobox image'
			},
			{
				media: {
					context: '',
					width: 50,
					height: 50
				},
				insideInfobox: false,
				expected: false,
				expectedWidth: null,
				expectedHeight: null,
				description: 'normal article image'
			}
		];

	var isInsideInfobox = sinon.stub(component, 'isInsideInfobox');
	component.set('infoboxIconSize.height', 20);

	Ember.run(function () {
		testCases.forEach(function(testCase) {
			component.set('width', null);
			component.set('height', null);
			isInsideInfobox.returns(testCase.insideInfobox);
			component.set('media', testCase.media);

			equal(component.get('isInfoboxIcon'), testCase.expected, testCase.description);
			equal(component.get('width'), testCase.expectedWidth, 'Width in ' + testCase.description);
			equal(component.get('height'), testCase.expectedHeight, 'Height in ' + testCase.description);
		});
	});
});
