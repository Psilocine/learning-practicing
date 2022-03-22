// 1. 时间戳防抖（立即执行）
function throttle(func, wait) {
  // code here
  let previous = 0;

  return function () {
    const ctx = this;
    const args = arguments;
    const now = +new Date();

    if (now - previous > wait) {
      func.apply(ctx, args);
      previous = now;
    }
  };
}

// 2. 定时器防抖（停止后能再执行一次）
function throttle(func, wait) {
  // code here
  let timeout;

  return function () {
    const ctx = this;
    const args = arguments;

    if (!timeout) {
      timeout = setTimeout(function () {
        func.apply(ctx, args);
        clearTimeout(timeout);
        timeout = null;
      }, wait);
    }
  };
}

// 3. 有头有尾防抖
function throttle(func, wait) {
  // code here
  let previous = 0;
  let timeout;
  let ctx;
  let args;

  const later = function () {
    func.apply(ctx, args);
    previous = +new Date();
    clearTimeout(timeout);
    timeout = null;
  };

  return function () {
    ctx = this;
    args = arguments;
    const now = +new Date();

    const remaining = wait - (now - previous);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(ctx, args);
    } else if (!timeout) {
      timeout = setTimeout(later, wait);
    }
  };
}

// 4. 有头有尾防抖（可配置 leading，trailing）
// leading 和 trailing 必须有一者为 true
function throttle(
  func,
  wait,
  options = {
    leading: true,
    trailing: true,
  }
) {
  // code here
  let previous = 0;
  let timeout;
  let ctx;
  let args;

  const later = function () {
    previous = options.leading === false ? 0 : +new Date();
    clearTimeout(timeout);
    timeout = null;
    func.apply(ctx, args);
  };

  return function () {
    ctx = this;
    args = arguments;
    const now = +new Date();
    if (!previous && options.leading === false) previous = now;

    const remaining = wait - (now - previous);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(ctx, args);
    } else if (!timeout && options.trailing) {
      timeout = setTimeout(later, wait);
    }
  };
}

// 5. 带 cancel
function throttle(
  func,
  wait,
  options = {
    leading: true,
    trailing: true,
  }
) {
  // code here
  let previous = 0;
  let timeout;
  let ctx;
  let args;

  const later = function () {
    previous = options.leading ? +new Date() : 0;
    clearTimeout(timeout);
    timeout = null;
    func.apply(ctx, args);
  };

  const throttled = function () {
    ctx = this;
    args = arguments;
    
    const now = +new Date();

    if (!options.leading) {
      previous = now;
    }
    const remaining = wait - (now - previous);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(ctx, args);
    } else if (!timeout && options.trailing) {
      timeout = setTimeout(later, wait);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
    previous = 0;
  }

  return throttled;
}
