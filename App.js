import React, {
  useState,
} from 'react';

import {
  NativeRouter,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-native";

import {
  StatusBar
} from 'expo-status-bar';

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
const navUnderlayColor = "#f0f4f7";

function Layers ({ match }) {
  return <>
    <Text>Layers Page</Text>
  </>
}

function Shards ({ match }) {
  return <>
    <Text>Shards Page</Text>
  </>
}

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
    <NativeRouter>
    <View style={styles.container}>
      <SafeAreaView style={styles.main}>
      <StatusBar style="auto" />

        {/* navigation */}
        <View style={styles.nav}>
          <Link to="/layers" underlayColor={navUnderlayColor} style={styles.navItem}>
            <Text>Layers</Text>
          </Link>
          <Link to="/shards" underlayColor={navUnderlayColor} style={styles.navItem}>
            <Text>Shards</Text>
          </Link>
        </View>

        <Button title='Push View Layer' onPress={() => pushView('layer')}></Button>

        <Text>Hi!</Text>
        <Text>Stack depth: {viewstack.depth}</Text>
        {viewstack.map((entry, idx) => (
          <React.Fragment key={`view.${idx}`}>
            <Text>{entry}</Text>
          </React.Fragment>
        ))}

      <Routes>
        <Route path="/shards" element={<Shards />} />
        <Route path="/layers" element={<Layers />} />
        <Route index element={<Navigate replace to="/layers"/>}/>
      </Routes>

      </SafeAreaView>
    </View>
    </NativeRouter>
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
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  subNavItem: {
    padding: 5
  },
});
