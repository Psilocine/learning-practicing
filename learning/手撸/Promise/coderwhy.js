/**
 * 1. coder why 的实现，包括一些额外的类方法(allSettled/any 等)
 * 2. setTimeout 虽然能模拟异步情况，但是它毕竟是宏任务，而 Promise 是微任务
 *    所以采用更优的 queueMicroTask 来实现
 */
const PROMISE_STATUS_PENDING = "pending";
const PROMISE_STATUS_FULFILLED = "fulfilled";
const PROMISE_STATUS_REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING;
    this.value = undefined;
    this.reason = undefined;

    this.onFulfilledFns = [];
    this.onRejectedFns = [];

    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          this.status = PROMISE_STATUS_FULFILLED;

          this.value = value;
          this.onFulfilledFns.forEach((fn) => {
            fn(this.value);
          });
        });
      }
    };

    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          this.status = PROMISE_STATUS_REJECTED;

          this.reason = reason;
          this.onRejectedFns.forEach((fn) => {
            fn(reason);
          });
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = onFulfilled || ((value) => value);
    onRejected =
      onRejected ||
      ((reason) => {
        throw reason;
      });

    return new MyPromise((resolve, reject) => {
      // 如果状态还没确定，将成功和失败回调放到对应数组中
      if (this.status === PROMISE_STATUS_PENDING) {
        this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
        });
        this.onRejectedFns.push(() => {
          execFunctionWithCatchError(onRejected, this.reason, resolve, reject);
        });
      }

      // 如果状态已经确定，调用对应的回调
      if (this.status === PROMISE_STATUS_FULFILLED) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
      }
      if (this.status === PROMISE_STATUS_REJECTED) {
        execFunctionWithCatchError(onRejected, this.reason, resolve, reject);
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    this.then(
      () => {
        onFinally();
      },
      () => {
        onFinally();
      }
    );
  }

  // ------ 实例 方法 ⬆️
  // ------ 类 方法 ⬇️

  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((_, reject) => {
      reject(reason);
    });
  }

  static all(promises) {
    const n = promises.length;
    const values = new Array(n);
    let cnt = 0;

    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        promise.then(
          (res) => {
            values[index] = res;
            cnt++;

            if (cnt === n) {
              resolve(values);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

  // 不管是 fulfilled 还是 reject 都返回 resolve
  static allSettled(promises) {
    const n = promises.length;
    const values = new Array(n);
    let cnt = 0;

    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        promise.then(
          (res) => {
            values[index] = {
              status: PROMISE_STATUS_FULFILLED,
              value: res,
            };
            cnt++;

            if (cnt === n) {
              resolve(values);
            }
          },
          (err) => {
            values[index] = {
              status: PROMISE_STATUS_REJECTED,
              reason: err,
            };
            cnt++;

            if (cnt === n) {
              resolve(values);
            }
          }
        );
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve, reject);
      });
    });
  }

  // resolve 必须等到有一个成功的结果
  // reject 所有都失败才执行 reject
  static any(promises) {
    const n = promises.length;
    const reasons = new Array(n);
    let cnt = 0;

    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        promise.then(resolve, (err) => {
          reasons[index] = err;
          cnt++;

          if (reasons.length === n) {
            reject(new AggregateError(reasons));
          }
        });
      });
    });
  }
}

function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value);
    resolve(result);
  } catch (error) {
    reject(error);
  }
}
