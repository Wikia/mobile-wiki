import {join} from 'path';

// This can't be a default export because it would clash with babel-plugin-rewire which we use in tests
// It adds __RewireAPI__ property that causes Hapi to fail with `Error: Invalid routeConfig options (/front/{path*})`
export const handler = {
	directory: {
		path: join(__dirname, '../../../../front'),
		listing: false,
		index: false,
		lookupCompressed: true
	}
};
