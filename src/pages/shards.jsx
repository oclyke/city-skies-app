import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  Text,
  View,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  useInstanceConnection,
  useInstanceApi,
} from 'src/hooks/citySkies';

import KVStore from 'src/lib/kvstore';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

/**
 * Shards are a little weird - they are not really part of the api.
 * So we are doing some weird stuff here.
 */
/**
 * Returns the data for a given path on a city skies instance
 */
function usePath(path, initializer) {
  const {
    address,
    connected,
  } = useInstanceConnection();

  const { current: cache } = useRef(new KVStore());
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(initializer);

  // construct the endpoint that will be used to access the data for this instance
  const endpoint = `http://${address}${path}`;

  const refresh = useMemo(() => (
    () => {
      if (connected === false) {
        return Promise.reject(new Error('disconnected'));
      }
      return new Promise((resolve, reject) => {
        console.log('fetching ', endpoint);
        fetch(endpoint, { method: 'GET' })
          .then((r) => r.text())
          .then((t) => JSON.parse(t))
          .then((data) => {
            resolve(data);
          })
          .catch(reject);
      });
    }), [endpoint, connected]);

  // get initial data
  useEffect(() => {
    // mark invalid
    setLoading(true);

    // get data
    cache.get(path)
      .then((value) => {
        setState(value);
        setLoading(false);
      })
      .catch(async () => {
        console.log('cache missed path: ', path);
        try {
          const data = await refresh();
          setState(data);
          setLoading(false);
          cache.store(path, data);
        } catch {
          console.log('failed to update path: ', path);
        }
      });
  }, [path, connected]);

  return [state, loading, refresh];
}

export default function Shards() {
  const [, {
    addOutputStackLayer,
  }] = useInstanceApi();

  const [{
    stacks: {
      active,
    },
  }, outputLoading] = usePath('/api/v0/output', { stacks: { active: 'A' } });
  const [shards, shardsLoading] = usePath('/api/v0/shards');

  if ((outputLoading === true) || (shardsLoading === true)) {
    return (
      <Text>Loading</Text>
    );
  }

  const {
    edges,
  } = shards;
  const modules = edges.map((edge) => edge.cursor).map((filename) => filename.replace(/\.[^/.]+$/, ''));

  return (
    <>
      <Text>Shards Page</Text>
      <ScrollView style={styles.container}>
        {modules.map((shard) => (
          <React.Fragment key={shard}>
            <View>
              <Text>{shard}</Text>
              <Button
                title="add"
                onPress={() => {
                  addOutputStackLayer(active, { shard_uuid: shard })
                    .then(() => console.log('added'))
                    .catch(console.error);
                }}
              />
            </View>
          </React.Fragment>
        ))}
      </ScrollView>
    </>
  );
}
