/// <reference path="../../baseline/mercury.d.ts" />

module Mercury.Utils.DateTime {

	interface TimeAgoResult {
		type: Interval
		value: number
	}

	export enum Interval {
		Now,
		Second,
		Minute,
		Hour,
		Day,
		Month,
		Year
	}

	export function timeAgo (from: Date, to: Date): TimeAgoResult {
		var timeDiff = Math.floor((to.getTime() - from.getTime()) / 1000);

		if (timeDiff == 0) {
			return {
				type: Interval.Now,
				value: 0
			};
		}
		// seconds
		if (timeDiff < 60) {
			return {
				type: Interval.Second,
				value: timeDiff
			};
		}
		// minutes
		timeDiff = Math.floor(timeDiff / 60);
		if (timeDiff < 60) {
			return {
				type: Interval.Minute,
				value: timeDiff
			};
		}
		// hours
		timeDiff = Math.floor(timeDiff / 60);
		if (timeDiff < 24) {
			return {
				type: Interval.Hour,
				value: timeDiff
			}
		}
		// days
		timeDiff = Math.floor(timeDiff / 24);
		if (timeDiff < 30) {
			return {
				type: Interval.Day,
				value: timeDiff
			}
		}
		// months
		timeDiff = Math.floor(timeDiff / 30);
		if (timeDiff < 12) {
			return {
				type: Interval.Month,
				value: timeDiff
			}
		}
		// years
		timeDiff = Math.floor(timeDiff / 12);
		return {
			type: Interval.Year,
			value: timeDiff
		}
	}

}
