/**
 * 目标：
 * 1. 实现 bluebird 库的 promisify，promisify 有什么作用呢？它的作用就是将异步回调函数 api 转换为 promise 形式，
 * 比如下面这个，对 fs.readFile 执行 promisify 后，就可以直接用 promise 的方式去调用读取文件的方法了，是不是很强大。
 * let Promise = require('./bluebird');
 * let fs = require("fs");
 *
 *  var readFile = Promise.promisify(fs.readFile);
 *  readFile("1.txt", "utf8").then(function(data) {
 *    console.log(data);
 *  })
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
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }
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
        : (reason) => {
            throw reason;
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

  all(promises) {
    return new MyPromise((resolve, reject) => {
      let result = [];
      let count = 0;
      if (promises.length === 0) {
        resolve(result);
      }
      promises.forEach((promise, index) => {
        promise.then(
          (value) => {
            result[index] = value;
            count++;
            if (count === promises.length) {
              resolve(result);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  race(promises) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject);
      }
    });
  }

  resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  reject(err) {
    return new MyPromise((resolve, reject) => {
      reject(err);
    });
  }

  all(promises) {
    return new MyPromise((resolve, reject) => {
      let result = [];
      let count = 0;
      if (promises.length === 0) {
        resolve(result);
      }
      promises.forEach((promise, index) => {
        promise.then(
          (value) => {
            result[index] = value;
            count++;
            if (count === promises.length) {
              resolve(result);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  race(promises) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject);
      }
    });
  }

  resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  reject(err) {
    return new MyPromise((resolve, reject) => {
      reject(err);
    });
  }

  promisify(fn) {
    return function (...args) {
      return new MyPromise(function (resolve, reject) {
        args.push(function (err, ...arg) {
          if (err) {
            reject(err);
          }
          resolve(...arg);
        });
        fn.apply(null, args);
      });
    };
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject 报错
    return reject(new TypeError("循环引用"));
  }
  // 防止多次调用
  let called;
  // x 不是 null 且 x 是对象或者函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      // 尝试调用 x 的 then 方法
      let then = x.then;
      // 如果 x.then 是函数，则调用 x.then
      if (typeof then === "function") {
        // 如果 then 方法返回的是一个 promise，则等待 promise 的状态
        then.call(
          x,
          (y) => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // resolve 结果依旧是 promise 那就继续解析
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (err) {
      // 属于失败
      if (called) return;
      called = true;
      // 如果 x.then 报错，则不要在继续执行了
      reject(err);
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
};

module.exports = MyPromise;
