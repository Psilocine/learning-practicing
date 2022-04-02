# bind

bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```javascript
Function.prototype.myBind2 = function (context, ...args) {
  const fn = this;
  args = args ? args : [];
  return function newFn(...newFnArgs) {
    if (this instanceof newFn) {
      return new fn(...args, ...newFnArgs);
    }
    return fn.apply(context, [...args, ...newFnArgs]);
  };
};
```

## 问题

原生的 bind 函数有个问题，当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效

```javascript
var value = 2;

var foo = {
  value: 1,
};

function bar(name, age) {
  this.habit = "shopping";
  console.log(this.value);
  console.log(name);
  console.log(age);
}

bar.prototype.friend = "kevin";

var bindFoo = bar.bind(foo, "daisy");

var obj = new bindFoo("18");
// undefined -------- 注意这里
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

我们可以通过修改返回的函数的原型来实现
