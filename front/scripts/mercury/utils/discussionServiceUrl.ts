/// <reference path="../../baseline/mercury.d.ts" />

module Mercury.Utils {
	export function getDiscussionServiceUrl(): string {
		return 'https://' + M.prop('servicesDomain') + '/' + M.prop('discussionBaseRoute');
	}
}
