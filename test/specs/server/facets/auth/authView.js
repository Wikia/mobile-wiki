QUnit.module('facets/auth/authView');

test('getRedirectUrl', function () {
	var testCases = [
		{
			redirect: 'http://muppet.wikia.com/wiki/Kermit?action=edit',
			host: 'localhost:8000',
			expected: 'http://muppet.wikia.com/wiki/Kermit?action=edit',
			description: 'Whitelists wikia.com domain'
		},
		{
			redirect: 'http://glee.devbox.wikia-dev.com/wiki/Rachel_Berry',
			host: 'glee.devbox.wikia-dev.com',
			expected: 'http://glee.devbox.wikia-dev.com/wiki/Rachel_Berry',
			description: 'Allow current domain'
		},
		{
			redirect: '/wiki/Kermit',
			host: 'muppet.wikia.com',
			expected: '/wiki/Kermit',
			description: 'Allow local URLs'
		},
		{
			redirect: undefined,
			host: 'glee.devbox.wikia-dev.com',
			expected: '/',
			description: 'Fallback to / when empty redirect'
		},
		{
			redirect: 'http://www.google.com',
			host: 'glee.wikia.com',
			expected: '/',
			description: 'Fallback to / when domain is not permitted'
		},
		{
			redirect: 'http://www.google.com/?domain=wikia.com',
			host: 'glee.wikia.com',
			expected: '/',
			description: 'Don\'t allow external domain when whitelisted domain is in URL'
		},
		{
			redirect: 'http://www.google.com/?domain=glee.devbox.wikia-dev.com',
			host: 'glee.devbox.wikia-dev.com',
			expected: '/',
			description: 'Don\'t allow external domain when current domain is in URL'
		},
		{
			redirect: 'http://www.wikia.com.google.com/',
			host: 'wikia.com',
			expected: '/',
			description: 'Don\'t allow external domain when current wikia.com is put as subdomain'
		},
		{
			redirect: 'http://otherdomainwikia.com',
			host: 'glee.devbox.wikia-dev.com',
			expected: '/',
			description: 'Don\'t allow external domain when wikia.com is the last part of an external domain'
		},
		{
			redirect: 'http://otherdomainwikia.com',
			host: 'wikia.com',
			expected: '/',
			description: 'Don\'t allow external domain when wikia.com is the last part of an external domain'
		}
	];

	testCases.forEach(function (testCase) {
		var request = {
			query: {
				redirect: testCase.redirect
			},
			headers: {
				host: testCase.host
			}
		};
		equal(global.getRedirectUrl(request), testCase.expected, testCase.description);
	});
});
