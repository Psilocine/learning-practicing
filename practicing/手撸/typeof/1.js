function isType(type) {
  return (ctx) => {
    return Object.prototype.toString.call(ctx) === `[object ${type}]`;
  };
}

const isString = isType("String");
