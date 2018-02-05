// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

/* eslint-env jest */

import versionFactory from './version';
import { basicStoreTests } from '../utils/testHelpers';

const mockApi = {
  net: { version: () => Promise.resolve() },
  pubsub: {
    parity: {
      netChain: callback => {
        callback();
      }
    }
  }
};

basicStoreTests('net')('version')(versionFactory)({
  mockApi,
  skipPubsub: true, // We overwrite our own pubsub tests
  variableName: 'netVersion'
});

test('should make a call to api.pubsub.netChain on constructor', () => {
  const netChain = jest.fn(() => Promise.resolve());
  versionFactory().get({
    ...mockApi,
    pubsub: {
      parity: { netChain }
    }
  });

  expect(netChain).toHaveBeenCalled();
});

test('should make a call to api.net.version on constructor', () => {
  const version = jest.fn(() => Promise.resolve());
  versionFactory().get({
    ...mockApi,
    net: { version }
  });

  expect(version).toHaveBeenCalled();
});

test('should setError when pubsub throws error', () => {
  const mockPubSub = callback => {
    setTimeout(() => callback(new Error('ERROR'), null), 200); // Simulate pubsub with a 200ms timeout
  };
  const store = versionFactory().get({
    ...mockApi,
    pubsub: {
      ...mockApi.pubsub,
      parity: { netChain: mockPubSub }
    }
  });

  expect.assertions(1);
  return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
    expect(store.error).toEqual(new Error('ERROR'));
  });
});

test('should handle testnet', () => {
  const store = versionFactory().get(mockApi);
  store.setNetVersion(1); // Mainnet

  expect(store.isTestnet).toBe(false);
});
