class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(evt, callback) {
    if (typeof callback !== "function") {
      throw new TypeError("callback must be a function!");
    }
    if (this._events[evt]) {
      this._events[evt].push(callback);
    } else {
      this._events[evt] = [callback];
    }
  }
  once(evt, callback) {
    if (typeof callback !== "function") {
      throw new TypeError("callback must be a function!");
    }
    const _cb = (...args) => {
      callback(args);

      this.off(evt, _cb);
    };

    this.on(evt, _cb);
  }

  emit(evt, ...args) {
    if (this._events[evt]) {
      this._events[evt].forEach((cb) => {
        cb(args);
      });
    }
  }

  off(evt, callback) {
    if (this._events[evt]) {
      this._events[evnt] = this._events[evt].filter((cb) => cb !== callback);
    }
  }

  removeAll(evt) {
    if (evt) {
      this._events[evt] = null;
    } else {
      // remove all
      this._events = Object.create(null);
    }
  }
}
