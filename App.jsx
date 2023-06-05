import React from 'react';

import {
  NativeRouter,
  Route,
  Routes,
  Link,
  Navigate,
} from 'react-router-native';

import { StatusBar } from 'expo-status-bar';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

import Connection from 'src/pages/connection';
import Layers from 'src/pages/layers';
import Shards from 'src/pages/shards';

import ConnectionProvider from 'src/providers/connection';
import FavoriteConnectionsProvider from 'src/providers/favoriteConnections';

const navUnderlayColor = '#f0f4f7';

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
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  subNavItem: {
    padding: 5,
  },
});

export default function App() {
  return (
    <NativeRouter>
      <View style={styles.container}>
        <SafeAreaView style={styles.main}>
          <StatusBar style="auto" />

          {/* navigation */}
          <View style={styles.nav}>
            <Link
              to="/layers"
              underlayColor={navUnderlayColor}
              style={styles.navItem}
            >
              <Text>Layers</Text>
            </Link>
            <Link
              to="/shards"
              underlayColor={navUnderlayColor}
              style={styles.navItem}
            >
              <Text>Shards</Text>
            </Link>
            <Link
              to="/connection"
              underlayColor={navUnderlayColor}
              style={styles.navItem}
            >
              <Text>Connection</Text>
            </Link>
          </View>

          {/* The Connection used to control the target. */}
          <ConnectionProvider
            storageKey="primary"
            initial={{
              host: '127.0.0.1',
              port: 1337,
            }}
          >

            {/* The FavoriteConnections saved by the user. */}
            <FavoriteConnectionsProvider
              initial={[
                { name: 'Home', host: '127.0.0.1', port: 1337 },
              ]}
            >

              <Routes>
                <Route path="/connection" element={<Connection />} />
                <Route path="/shards" element={<Shards />} />
                <Route path="/layers" element={<Layers />} />
                <Route index element={<Navigate replace to="/layers" />} />
              </Routes>

            </FavoriteConnectionsProvider>
          </ConnectionProvider>

        </SafeAreaView>
      </View>
    </NativeRouter>
  );
}
