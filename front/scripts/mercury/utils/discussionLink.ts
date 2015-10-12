module Mercury.Utils {
	export function getDiscussionLink: string {
		return 'https://' + M.prop('servicesDomain') + '/' + M.prop('discussionBaseRoute');
	}
}
