/**
* @summary This function will resolve the arguments to a string of classes that is to be used in our elements
* @param {String | Array<String> | Object} args
* @returns String

* Usecases
  classes('foo', { bar: true }); // => 'foo bar'
  classes({ 'foo-bar': true }); // => 'foo-bar'
  classes({ 'foo-bar': false }); // => ''
  classes({ foo: true, bar: true }); // => 'foo bar'
  let arr = ['b', { c: true, d: false }]; classes(...arr); // => 'b c'
* */
const classes = (...args) => {
  const flattenedArray = args.flat();
  const n = flattenedArray.length;
  const newArray = [];
  for (let i = 0; i < n; i++) {
    const a = flattenedArray.pop(i);
    if (typeof a === "object") {
      for (const key in a) {
        a[key] ? newArray.push(key) : "";
      }
    } else {
      newArray.push(a);
    }
  }
  return newArray.join(" ");
};

export default classes;
