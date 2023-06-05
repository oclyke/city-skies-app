import React, {
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Text,
  TextInput,
} from 'react-native';

import {
  useConnectionApi,
  useConnectionState,
} from 'src/providers/connection';

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

export default function Connection() {
  const {
    setHost,
    setPort,
    reset,
  } = useConnectionApi();
  const {
    address,
  } = useConnectionState();

  // state for text inputs
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
      <Text>
        Target Address:
        {address}
      </Text>

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
    </>
  );
}
