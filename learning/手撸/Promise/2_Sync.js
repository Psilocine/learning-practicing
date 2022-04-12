/**
 * 目标：
 * 1. 使 Promise 支持同步方法
 */

class MyPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = undefined
    this.err = undefined
    this.onFulfilled = null;
    this.onRejected = null;

    let resolve = value => {
      setTimeout(() => {
        this.value = value;
        this.onFulfilled(this.value)
      }, 0);
    }

    let reject = err => {
      setTimeout(() => {
        this.err = err;
        this.onRejected(this.err)
      }, 0);
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }
}

module.exports = MyPromise