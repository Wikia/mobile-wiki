
declare module RSVP {
	interface PromiseResolve {
		(value?: any): void;
	}
	interface PromiseReject {
		(reason?: any): void;
	}
	interface PromiseResolverFunction {
		(resolve: PromiseResolve, reject: PromiseReject): void;
	}

	class Promise {

		/**
		 Promise objects represent the eventual result of an asynchronous operation. The
		 primary way of interacting with a promise is through its `then` method, which
		 registers callbacks to receive either a promise's eventual value or the reason
		 why the promise cannot be fulfilled.
		 @class RSVP.Promise
		 @param {function} resolver
		 @param {String} label optional string for labeling the promise.
		 Useful for tooling.
		 @constructor
		 */
		constructor(resolver: PromiseResolverFunction, label?: string);

		/**
		 The primary way of interacting with a promise is through its `then` method,
		 which registers callbacks to receive either a promise's eventual value or the
		 reason why the promise cannot be fulfilled.
		 @method then
		 @param {Function} onFulfilled
		 @param {Function} onRejected
		 @param {String} label optional string for labeling the promise.
		 Useful for tooling.
		 @return {Promise}
		 */
		then(onFulfilled?: Function, onRejected?: Function): Promise;

		/**
		 `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
		 as the catch block of a try/catch statement.

		 @method catch
		 @param {Function} onRejection
		 @param {String} label optional string for labeling the promise.
		 Useful for tooling.
		 @return {Promise}
		 */
		catch(onRejection: Function, label?: string): Promise;

		/**
		 `finally` will be invoked regardless of the promise's fate just as native
		 try/catch/finally behaves

		 @method finally
		 @param {Function} callback
		 @param {String} label optional string for labeling the promise.
		 Useful for tooling.
		 @return {Promise}
		 */
		finally(callback: Function, label?: string): Promise;
	}
}
