import React, {
  useState,
} from 'react';

import * as expoStatusBar from 'expo-status-bar';

import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Modal,
  TouchableNativeFeedback,
} from 'react-native';

import {
  default as Slider,
} from '@react-native-community/slider';

import {
  default as ColorConvert,
} from 'color-convert';

const shard_uuids = [
  'artnet',
  'bounce',
  'diagonal',
  'diamond',
  'ellipse',
  'fft',
  'game_of_life',
  'noise',
  'solid',
  'straight',
  'virtual_circle',
];

function get(host, path) {
  return fetch(`http://${host}${path}`, { method: 'GET' });
}

function put(host, path, body) {
  return fetch(`http://${host}${path}`, { method: 'PUT', body });
}

function post(host, path, body) {
  return fetch(`http://${host}${path}`, { method: 'POST', body });
}


async function updateActiveLayerInfo(host, layerID, info) {
  await put(host, `/stacks/active/layers/${layerID}/info`, JSON.stringify(info))
}

async function setVariableValue(host, path, value) {
  await put(host, `${path}`, String(value))
}

async function addLayer(host, path, uuid) {
  await post(host, `${path}/layer`, JSON.stringify({ shard_uuid: String(uuid)}))
}


const initial_state = {
  info: {},
  shards: [],
  stacks: {
    active: {
      layers: [],
    },
    inactive: {
      layers: [],
    },
  },
  globals: {
    variables: [],
  },
  audio: {
    info: {},
    sources: [],
  } 
}

async function getVariableState(host, path) {
  const info = await (await get(host, `${path}/info`)).json();

  console.log(info['name'])

  return {
    type: Number(info['type']),
    name: String(info['name']),
    path,
    info,
  }
}

async function getLayerState(host, path) {
  const info = await (await get(host, `${path}/info`)).json();

  return {
    id: Number(info['id']),
    info,
  };
}

async function getState (host) {
  const info = await (await get(host, '/info')).json();
  const shards = await (await get(host, '/shards')).json();
  const global_vars_names = await (await get(host, '/globals/variables')).json();
  const active_layer_ids = (await (await get(host, '/stacks/active/layers')).json()).map(id => Number(id)).sort().reverse();
  const inactive_layer_ids = (await (await get(host, '/stacks/inactive/layers')).json()).map(id => Number(id)).sort();
  const audio_info = await (await get(host, '/audio/info')).json();
  const audio_sources = await (await get(host, '/audio/sources')).json();

  const active_layers = await Promise.all(active_layer_ids.map(async (id) => await getLayerState(host, `/stacks/active/layers/${id}`)));
  const inactive_layers = await Promise.all(inactive_layer_ids.map(async (id) => await getLayerState(host, `/stacks/inactive/layers/${id}`)));

  const global_vars = await Promise.all(global_vars_names.map(async (name) => await getVariableState(host, `/globals/variables/${name}`)));

  const state = {
    info,
    shards,
    stacks: {
      active: {
        layers: active_layers,
      },
      inactive: {
        layers: inactive_layers,
      },
    },
    globals: {
      variables: global_vars,
    },
    audio: {
      info: audio_info,
      sources: audio_sources,
    }
  };

  return state;
}


