import React from 'react';

import {
  NativeRouter,
  Route,
  Routes,
  Link,
  Navigate,
  Outlet,
} from 'react-router-native';

import { StatusBar } from 'expo-status-bar';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

import Connection from 'src/pages/connection';
import Stacks from 'src/pages/stacks';
import Shards from 'src/pages/shards';

import ConnectionProvider, {
  useConnectionState,
} from 'src/providers/connection';
import CitySkiesProvider from 'src/providers/citySkies';
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
  circle: {
    height: 10,
    width: 10,
    borderRadius: '50%',
  },
});

function Navigation() {
  const {
    connected,
  } = useConnectionState();

  return (
    <View style={styles.nav}>
      <Link
        to="/stacks"
        underlayColor={navUnderlayColor}
        style={styles.navItem}
      >
        <Text>Stacks</Text>
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
        <View>
          <Text>Connection</Text>
          <View
            style={{
              ...styles.circle,
              backgroundColor: (connected) ? 'green' : 'red',
            }}
          />
        </View>
      </Link>
    </View>
  );
}

/**
 * The global app layout. Provides:
 * - safe area view
 * - global navigation
 *
 * Renders sub-components through outlet.
 *
 * @returns Global layout for the app.
 */
function Layout() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.main}>
        <StatusBar style="auto" />
        <Navigation />
        <Outlet />
      </SafeAreaView>
    </View>
  );
}

/**
 * Application entry point.
 * - global context providers
 * - top level routing
 *
 * @returns App entry point.
 */
export default function App() {
  return (
    <NativeRouter>
      {/* The Connection used to control the target. */}
      <ConnectionProvider
        storageKey="primary"
        initial={{
          host: '127.0.0.1',
          port: 1337,
        }}
      >

        {/* The CitySkies provider uses the Connection to provide CitySkies state and API  */}
        <CitySkiesProvider>

          {/* The FavoriteConnections saved by the user. */}
          <FavoriteConnectionsProvider
            initial={[
              { name: 'Home', host: '127.0.0.1', port: 1337 },
            ]}
          >

            {/* Pages rendered under routes */}
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="connection" element={<Connection />} />
                <Route path="shards/*" element={<Shards />} />
                <Route path="stacks/*" element={<Stacks />} />
              </Route>
              <Route index element={<Navigate replace to="/stacks" />} />
            </Routes>

          </FavoriteConnectionsProvider>
        </CitySkiesProvider>
      </ConnectionProvider>
    </NativeRouter>
  );
}
