function deepExtend(out = {}, ...rest) {
  rest.forEach((obj) => {
    if (obj) {
      Object.entries(obj).forEach(([key, value]) => {
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
