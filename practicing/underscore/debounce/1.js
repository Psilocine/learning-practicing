// 1. 没有立即执行
function debounce(func, wait) {
  // code here
  let timeout;

  return function () {
    const ctx = this;
    const args = arguments;

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(function () {
      func.apply(ctx, args);
    }, wait);
  };
}

// 2. 立即执行
function debounce(func, wait, immediate) {
  // code here
  let timeout;

  return function () {
    const ctx = this;
    const args = arguments;

    if (timeout) {
      clearTimeout(timeout);
    }
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(function () {
        func.apply(ctx, args);
      }, wait);
      if (callNow) {
        func.apply(ctx, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(ctx, args);
      }, wait);
    }
  };
}

// 3. 带 cancel
function debounce(func, wait, immediate) {
  // code here
  let timeout;

  const debounced = function () {
    const ctx = this;
    const args = arguments;

    if (timeout) {
      clearTimeout(timeout);
    }
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(function () {
        func.apply(ctx, args);
      }, wait);
      if (callNow) {
        func.apply(ctx, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(ctx, args);
      }, wait);
    }
  };
  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
