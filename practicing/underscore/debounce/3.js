// 1. 没有立即执行
function debounce(func, wait) {
  // code here
  let timeout;

  return function () {
    const context = this;
    const args = arguments;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// 2. 立即执行
function debounce(func, wait, immediately) {
  // code here
  let timeout;

  return function () {
    const context = this;
    const args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediately) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}

// 3. 带 cancel
function debounce(func, wait, immediately) {
  // code here
  let timeout;

  return function () {
    const context = this;
    const args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediately) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }

    return {
      cancelToken() {
        clearTimeout(timeout);
        timeout = null;
      }
    }
  };
}
