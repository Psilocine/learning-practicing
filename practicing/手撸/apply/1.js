Function.prototype.apply2 = function (context, args) {
  if (typeof context !== 'object') return;
  var context = context || window;

  args = args ? args : [];
  
  const _fn = Symbol();
  context[_fn] = this;

  const result = context[_fn](...args);

  delete context[_fn];

  return result;
}

/* test case */
value = 'global';

var obj = {
  value: 'local',
  _fn: 'can\'t be delete'
}

function test(arg1, arg2, arg3) {
  console.log(this.value)

  console.log('arguments:')
  console.log(arg1, arg2, arg3)
}

test()

test.apply(obj, [1, 2, 3])

test.apply2(obj, [1, 2, 3])

// 非对象作用域
test.apply2(2)
