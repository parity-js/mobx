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

import getStore from './getStore';

// Mocks
const mockJsonrpcMethod = 'parity_fakeVariable';
const mockApi = {
  pubsub: {
    eth: {
      coinbase: () => {}
    },
    parity: {
      fakeVariable: () => {},
      fakeVariable1: () => {},
      fakeVariable2: () => {},
      nodeHealth: () => {}
    }
  }
};

test('should create 2 stores when different rpc method', () => {
  const store1 = getStore('parity_fakeVariable1')().get(mockApi);
  const store2 = getStore('parity_fakeVariable2')().get(mockApi);

  expect(store1).not.toBe(store2);
});

test('should create 2 stores when different params', () => {
  const store1 = getStore('parity_fakeVariable')('params1').get(mockApi);
  const store2 = getStore('parity_fakeVariable')('params2').get(mockApi);

  expect(store1).not.toBe(store2);
});

test('should be a singleton store when same rpc method and same params', () => {
  const store1 = getStore(mockJsonrpcMethod)('params1', 'params2').get(mockApi);
  const store2 = getStore(mockJsonrpcMethod)('params1', 'params2').get(mockApi);

  expect(store1).toBe(store2);
});

test('should take parity NodeHealthStore from the parity folder', () => {
  const store = getStore('parity_nodeHealth')().get(mockApi);

  expect(store.nodeHealth).toEqual({}); // DefaultValue overridden
});

test('should create eth CoinbaseStore with default settings', () => {
  const store = getStore('eth_coinbase')().get(mockApi);

  expect(store.coinbase).toBe(null);
});
