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
	Now: 0,
	Second: 1,
	Minute: 2,
	Hour: 3,
	Day: 4,
	Month: 5,
	Year: 6
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
			type: interval.Now,
			value: 0
		};
	}
	// seconds
	if (timeDiff < 60) {
		return {
			type: interval.Second,
			value: timeDiff
		};
	}
	// minutes
	timeDiff = Math.floor(timeDiff / 60);
	if (timeDiff < 60) {
		return {
			type: interval.Minute,
			value: timeDiff
		};
	}
	// hours
	timeDiff = Math.floor(timeDiff / 60);
	if (timeDiff < 24) {
		return {
			type: interval.Hour,
			value: timeDiff
		};
	}
	// days
	timeDiff = Math.floor(timeDiff / 24);
	if (timeDiff < 30) {
		return {
			type: interval.Day,
			value: timeDiff
		};
	}
	// months
	timeDiff = Math.floor(timeDiff / 30);
	if (timeDiff < 12) {
		return {
			type: interval.Month,
			value: timeDiff
		};
	}
	// years
	timeDiff = Math.floor(timeDiff / 12);

	return {
		type: interval.Year,
		value: timeDiff
	};
}
