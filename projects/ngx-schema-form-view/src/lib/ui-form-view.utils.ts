/**
 * Created by daniele on 12.07.17.
 */

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, {[key]: source[key]});
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, {[key]: source[key]});
      }
    });
  }
  return output;
}

export function mergeDeepArraySupport(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeepArraySupport(target[key], source[key]);
        }
      } else if (Array.isArray(source[key])) {
        output[key] = output[key] || []
        target[key] = target[key] || []
        for (let i = 0; i < source[key].length; i++) {
          if (isObject(source[key][i])) {
            const newItem = mergeDeepArraySupport(target[key][i], source[key][i])
            source[key][i] = newItem
          } else {
            output[key][i] = target[key][i]
          }
          console.log(`source[${key}][${i}]`)
        }
        output[key] = source[key]
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}