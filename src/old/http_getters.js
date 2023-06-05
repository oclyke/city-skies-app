/* eslint-disable */

import Slider from '@react-native-community/slider';

import ColorConvert from 'color-convert';

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
  await put(
    host,
    `/stacks/active/layers/${layerID}/info`,
    JSON.stringify(info),
  );
}

async function setVariableValue(host, path, value) {
  await put(host, `${path}`, String(value));
}

async function addLayer(host, path, uuid) {
  await post(
    host,
    `${path}/layer`,
    JSON.stringify({ shard_uuid: String(uuid) }),
  );
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
  },
};

async function getVariableState(host, path) {
  const info = await (await get(host, `${path}/info`)).json();

  console.log(info.name);

  return {
    type: Number(info.type),
    name: String(info.name),
    path,
    info,
  };
}

async function getLayerState(host, path) {
  const info = await (await get(host, `${path}/info`)).json();

  return {
    id: Number(info.id),
    info,
  };
}

async function getState(host) {
  const info = await (await get(host, '/info')).json();
  const shards = await (await get(host, '/shards')).json();
  const global_vars_names = await (
    await get(host, '/globals/variables')
  ).json();
  const active_layer_ids = (
    await (await get(host, '/stacks/active/layers')).json()
  )
    .map((id) => Number(id))
    .sort()
    .reverse();
  const inactive_layer_ids = (
    await (await get(host, '/stacks/inactive/layers')).json()
  )
    .map((id) => Number(id))
    .sort();
  const audio_info = await (await get(host, '/audio/info')).json();
  const audio_sources = await (await get(host, '/audio/sources')).json();

  const active_layers = await Promise.all(
    active_layer_ids.map(
      async (id) => await getLayerState(host, `/stacks/active/layers/${id}`),
    ),
  );
  const inactive_layers = await Promise.all(
    inactive_layer_ids.map(
      async (id) => await getLayerState(host, `/stacks/inactive/layers/${id}`),
    ),
  );

  const global_vars = await Promise.all(
    global_vars_names.map(
      async (name) => await getVariableState(host, `/globals/variables/${name}`),
    ),
  );

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
    },
  };

  return state;
}

async function refreshState() {
  const state = await getState(host);
  setState(state);
}
