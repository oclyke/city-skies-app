import KVCache from 'src/lib/cache';
import DependencyGraph from 'src/lib/dependency';
import minimatch from 'minimatch';

export default class CitySkiesInstance {
  constructor(address) {
    console.log('creating instance');
    this.address = address;
    this.cache = new KVCache();
    this.graph = new DependencyGraph();

    this.connected = false;
    this.connectionListeners = [];

    // start a ping loop to test the connection state
    this.pingLoop = setInterval(() => {
      console.log('pinging', this.address);
      const { alive } = this.getApi('static');
      alive()
        .then(() => {
          console.log('ping succeeded');
          this.setConnectionState(true)
        })
        .catch(() => {
          console.log('ping failed');
          this.setConnectionState(false);
        });
    }, 1500);
  }

  /**
   * Subscribes a connection listener.
   * @param {*} listener the listener to subscribe.
   */
  subscribeConnection(listener) {
    this.connectionListeners.push(listener);
  }

  /**
   * Unsubscribes a connection listener.
   * @param {*} listener the listener to unsubscribe.
   */
  unsubscribeConnection(listener) {
    this.connectionListeners = this.connectionListeners.filter((l) => l !== listener);
  }

  /**
   * Notifies all connection listeners of the current connection state.
   */
  notifyConnection() {
    this.connectionListeners.forEach((l) => l(this.connected));
  }

  /**
   * Sets the connection state and notifies all listeners.
   * @param {*} connected the new connection state.
   */
  setConnectionState(connected) {
    if (connected === this.connected) {
      // no change
      return;
    }
    this.connected = connected;
    this.notifyConnection();
  }

  /**
   * Sets the address of the instance.
   * @param {*} address the new address of the instance.
   */
  setAddress(address) {
    this.address = address;
  }

  /**
   * Gets data from the cache or fetches it from the server.
   * @param {*} path the path of the data to get.
   * @returns a promise that resolves to the data or rejects with an error.
   */
  get(path) {
    return new Promise((resolve, reject) => {
      this.cache.get(path)
        .catch(async () => {
          fetch(`http://${this.address}${path}`, { method: 'GET' })
            .then((r) => r.text())
            .then((t) => JSON.parse(t))
            .then((data) => {
              this.cache.store(path, data);
              resolve(data);
            })
            .catch(reject);
        });
    });
  }

  /**
   * Puts data to the server.
   * Does *not* put data in the cache - the cache is meant to reflect the server.
   *
   * @param {*} path the path of the data to put.
   * @param {*} data the data to put.
   * @returns a promise that resolves to the data or rejects with an error.
   */
  put(path, data) {
    return new Promise((resolve, reject) => {
      fetch(`http://${this.address}${path}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
        .then((r) => r.text())
        .then((t) => JSON.parse(t))
        .then((d) => {
          resolve(d);
        })
        .catch(reject);
    });
  }

  /**
   * Deletes data from the server.
   * @param {*} path the path of the data to delete.
   * @param {*} data the data to delete.
   * @returns a promise that resolves to the data or rejects with an error.
   */
  delete(path, data) {
    return new Promise((resolve, reject) => {
      fetch(`http://${this.address}${path}`, {
        method: 'DELETE',
        body: JSON.stringify(data),
      })
        .then((r) => r.text())
        .then((t) => JSON.parse(t))
        .then((d) => {
          resolve(d);
        })
        .catch(reject);
    });
  }

  /**
   * Gets the specified api version.
   * @param {*} version the version of the api to get.
   * @returns an object containing the api.
   */
  getApi(version) {
    switch (version) {
      case 'static': return {
        alive: () => fetch(`http://${this.address}/alive`, { method: 'GET' }),
        index: () => this.get('/index'),
      };
      case 'v0': return {
        getAudio: () => this.get('/api/v0/audio'),
        getAudioSource: (id) => this.get(`/api/v0/audio/source/${id}`),
        addAudioSource: (id) => this.put('/api/v0/audio/source', { id }),
        getAudioSourceVariable: (source, variable) => this.get(`/api/v0/audio/${source}/variable/${variable}`),
        setAudioSourceVariable: (source, variable, value) => this.put(`/api/v0/audio/${source}/variable/${variable}`, { value }),
        getAudioSourceStandardVariable: (source, variable) => this.get(`/api/v0/audio/${source}/private_variable/${variable}`),
        setAudioSourceStandardVariable: (source, variable, value) => this.put(`/api/v0/audio/${source}/private_variable/${variable}`, { value }),
        getGlobal: () => this.get('/api/v0/global'),
        getGlobalVariable: (variable) => this.get(`/api/v0/global/variable/${variable}`),
        setGlobalVariable: (variable, value) => this.put(`/api/v0/global/variable/${variable}`, { value }),
        getOutput: () => this.get('/api/v0/output'),
        getOutputStack: (id) => this.get(`/api/v0/output/stack/${id}`),
        activateOutputStack: (id) => this.put(`/api/v0/output/stack/${id}/activate`, {}),
        addOutputStackLayer: (stack, initializer) => this.put(`/api/v0/output/stack/${stack}/layer`, initializer),
        removeOutputStackLayer: (stack, layer) => this.delete(`/api/v0/output/stack/${stack}/layer/${layer}/remove`, {}),
        mergeOutputStackLayerConfig: (stack, layer, config) => this.put(`/api/v0/output/stack/${stack}/layer/${layer}/config`, config),
        getOutputStackLayerVariable: (stack, layer, variable) => this.get(`/api/v0/output/stack/${stack}/layer/${layer}/variable/${variable}`),
        setOutputStackLayerVariable: (stack, layer, variable, value) => this.put(`/api/v0/output/stack/${stack}/layer/${layer}/variable/${variable}`, { value }),
        getOutputStackLayerStandardVariable: (stack, layer, variable) => this.get(`/api/v0/output/stack/${stack}/layer/${layer}/private_variable/${variable}`),
        setOutputStackLayerStandardVariable: (stack, layer, variable, value) => this.put(`/api/v0/output/stack/${stack}/layer/${layer}/private_variable/${variable}`, { value }),
      };
      default: throw new Error('invalid api version');
    }
  }
}
