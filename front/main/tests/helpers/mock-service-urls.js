import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function() {
	M.prop('servicesDomain', 'localhost');
	M.prop('discussionBaseRoute', 'discussion');
	M.prop('siteAttributeBaseRoute', 'site-attribute');
};
