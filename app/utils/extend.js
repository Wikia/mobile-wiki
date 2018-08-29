function deepExtend(out = {}, ...rest) {
  rest.forEach((obj) => {
    if (obj) {
      Object.entries(obj).forEach((property) => {
        const key = property[0];
        const value = property[1];

        if (value && typeof value === 'object') {
          if (!out[key] && Array.isArray(value)) {
            out[key] = [];
          }
          out[key] = deepExtend(out[key], value);
        } else {
          out[key] = value;
        }
      });
    }
  });

  return out;
}

export default function () {
  if (typeof FastBoot !== 'undefined') {
    return FastBoot.require('deep-extend')(...arguments);
  }
  return deepExtend(...arguments);
}
