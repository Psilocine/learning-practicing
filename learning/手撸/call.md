# call

call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

```javascript
// call 接受多个参数
Function.prototype.call2 = function (context, ...args) {
  // 防止传入非对象的情况
  if (typeof context !== "object") return;
  // 防止传入 null 的情况
  var context = context || window;

  // 防止和传入作用域字段冲突
  const _fn = Symbol();
  context[_fn] = this;

  args = args ? args : [];

  const result = context[_fn](...args);

  delete context[_fn];

  return result;
};
```
