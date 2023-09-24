function cloneDeep(obj: object) {
  if (obj == null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof String) {
    return new String(obj);
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (obj instanceof Number) {
    return new Number(obj);
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  if (obj instanceof Boolean) {
    return new Boolean(obj);
  }

  // handle other objects if required

  var clone = {};
  if (obj instanceof Array) {
    clone = new Array(obj.length);
  }
  for (var key in obj) {
    clone[key] = cloneDeep(obj[key]);
  }
  return clone;
}

/** Used as references for various `Number` constants. */
const INFINITY = 1 / 0;
const MAX_INTEGER = 1.7976931348623157e308;
function toFinite(value) {
  if (!value) {
    return 0;
  }
  if (value === INFINITY || value === -INFINITY) {
    const sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/** Built-in method references without a dependency on `root`. */
const freeParseFloat = parseFloat;
function random(lower: number, upper?: number) {
  if (lower === undefined && upper === undefined) {
    lower = 0;
    upper = 1;
  } else {
    lower = toFinite(lower);
    if (upper === undefined) {
      upper = lower;
      lower = 0;
    } else {
      upper = toFinite(upper);
    }
  }
  if (lower > upper) {
    const temp = lower;
    lower = upper;
    upper = temp;
  }
  if (lower % 1 || upper % 1) {
    const rand = Math.random();
    const randLength = `${rand}`.length - 1;
    return Math.min(
      lower + rand * (upper - lower + freeParseFloat(`1e-${randLength}`)),
      upper
    );
  }
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

export default { cloneDeep, random, toFinite };
