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
} from 'react-native';

export default function App() {
  const default_ipaddr = '192.168.0.22';
  // const default_ipaddr = '';
  const [ipaddr, setIpAddr] = useState(default_ipaddr);


  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <expoStatusBar.StatusBar style="auto" />

      <TextInput
        value={ipaddr}
        onChangeText={(value) => setIpAddr(value)}
        placeholder={'ip address'}
      />

      <Button
        title='test city-skies dynamic import'
        onPress={() => TestCitySkiesEndpoint(`${ipaddr}:1337`)}
      >
        
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function TestCitySkiesEndpoint (host) {
  fetch(`http://${host}/upload`, {
    method: 'POST',
    headers: {
      // Accept: 'application/json',
      'Content-Type': 'text/plain',
    },
    body: 'demo_dynamic_module'
  });
}
