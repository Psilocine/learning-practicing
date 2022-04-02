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
    if (timeout) return;
    timeout = setTimeout(function () {
      func.apply(ctx, args);
      clearTimeout(timeout);
      timeout = null;
    }, wait);
  };
}

// 3. 有头有尾节流
function throttle(func, wait) {
  // code here
  let timeout;
  let previous = 0;
  let ctx;
  let args;

  const later = function () {
    previous = +new Date();
    func.apply(ctx, args);
    if (timeout) {
      timeout = null;
    }
  };

  return function () {
    const now = +new Date();
    ctx = this;
    args = arguments;
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
function throttle(
  func,
  wait,
  options = {
    leading: true,
    trailing: true,
  }
) {
  // code here
  let timeout;
  let previous = 0;
  let ctx;
  let args;

  const later = function () {
    previous = options.leading ? +new Date() : 0;
    func.apply(ctx, args);
    if (timeout) {
      timeout = null;
    }
  };

  return function () {
    const now = +new Date();
    if (!previous && !options.leading) {
      previous = now;
    }
    ctx = this;
    args = arguments;
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
function throttle(func, wait, options = {
  leading: true,
  trailing: true
}) {
  // code here
  let previous = 0;
  let timeout;
  let ctx;
  let args;

  function later () {
    previous = options.leading ? +new Date() : 0;
    timeout = null;
    func.apply(ctx, args);
  }

  const throttled = function () {
    ctx = this;
    args = arguments;

    const now = +new Date();
    if (!previous && !options.leading) {
      previous = now;
    }

    const remaining = wait - (now - previous);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null;
      }
      previous = now;
      func.apply(ctx, args);
    } else if (!timeout && options.trailing) {
      timeout = setTimeout(later, remaining);
    }
  }

  throttled.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null;
      previous = 0;
    }
  }
}
