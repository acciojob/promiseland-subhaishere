class CustomPromise {
  constructor() {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.onFinallyCallback = undefined;
    
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    
    // This setTimeout is used to ensure that the promise handlers are executed asynchronously
    // as specified in a terminal-based environment.
    setTimeout(() => {
      this.handleCallback();
    }, 0);
  }

  resolve(value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled';
      this.value = value;
      this.handleCallback();
    }
  }

  reject(reason) {
    if (this.state === 'pending') {
      this.state = 'rejected';
      this.reason = reason;
      this.handleCallback();
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled === 'function') {
      this.onFulfilledCallbacks.push(onFulfilled);
    }
    if (typeof onRejected === 'function') {
      this.onRejectedCallbacks.push(onRejected);
    }
    this.handleCallback();
    return this; // To enable chaining of promises
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    this.onFinallyCallback = onFinally;
    this.handleCallback();
    return this; // To enable chaining of promises
  }

  handleCallback() {
    if (this.state === 'fulfilled') {
      while (this.onFulfilledCallbacks.length) {
        const onFulfilled = this.onFulfilledCallbacks.shift();
        onFulfilled(this.value);
      }
    } else if (this.state === 'rejected') {
      while (this.onRejectedCallbacks.length) {
        const onRejected = this.onRejectedCallbacks.shift();
        onRejected(this.reason);
      }
    }

    if (this.onFinallyCallback) {
      this.onFinallyCallback();
    }
  }
}

// Export the CustomPromise class to be used in the terminal-based project
window.CustomPromise = CustomPromise;