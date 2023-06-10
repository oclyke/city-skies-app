import KVStore from 'src/lib/kvstore';

export default class CitySkiesInstance {
  constructor(address) {
    this.cache = new KVStore();

    this.address = address;
    this.connected = false;
    this.connectionListeners = [];

    // start a ping loop to test the connection state
    this.pingLoop = setInterval(() => {
      const { alive } = this.getApi('static');
      alive()
        .then(() => this.setConnectionState(true))
        .catch(() => this.setConnectionState(false));
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
    this.connectionListeners.forEach((l) => l({
      connected: this.connected,
      address: this.address,
    }));
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
   * Gets the specified api version.
   * @param {*} version the version of the api to get.
   * @returns an object containing the api.
   */
  getApi(version) {
    switch (version) {
      case 'static': return {
        getAlivePath: () => '/alive',
        alive: () => fetch(`http://${this.address}/alive`, { method: 'GET' }),
        getIndexPath: () => '/index',
        index: () => this.get('/index'),
      };
      case 'v0': {
        const prefix = '/api/v0';
        const paths = {
          audio: () => `${prefix}/audio`,
          audioSource: (source) => `${prefix}/audio/source/${source}`,
          audioSourceVariable: (source, variable) => `${prefix}/audio/${source}/variable/${variable}`,
          audioSourceStandardVariable: (source, variable) => `${prefix}/audio/${source}/standard_variable/${variable}`,
          global: () => `${prefix}/global`,
          globalVariable: (variable) => `${prefix}/global/variable/${variable}`,
          output: () => `${prefix}/output`,
          outputStack: (stack) => `${prefix}/output/stack/${stack}`,
          outputStackActivate: (stack) => `${prefix}/output/stack/${stack}/activate`,
          outputStackLayer: (stack, layer) => `${prefix}/output/stack/${stack}/layer/${layer}`,
          outputStackLayerConfig: (stack, layer) => `${prefix}/output/stack/${stack}/layer/${layer}/config`,
          outputStackLayerVariable: (stack, layer, variable) => `${prefix}/output/stack/${stack}/layer/${layer}/variable/${variable}`,
          outputStackLayerStandardVariable: (stack, layer, variable) => `${prefix}/output/stack/${stack}/layer/${layer}/standard_variable/${variable}`,
        };

        // json fetch helper
        const fetchPathJson = (path, options) => (
          fetch(`http://${this.address}${path}`, options)
            .then((r) => r.text())
            .then((t) => [path, JSON.parse(t)])
        );

        const api = {
          // getters
          getAudio: () => fetchPathJson(paths.audio(), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getAudioSource: (source) => fetchPathJson(paths.audioSource(source), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getAudioSourceVariable: (source, variable) => fetchPathJson(paths.audioSourceVariable(source, variable), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getAudioSourceStandardVariable: (source, variable) => fetchPathJson(paths.audioSourceStandardVariable(source, variable), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getGlobal: () => fetchPathJson(paths.global(), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getGlobalVariable: (variable) => fetchPathJson(paths.globalVariable(variable), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getOutput: () => fetchPathJson(paths.output(), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getOutputStack: (stack) => fetchPathJson(paths.outputStack(stack), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getOutputStackLayer: (stack, layer) => fetchPathJson(paths.outputStackLayer(stack, layer), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getOutputStackLayerConfig: (stack, layer) => fetchPathJson(paths.outputStackLayerConfig(stack, layer), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getOutputStackLayerVariable: (stack, layer, variable) => fetchPathJson(paths.outputStackLayerVariable(stack, layer, variable), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),
          getOutputStackLayerStandardVariable: (stack, layer, variable) => fetchPathJson(paths.outputStackLayerStandardVariable(stack, layer, variable), { method: 'GET' }).then(([path, data]) => this.cache.store(path, data)),

          // setters
          setAudioSourceVariable: (source, variable, value) => (
            fetchPathJson(paths.audioSourceVariable(source, variable), { method: 'PUT', body: JSON.stringify({ value }) })
          ),
          setAudioSourceStandardVariable: (source, variable, value) => (
            fetchPathJson(paths.audioSourceStandardVariable(source, variable), { method: 'PUT', body: JSON.stringify({ value }) })
          ),
          setGlobalVariable: (variable, value) => (
            fetchPathJson(paths.globalVariable(variable), { method: 'PUT', body: JSON.stringify({ value }) })
          ),
          setOutputStackLayerConfig: (stack, layer, config) => (
            fetchPathJson(paths.outputStackLayerConfig(stack, layer), { method: 'PUT', body: JSON.stringify(config) })
          ),
          setOutputStackLayerVariable: (stack, layer, variable, value) => (
            fetchPathJson(paths.outputStackLayerVariable(stack, layer, variable), { method: 'PUT', body: JSON.stringify({ value }) })
          ),
          setOutputStackLayerStandardVariable: (stack, layer, variable, value) => (
            fetchPathJson(paths.outputStackLayerStandardVariable(stack, layer, variable), { method: 'PUT', body: JSON.stringify({ value }) })
          ),

          // deleters
          removeOutputStackLayer: (stack, layer) => (
            fetchPathJson(paths.outputStackLayer(stack, layer), { method: 'DELETE' })
              .then(([path, data]) => {

                console.log('removeOutputStackLayer', path, data)

                return data;
              })
          ),

          // modifiers
          activateOutputStack: (stack) => (
            fetchPathJson(paths.outputStackActivate(stack), { method: 'PUT', body: JSON.stringify({}) })
          ),
          mergeOutputStackLayerConfig: (stack, layer, config) => (
            fetchPathJson(paths.outputStackLayerConfig(stack, layer), { method: 'PUT', body: JSON.stringify(config) })
          ),
          addOutputStackLayer: (stack, data) => (
            fetchPathJson(`${paths.outputStack(stack)}/layer`, { method: 'POST', body: JSON.stringify(data) })
          ),
        };

        return api;
      }
      default: throw new Error('invalid api version');
    }
  }
}
