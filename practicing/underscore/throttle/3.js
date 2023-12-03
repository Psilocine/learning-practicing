// 1. 时间戳节流（立即执行）
function throttle(func, wait) {
  // code here
  let previous = 0;

  return function () {
    const context = this;
    const args = arguments;
    const now = +new Date();

    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}

// 2. 定时器节流（停止后能再执行一次）
function throttle(func, wait) {
  // code here
  let timeout;

  return function () {
    const context = this;
    const args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args);
        clearTimeout(timeout);
        timeout = null;
      }, wait);
    }
  };
}

// 3. 有头有尾节流
function throttle(func, wait) {
  // code here
  let timeout;
  let previous = 0;

  return function () {
    const context = this;
    const args = arguments;
    const now = +new Date();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        previous = +new Date();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

// 4. 有头有尾节流（可配置 leading，trailing）
function throttle(func, wait, options) {
  // code here
  let timeout;
  let previous = 0;

  return function () {
    const context = this;
    const args = arguments;
    const now = +new Date();
    if (!previous && options.leading === false) previous = now;

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        previous = options.leading === false ? 0 : +newDate();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

// 5. 带 cancel
function throttle(func, wait, options) {
  // code here

  return {
    cancelToken() {
      clearTimeout(timeout);
      previous = 0;
      timeout = null;
    },
  };
}
