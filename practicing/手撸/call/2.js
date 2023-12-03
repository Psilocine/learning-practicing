Function.prototype.call2 = function (ctx, ...args) {
  if (typeof ctx !== "object") return;

  const context = ctx || window;

  const _fn = Symbol();

  context[_fn] = this;

  args = args ? args : [];

  const result = context[_fn](...args);

  delete context[_fn];

  return result;
};

/* test case */
value = "global";

var obj = {
  value: "local",
  _fn: "can't be delete",
};

function test(arg1, arg2, arg3) {
  console.log(this.value);

  console.log("arguments:");
  console.log(arg1, arg2, arg3);
}

test();

// test.call(obj, 1, 2, 3);

// test.call2(obj, 1, 2, 3)

// 非对象作用域
test.call2(2);
