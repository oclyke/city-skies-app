import React from 'react';

import {
  NativeRouter,
} from 'react-router-native';

import {
  PaperProvider,
} from 'react-native-paper';

import CitySkiesProvider from 'src/providers/citySkies';
import FavoriteConnectionsProvider from 'src/providers/favoriteConnections';
import CitySkiesInterface from 'src/lib/citySkies';
import App from 'src/app';

const instance = new CitySkiesInterface('localhost:1337');

export default function Main() {
  return (
    <NativeRouter>
      <PaperProvider>
        <CitySkiesProvider
          instance={instance}
          apiVersion="v0"
        >
          <FavoriteConnectionsProvider
            initial={[
              { name: 'Home', address: '127.0.0.1:1337' },
            ]}
          >
            <App />
          </FavoriteConnectionsProvider>
        </CitySkiesProvider>
      </PaperProvider>
    </NativeRouter>
  );
}
