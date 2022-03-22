# 节流

节流的原理：如果你持续触发事件，每个一段时间，只执行一次事件。
根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。


## 使用时间戳

当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳（最开始值设为 0），如果大于设置的时间周期，就执行函数，然后更新时间戳为当前时间戳，如果小于则不执行。

**第一版**

```javascript
function throttle(func, wait) {
  var context, args;
  var previous = 0;

  return function () {
    var now = +new Date();
    context = this;
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  }
}

```

## 使用定时器

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

**第二版**

```javascript
function throttle(func, wait) {
  var timeout, context, args;
  var previous = 0;

  return function () {
    context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(function () {
        clearTimeout(timeout);
        timeout = null;
        func.apply(context, args);
      }, wait)
    }
  }
}
```

> 第一种事件会立即执行，第二种事件会在 n 秒后第一次执行
> 第一种事件停止触发后不再执行事件，第二种事件停止后还会再执行一次

## 双剑合璧

如果我们想要有头有尾，则需要综合两种方法的优势

**第三版**

```javascript
function throttle(func, wait) {
  var timeout, context, args;
  var previous = 0;

  var later = function () {
    previous = +new Date();
    timeout = null;
    func.apply(context, args)
  };

  var throttled = function () {
    var now = +new Date();
    // 下次触发 func 剩余的时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    // 如果没有剩余的时间了或者你改了系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };

  return throttled;
}
```

但是我有时希望有头无尾、无头有尾呢？
那我们设置个 options 作为第三个参数，然后判断需要哪种效果，我们约定：

leading：false 表示禁用第一次执行
trailing：false 表示禁用停止触发的回调

**第四版**

```javascript
function throttle(func, wait, options) {
  var timeout, context, args;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  }

  var throttled = function () {
    var now = +new Date();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;

    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  
  return throttled;
}
```

希望 throttle 还能有一个 cancel 方法，来取消停止触发的执行

**第五版**

```javascript
// ... 第四版代码
throttled.cancel = function() {
  clearTimeout(timeout);
  previous = 0;
  timeout = null;
}

return throttled;
```
