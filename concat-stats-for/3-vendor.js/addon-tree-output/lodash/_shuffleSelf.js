define('lodash/_shuffleSelf', ['exports', 'lodash/_baseRandom'], function (exports, _baseRandom) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
        var index = -1,
            length = array.length,
            lastIndex = length - 1;

        size = size === undefined ? length : size;
        while (++index < size) {
            var rand = (0, _baseRandom.default)(index, lastIndex),
                value = array[rand];

            array[rand] = array[index];
            array[index] = value;
        }
        array.length = size;
        return array;
    }

    exports.default = shuffleSelf;
});