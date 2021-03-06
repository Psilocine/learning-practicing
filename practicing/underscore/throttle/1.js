// 1. 时间戳节流（立即执行）
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

// 2. 定时器节流（停止后能再执行一次）
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

// 3. 有头有尾节流
function throttle(func, wait) {
  // code here
  let previous = 0;
  let timeout;
  let ctx;
  let args;

  const later = function () {
    func.apply(ctx, args);
    previous = +new Date();
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
      timeout = setTimeout(later, remaining);
    }
  };
}

// 4. 有头有尾节流（可配置 leading，trailing）
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
      timeout = setTimeout(later, remaining);
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
      timeout = setTimeout(later, remaining);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
    previous = 0;
  }

  return throttled;
}
