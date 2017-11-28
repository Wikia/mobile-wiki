export function isProperGeo(countryList = []) {
	return !!(
		countryList &&
		countryList.indexOf &&
		countryList.indexOf('XX') > -1
	);
}
