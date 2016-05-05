import {form, json} from 'main/utils/content-type';
import {module, test} from 'qunit';

module('Unit | Utility | content type');

test('it works', (assert) => {
	assert.equal(form, 'application/x-www-form-urlencoded; charset=utf-8');
	assert.equal(json, 'application/json; charset=utf-8');
});
