export default class KVStore {
  constructor() {
    this.items = {};
    this.validations = {};
  }

  /**
   * Synchronous method for validating a key
   */
  validate(key) {
    this.validations[key] = true;
  }

  /**
   * Synchronous method for invalidating a key
   */
  invalidate(key) {
    this.validations[key] = false;
  }

  /**
   * Synchronous method for extracting a value by key.
   * Throws an error if the key was undefined.
   * @param {*} key used to get data from cache items.
   */
  extract(key) {
    const valid = this.validations[key];
    if (typeof valid === 'undefined') {
      throw new Error('cache miss [nonexistent]');
    }
    if (valid !== true) {
      throw new Error('cache miss [invalid]');
    }
    const data = this.items[key];
    return data;
  }

  /**
   * Synchronous method for storing value by key.
   * @param {*} key
   * @param {*} value
   */
  store(key, value) {
    this.items[key] = value;
    this.validate(key);
  }

  /**
   * Async method for getting value by key.
   * @param {*} key
   * @returns
   */
  get(key) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.extract(key);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Async method for storing value by key.
   * @param {*} key
   * @param {*} value
   * @returns
   */
  put(key, value) {
    this.store(key, value);
    return Promise.resolve();
  }

  clear() {
    this.items = {};
    return Promise.resolve();
  }
}
