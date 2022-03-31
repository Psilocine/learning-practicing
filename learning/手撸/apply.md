# apply

apply() 方法调用一个具有给定this值的函数，以及以一个数组（或类数组对象）的形式提供的参数。

```javascript
// apply 接受兩个參數
Function.prototype.apply2 = function (context, args) {
    // 防止传入非对象的情况
    if (typeof context !== 'object') return;
    // 防止传入 null 的情况
    var context = context || window;

    args = args ? args : [];

    const _fn = Symbol();
    context[_fn] = this;

    const result = context[_fn](...args);

    delete context[_fn];
    return result;
}
```