/**
 * 目标：
 * 1. 实现 Promise 的三种状态
 * 2. 实现 Promise 对象的状态改变，改变只有两种可能：pending -> fulfilled；pending -> rejected
 * 3. 实现一旦 Promise 状态改变，再对 Promise 对象添加回调函数，也会立即得到这个结果
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.err = undefined
    this.onFulfilled = null;
    this.onRejected = null;

    let resolve = value => {
      // 如果当前状态是 pending，才去执行逻辑并改变状态为 fulfilled
      if (this.status === PENDING) {
        setTimeout(() => {
          this.state = FULFILLED
          this.value = value;
          this.onFulfilled(this.value)
        }, 0);
      }
    }

    let reject = err => {
      // 如果当前状态是 pending，才去执行逻辑并改变状态为 rejected
      if (this.status === PENDING) {
        setTimeout(() => {
          this.state = REJECTED
          this.err = err;
          this.onRejected(this.err)
        }, 0);
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === PENDING) {
      this.onFulfilled = onFulfilled
      this.onRejected = onRejected
    } else if (this.state === FULFILLED) {
      // 如果状态是 fulfilled，立即执行 onFulfilled 回调
      onFulfilled(this.value)
    } else if (this.state === REJECTED) {
      // 如果状态是 rejected，立即执行 onRejected 回调
      onRejected(this.err)
    }
  }
}

module.exports = MyPromise