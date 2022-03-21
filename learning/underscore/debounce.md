# 防抖

防抖的原理就是：你尽管触发事件，但我在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行

**第一版**

```javascript
function debounce(func, wait) {
  var timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}
```

但是 this 指向和参数接收还不行，因此需要再改改

**第二版**

```javascript
function debounce(func, wait) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait)
  }
}
```

这个时候，代码已经很完善了，但是如果能先立即执行一次就更好了

**第三版**

```javascript
function debounce(func, wait, immediate) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    }
  }
}
```

再思考一个小需求，在防抖时间内希望能取消 debounce 函数，这样就又可以立刻执行了，类似 axios 的 cancelToken

**第四版**

```javascript
function debounce(func, wait, immediate) {
  var timeout;

  var debounced = function () {
    var context = this;
    var args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  }

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}
```