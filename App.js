import React, {
  useState,
} from 'react';

import {StatusBar} from 'expo-status-bar';

import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

import {
  useStack,
} from './src/hooks/stack';

const default_ipaddr = '192.168.4.31';

export default function App() {
  const [ipaddr, setIpAddr] = useState(default_ipaddr);

  // view stack
  const {
    stack: viewstack,
    ops: {
      push: pushView,
      pop: popView,
    }
  } = useStack(['main']);

  const port = 1337;
  const host = `${ipaddr}:${port}`;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.main}>
      <StatusBar style="auto" />

        <Button title='Push View Layer' onPress={() => pushView('layer')}></Button>

        <Text>Hi!</Text>
        <Text>Stack depth: {viewstack.depth}</Text>
        {viewstack.map((entry, idx) => (
          <React.Fragment key={`view.${idx}`}>
            <Text>{entry}</Text>
          </React.Fragment>
        ))}


      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
