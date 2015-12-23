QUnit.module('mercury/utils/dateTime', function () {
	QUnit.test('timeAgo works correct', function (assert) {
		var DateTime = mrequire('mercury/utils/dateTime'),
				testCases = [
					{
						from: new Date('October 13, 2014 11:13:00'),
						to: new Date('October 13, 2014 11:13:00'),
						expected: {
							type: DateTime.interval.Now,
							value: 0
						}
					}, {
						from: new Date('October 13, 2014 11:12:30'),
						to: new Date('October 13, 2014 11:13:00'),
						expected: {
							type: DateTime.interval.Second,
							value: 30
						}
					}, {
						from: new Date('October 13, 2014 11:11:30'),
						to: new Date('October 13, 2014 11:13:00'),
						expected: {
							type: DateTime.interval.Minute,
							value: 1
						}
					}, {
						from: new Date('October 13, 2014 10:11:30'),
						to: new Date('October 13, 2014 11:13:00'),
						expected: {
							type: DateTime.interval.Hour,
							value: 1
						}
					}, {
						from: new Date('October 12, 2014 10:11:30'),
						to: new Date('October 13, 2014 11:13:00'),
						expected: {
							type: DateTime.interval.Day,
							value: 1
						}
					}, {
						from: new Date('September 12, 2014 10:11:30'),
						to: new Date('October 13, 2014 11:13:00'),
						expected: {
							type: DateTime.interval.Month,
							value: 1
						}
					}, {
						from: new Date('October 12, 2013 10:11:30'),
						to: new Date('October 13, 2014 11:13:00'),
						expected: {
							type: DateTime.interval.Year,
							value: 1
						}
					}
				];

		testCases.forEach(function (testCase) {
			var result = DateTime.timeAgo(testCase.from, testCase.to);

			assert.deepEqual(result, testCase.expected);
		});
	});
});
