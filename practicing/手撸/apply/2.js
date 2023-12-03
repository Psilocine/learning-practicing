Function.prototype.apply2 = function (context, args) {
  if (typeof context !== "object") return;

  const ctx = context || window;

  const fn = Symbol();

  ctx[fn] = this;

  args = args ? args : [];

  const result = ctx[fn](...args);
  delete ctx[fn];

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

// test.apply(obj, [1, 2, 3]);

test.apply2(obj, [1, 2, 3])

// 非对象作用域
test.apply2(2)
