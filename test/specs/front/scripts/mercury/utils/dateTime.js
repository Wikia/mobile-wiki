QUnit.module('Date/time util functions');

test('timeAgo works correct', function () {
	var DateTime = require('mercury/utils/dateTime'),
		testCases = [
		{
			from: new Date('October 13, 2014 11:13:00'),
			to: new Date('October 13, 2014 11:13:00'),
			expected: {
				type: DateTime.Interval.Now,
				value: 0
			}
		}, {
			from: new Date('October 13, 2014 11:12:30'),
			to: new Date('October 13, 2014 11:13:00'),
			expected: {
				type: DateTime.Interval.Second,
				value: 30
			}
		}, {
			from: new Date('October 13, 2014 11:11:30'),
			to: new Date('October 13, 2014 11:13:00'),
			expected: {
				type: DateTime.Interval.Minute,
				value: 1
			}
		}, {
			from: new Date('October 13, 2014 10:11:30'),
			to: new Date('October 13, 2014 11:13:00'),
			expected: {
				type: DateTime.Interval.Hour,
				value: 1
			}
		}, {
			from: new Date('October 12, 2014 10:11:30'),
			to: new Date('October 13, 2014 11:13:00'),
			expected: {
				type: DateTime.Interval.Day,
				value: 1
			}
		}, {
			from: new Date('September 12, 2014 10:11:30'),
			to: new Date('October 13, 2014 11:13:00'),
			expected: {
				type: DateTime.Interval.Month,
				value: 1
			}
		}, {
			from: new Date('October 12, 2013 10:11:30'),
			to: new Date('October 13, 2014 11:13:00'),
			expected: {
				type: DateTime.Interval.Year,
				value: 1
			}
		}
	];
	testCases.forEach(function (testCase) {
		var result = DateTime.timeAgo(testCase.from, testCase.to);
		deepEqual(result, testCase.expected);
	});
});
