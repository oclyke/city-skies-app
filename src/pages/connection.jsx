import React, {
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';

import {
  useConnectionApi,
  useConnectionState,
} from 'src/providers/connection';

import {
  useFavoriteConnectionsApi,
  useFavoriteConnectionsState,
} from 'src/providers/favoriteConnections';

function apiFactory({ setHost, setPort }) {
  function confirmHost(host) {
    setHost(host);
  }
  function confirmPort(port) {
    setPort(port);
  }

  return {
    confirmHost,
    confirmPort,
  };
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
});

function FavoriteConnection({ connection, onConfirm, onRemove }) {
  return (
    <View>
      <Text>
        {connection.host}
        {connection.port}
        {connection.name}
      </Text>
      <Button
        title="use"
        onPress={() => {
          if (typeof onConfirm === 'function') {
            onConfirm(connection);
          }
        }}
      />
      <Button
        title="remove"
        onPress={() => {
          if (typeof onConfirm === 'function') {
            onRemove(connection);
          }
        }}
      />
    </View>
  );
}

export default function Connection() {
  const {
    setHost,
    setPort,
    reset,
  } = useConnectionApi();
  const {
    address,
    host,
    port,
    connected,
  } = useConnectionState();

  const {
    add: addFavorite,
    remove: removeFavorite,
  } = useFavoriteConnectionsApi();
  const favorites = useFavoriteConnectionsState();

  // state for text inputs
  const [name, setName] = useState('');
  const [desiredHost, setDesiredHost] = useState('');
  const [desiredPort, setDesiredPort] = useState('');

  // memoized api will not cause re-renders
  const {
    confirmHost,
    confirmPort,
  } = useMemo(() => apiFactory({ setHost, setPort }), [setHost, setPort]);

  return (
    <>
      <Text>Connection Page</Text>
      <Text>Connection Status:</Text>
      <Text style={connected ? styles.success : styles.error}>{connected ? 'connected' : 'not connected'}</Text>
      <Text>
        Target Address:
        {address}
      </Text>

      <TextInput
        // style={styles.input}
        placeholder="name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        // style={styles.input}
        placeholder="hostname"
        value={desiredHost}
        onChangeText={setDesiredHost}
      />

      <TextInput
        // style={styles.input}
        keyboardType="numeric"
        placeholder="port number"
        value={desiredPort}
        onChangeText={setDesiredPort}
      />

      <Button
        title="confirm"
        onPress={() => {
          confirmHost(desiredHost);
          confirmPort(desiredPort);
        }}
      />

      <Button
        title="reset to default"
        onPress={reset}
      />

      <Button
        title="save connection to favorites"
        onPress={() => addFavorite({ host, port, name })}
      />

      {/* show user's favorite connections */}
      <Text>Favorite Connections</Text>
      {Object.keys(favorites).map((id) => {
        const connection = favorites[id];
        return (
          <React.Fragment key={id}>
            <FavoriteConnection
              connection={connection}
              onConfirm={() => {
                confirmHost(connection.host);
                confirmPort(connection.port);
              }}
              onRemove={() => {
                removeFavorite(id);
              }}
            />
          </React.Fragment>
        );
      })}
      {Object.keys(favorites).length === 0 && (
        <Text>
          You havent saved any favorite connections yet!
        </Text>
      )}
    </>
  );
}
