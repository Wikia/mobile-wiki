function deepExtend(out = {}, ...rest) {
  rest.forEach((obj) => {
    if (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] && typeof obj[key] === 'object') {
            if (!out[key] && Array.isArray(obj[key])) {
              out[key] = [];
            }
            out[key] = deepExtend(out[key], obj[key]);
          } else {
            out[key] = obj[key];
          }
        }
      }
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
