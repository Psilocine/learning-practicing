/**
 * 目标：
 * 1. 实现 Promise 达到 Promises/A+ 规范，使用 promises-aplus-tests 包通过测试
 */

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.err = undefined;

    // 支持链式操作，储存回调时要改为使用数组
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
      // 如果当前状态是 pending，才去执行逻辑并改变状态为 fulfilled
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach((fn) => fn());
        }, 0);
      }
    };

    let reject = (err) => {
      // 如果当前状态是 pending，才去执行逻辑并改变状态为 rejected
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = REJECTED;
          this.err = err;
          this.onRejectedCallbacks.forEach((fn) => fn());
        }, 0);
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled 如果不是函数，就忽略 onFulfilled
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    // onRejected 如果不是函数，就忽略 onRejected
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };

    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === PENDING) {
        // onFulfilled 传入到成功数组
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        // onRejected 传入到失败数组
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.err);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      } else if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            // resolvePromise 函数，处理自己 return 的 promise 和默认的 promise2 的关系
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.err);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
    });

    return promise2;
  }

  // 语法糖，只传 onRejected 的 then 方法
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (x === promise) {
    return reject(new TypeError("循环引用"));
  }
  // 防止多次调用
  let called;
  if (x !== null & (typeof x === 'object' || typeof x === 'function')) {

    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) {
            return;
          }
          called = true;

          resolvePromise(promise, y, resolve, reject)
        }, err => {
          if (called) {
            return;
          }
          called = true;
          reject(err)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e)
    }
  } else {
    resolve(x);
  }
}

// 执行测试用例需要用到的代码
MyPromise.deferred = MyPromise.defer = function () {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = MyPromise