export default function App() {
  const default_ipaddr = '192.168.4.31';
  // const default_ipaddr = '';
  const [ipaddr, setIpAddr] = useState(default_ipaddr);
  const [state, setState] = useState(initial_state);
  const [viewstack, setViewstack] = useState(['main']);
  const [selected_shard, setSelectedShard] = useState(0);

  function pushView(view) {
    setViewstack(prev => [...prev, view]);
  }

  function popView() {
    if (viewstack.length > 1) {
      viewstack.pop()
      setViewstack([...viewstack])
    }
  }

  function getView() {
    return viewstack.slice(-1)[0]
  }

  const port = 1337;
  const host = `${ipaddr}:${port}`;

  async function refreshState() {
    const state = await getState(host);
    setState(state);
  }

  // console.log(state)
  console.log(state.globals.variables)
  console.log(viewstack, getView())

  return (
    <View style={styles.container}>

      {/* modal for adding a new layer */}
      <Modal
        visible={getView() === 'add-layer'}
      >
        <View style={styles.centeredView}>
          <Text>Choose A Program:</Text>

          {/* avaialble programs */}
          {shard_uuids.map((name, idx) => <React.Fragment key={`add-layer.shard.${idx}(${name})`}>
            <TouchableNativeFeedback
              onPress={() => { setSelectedShard(idx); }}
            >
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                padding: 15,
                margin: 5,
                backgroundColor: 'whitesmoke',
              }}>
                {selected_shard === idx && <Text>✅</Text>}
                <Text>{name}</Text>
              </View>
            </TouchableNativeFeedback>
          </React.Fragment>)}

          <Button
            onPress={async () => {
              await addLayer(host, '/stacks/active', shard_uuids[selected_shard]);
              popView();
            }}
            title='okay'
          />
        </View>
      </Modal>


      <SafeAreaView style={styles.main}>
        <expoStatusBar.StatusBar style="auto" />

        {/* connection setup */}
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{ display: 'flex', flexDirection: 'row'}}>
              <Text>Enter IP Address: </Text>
              <TextInput
                value={ipaddr}
                onChangeText={(value) => setIpAddr(value)}
                placeholder={'ip address'}
              />
            </View>

            <Button
              title='refresh'
              onPress={refreshState}
            />
            <Text>{host}</Text>
          </View>
        </View>


        {/* global variables */}
        <View style={styles.globalVariablesContainer}>
          <Text>Global Variables:</Text>
          {state.globals.variables.map((variable, idx) => <React.Fragment key={`globals.variable.${idx}(${variable.name})`}>
            <Variable host={host} variable={variable}/>
          </React.Fragment>)}
        </View>


        {/* layers */}
        <Button
          onPress={() => { pushView('add-layer')}}
          title='add layer'
        />
        <View style={styles.activeLayersContainer}>
          <Text>Active Layers:</Text>
          {state.stacks.active.layers.map((layer, idx) => <React.Fragment key={`stacks.active.layer.${id}(${idx})`}>
            <View style={styles.activeLayer}>
              <Text>Layer ID: {layer.id}</Text>
              <Text>Layer Index: {layer['info']['index']}</Text>
              <Text>Shard: {layer['info']['shard_uuid']}</Text>
              <Text>Local Palette: {layer['info']['use_local_palette'] ? 'true' : 'false'}</Text>

              <Button
                onPress={async () => {
                  const use_local_palette = !layer['info']['use_local_palette'];
                  await updateActiveLayerInfo(host, layer.id, {use_local_palette});
                }}
                title='toggle local palette'
              />
            </View>
          </React.Fragment>)}

        </View>

      </SafeAreaView>


    </View>
  );
}

function Variable ({ host, variable }) {

  switch (variable.type) {
    // floating point variable
    case 3: {      
      const allowed_range = variable.info['allowed_range'];
      const default_range = variable.info['default_range'];
      const value = variable.info['value'];

      return <>
        <View>
          <Text>Name: {variable.name}</Text>
          <Slider
            value={Number(value)}
            minimumValue={Number(default_range[0])}
            maximumValue={Number(default_range[1])}
            onSlidingComplete={async (value) => {
              console.log('sliding complete: ', { value })
              await setVariableValue(host, variable.path, value);
            }}
            />
        </View>
      </>
    }

    // color palette variables
    case 5: {
      console.log(variable.info)
      const value = JSON.parse(variable.info['value'])
      const colors_strings = value['colors'].map((color) => [(color & 0xff0000) >> 16, (color & 0x00ff00) >> 8, (color & 0x0000ff) >> 0]).map((rgb) => `#${ColorConvert.rgb.hex(rgb)}`);

      return <>
        <View>
          <Text>Name: {variable.name}</Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {colors_strings.map((color, idx) => <React.Fragment key={`variable.${variable.name}.colors.${idx}`}>
              <View style={{
                backgroundColor: color,
                width: `${100 / colors_strings.length}%`,
                height: 20,
              }} />
            </React.Fragment>)}
          </View>
        </View>
      </>
    }

    default: {
      return <>
        <View>
          <Text>Name: {variable.name}</Text>
          <Text>Unknown Variable Type: {variable.type}</Text>
        </View>
      </>
    }
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  globalVariablesContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  globalVariable: {
    width: '100%',
    backgroundColor: 'whitesmoke',
    margin: 4,
  },
  activeLayersContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  activeLayer: {
    width: '100%',
    backgroundColor: 'whitesmoke',
    margin: 4,
  },
});
