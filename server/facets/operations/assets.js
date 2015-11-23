import * as path from 'path';

const assetsHandler = {
	directory: {
		path: path.join(__dirname, '../../../front'),
		listing: false,
		index: false,
		lookupCompressed: true
	}
};

export default assetsHandler;
