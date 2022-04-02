// 1. 没有立即执行
function debounce(func, wait) {
  // code here
  let timeout;

  return function (...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// 2. 立即执行
function debounce(func, wait, immediate) {
  // code here
  let timeout;

  return function (...args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      if (callNow) {
        func.apply(this, args);
      }
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    } else {
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    }
  };
}

// 3. 带 cancel
function debounce(func, wait) {
  // code here

  let timeout;

  function debounced(...args) {
    if (immediate) {
      if (timeout) clearTimeout(timeout);
      const callNow = !timeout;
      if (callNow) {
        func.apply(this, args);
      }
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    } else {
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    }
  }

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debuonced;
}
