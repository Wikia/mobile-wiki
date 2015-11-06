/**
 * Helper functions to deal with Date and time
 */

/**
 * @typedef {Object} TimeAgoResult
 * @property {number} type
 * @property {number} value
 */

/**
 * interval types
 */
export const interval = {
	now: 0,
	second: 1,
	minute: 2,
	hour: 3,
	day: 4,
	month: 5,
	year: 6
};

/**
 * Returns interval type and value given two dates
 *
 * @param {Date} from - Date in the past
 * @param {Date} [to=new Date()] - Optional date in the future. Defaults to current date/time
 * @returns {TimeAgoResult}
 */
export function timeAgo(from, to = new Date()) {
	let timeDiff = Math.floor((to.getTime() - from.getTime()) / 1000);

	if (timeDiff === 0) {
		return {
			type: interval.now,
			value: 0
		};
	}
	// seconds
	if (timeDiff < 60) {
		return {
			type: interval.second,
			value: timeDiff
		};
	}
	// minutes
	timeDiff = Math.floor(timeDiff / 60);
	if (timeDiff < 60) {
		return {
			type: interval.minute,
			value: timeDiff
		};
	}
	// hours
	timeDiff = Math.floor(timeDiff / 60);
	if (timeDiff < 24) {
		return {
			type: interval.hour,
			value: timeDiff
		};
	}
	// days
	timeDiff = Math.floor(timeDiff / 24);
	if (timeDiff < 30) {
		return {
			type: interval.day,
			value: timeDiff
		};
	}
	// months
	timeDiff = Math.floor(timeDiff / 30);
	if (timeDiff < 12) {
		return {
			type: interval.month,
			value: timeDiff
		};
	}
	// years
	timeDiff = Math.floor(timeDiff / 12);
	return {
		type: interval.year,
		value: timeDiff
	};
}
