(function () {
	var shoeboxCache = {};

	function getProp(obj, path) {
		// TODO split, join, split, this can be optimized
		var parts = path.split('.'),
			value = obj,
			i,
			length;

		if (parts.length > 1) {
			length = parts.length;

			for (i = 0; i < length; i++) {
				if (!value.hasOwnProperty(parts[i])) {
					return;
				}

				value = value[parts[i]];
			}

			return value;
		}

		return obj[path];
	}

	M.getFromShoebox = function (path) {
		var parts = path.split('.'),
			key = parts.shift(),
			el = document.querySelector('#shoebox-' + key),
			shoeboxItem,
			valueString;

		if (!el) {
			return;
		}
		valueString = el.textContent;
		if (!valueString) {
			return;
		}

		shoeboxItem = JSON.parse(valueString);
		shoeboxCache[key] = shoeboxItem;

		if (parts.length === 0) {
			return shoeboxItem;
		}

		return getProp(shoeboxItem, parts.join('.'));
	};
})();
