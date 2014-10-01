/// <reference path="../../baseline/Wikia.d.ts" />
'use strict';

declare var $script: Function;

/**
* @description This module is an alias for whatever script loader implementation
* we are using. Use this stub to normalize/expose the features available to Wikia
* developers and also to allow for swapping implementations in the future.
*/
module Wikia.Utils {
	export function load () {
		return $script.apply(null, arguments);
	};
}
