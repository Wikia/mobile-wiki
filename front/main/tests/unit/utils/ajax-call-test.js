import Ember from 'ember';
import {test} from 'ember-qunit';
import {module} from 'qunit';
import sinon from 'sinon';
import ajaxCall from 'main/utils/ajax-call';

module('Unit | Utils | ajax call', (hooks) => {
	let spy;

	hooks.beforeEach(() => {
		spy = sinon.spy($, 'ajax');
	});

	hooks.afterEach(() => {
		// Restore default ajax behavior
		$.ajax.restore();
	});

	test('Checking ajaxCall utils request params.', (assert) => {
		const testCases = [
			{
				title: 'Default options',
				options: {
					success() {
						Ember.RSVP.resolve(this);
					},
					error() {
						Ember.RSVP.resolve(this);
					}
				},
				expected: {
					contentType: 'application/json',
					dataType: 'json',
					method: 'GET',
					xhrFields: {
						withCredentials: true
					},
					success() {
						Ember.RSVP.resolve(this);
					},
					error() {
						Ember.RSVP.resolve(this);
					}
				}
			}, {
				title: 'Passing options to ajax call',
				options: {
					contentType: 'application/json',
					dataType: 'json',
					method: 'PUT',
					success() {
						Ember.RSVP.resolve(this);
					},
					error() {
						Ember.RSVP.resolve(this);
					}
				},
				expected: {
					contentType: 'application/json',
					dataType: 'json',
					method: 'PUT',
					xhrFields: {
						withCredentials: true
					},
					success() {
						Ember.RSVP.resolve(this);
					},
					error() {
						Ember.RSVP.resolve(this);
					}
				}
			}, {
				title: 'Extending defaults',
				options: {
					dataType: 'xml',
					xhrFields: {
						withCredentials: false
					},
					success() {
						Ember.RSVP.resolve(this);
					},
					error() {
						Ember.RSVP.resolve(this);
					}
				},
				expected: {
					contentType: 'application/json',
					dataType: 'xml',
					method: 'GET',
					xhrFields: {
						withCredentials: false
					},
					success() {
						Ember.RSVP.resolve(this);
					},
					error() {
						Ember.RSVP.resolve(this);
					}
				}
			}
		];

		let testOut;

		testCases.forEach((testCase) => {
			ajaxCall(testCase.options);
			testOut = $.ajax.getCall(0);

			assert.propEqual(testCase.expected, testOut.args[0]);
			spy.reset();
		});
	});
});
