moduleFor('model:infoboxBuilder', 'InfoboxBuilderModel', {});

test('checks if moving item in infoboxState by given offset is valid', function () {
	var model = App.InfoboxBuilderModel.create({}),
		cases = [
			{
				position: 0,
				offset: 1,
				result: true
			},
			{
				position: 0,
				offset: 2,
				result: true
			},
			{
				position: 0,
				offset: 3,
				result: false
			},
			{
				position: 2,
				offset: -1,
				result: true
			},
			{
				position: 2,
				offset: -2,
				result: true
			},
			{
				position: 2,
				offset: -3,
				result: false
			},
			{
				position: 0,
				offset: -1,
				result: false
			},
			{
				position: 2,
				offset: 1,
				result: false
			}
		];

	// add 3 items to infobox state
	model.addRowItem();
	model.addRowItem();
	model.addRowItem();

	cases.forEach(function (testCase) {
		equal(model.isValidMove(testCase.position, testCase.offset), testCase.result);
	});
});
