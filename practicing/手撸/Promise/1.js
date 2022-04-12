// 1. base
// 2. sync
// 3. status
// 4. chain
// 5. async
// 6. A+
// 7. otherFuns
// 8. promisify

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.err = undefined;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach((fn) => fn());
        }, 0);
      }
    };

    let reject = (err) => {
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
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.err);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      } else if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.err);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
    });

    return promise2;
  }

  catch(onRejected) {
    this.then(null, onRejected);
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
          (err) => {
            reject(err);
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
      return new MyPromise((resolve, reject) => {
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

function resolvePromise(promise, x, resolve, reject) {
  if (x === promise) {
    return reject(new TypeError("循环引用"));
  }
  // 防止多次调用
  let called;
  if ((x !== null) & (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) {
              return;
            }
            called = true;

            resolvePromise(promise, y, resolve, reject);
          },
          (err) => {
            if (called) {
              return;
            }
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
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
