(function () {
	var shoeboxCache = {};

	function getProp(obj, path) {
		// TODO split, join, split, this can be optimized
		var parts = path.split('.');

		if (parts.length > 1) {
			var value = obj,
				length = parts.length;

			for (var i = 0; i < length; i++) {
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
		var parts = path.split('.');
		var key = parts.shift();

		var el = document.querySelector('#shoebox-' + key);
		if (!el) { return; }

		var valueString = el.textContent;
		if (!valueString) { return; }

		var shoeboxItem = JSON.parse(valueString);
		shoeboxCache[key] = shoeboxItem;

		if (parts.length === 0) {
			return shoeboxItem;
		}

		return getProp(shoeboxItem, parts.join('.'));
	};
})();
