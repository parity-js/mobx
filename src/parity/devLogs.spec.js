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

import { toJS } from 'mobx';

import devLogsFactory from './devLogs';
import { basicStoreTests } from '../utils/testHelpers';

const mockDevLogs = [
  '2018-01-03 10:35:58 9/25 peers 6 MiB chain 67 MiB db 0 bytes queue 2 MiB sync RPC: 1 conn, 5 req/s, 198 µs',
  'Second Log'
];
const mockApi = {
  pubsub: {
    parity: {
      devLogs: () => {}
    }
  }
};

basicStoreTests('parity')('devLogs')(devLogsFactory)();

test('should handle addParsedLog', () => {
  const store = devLogsFactory().get(mockApi);
  store.addParsedLog(mockDevLogs[0]);

  expect(store.parsedLogs[0]).toEqual({
    date: '2018-01-03 10:35:58',
    log:
      ' 9/25 peers 6 MiB chain 67 MiB db 0 bytes queue 2 MiB sync RPC: 1 conn, 5 req/s, 198 µs'
  });
});

test('should skip addParsedLog if log not parseable', () => {
  const store = devLogsFactory().get(mockApi);
  store.addParsedLog(mockDevLogs[1]);

  expect(store.parsedLogs).toHaveLength(0);
});

test('should addParsedLogs when pubsub publishes', () => {
  const mockPubSub = callback => {
    setTimeout(() => callback(null, mockDevLogs), 200); // Simulate pubsub with a 200ms timeout
  };
  const store = devLogsFactory().get({
    pubsub: {
      parity: { devLogs: mockPubSub }
    }
  });

  expect.assertions(1);
  return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
    expect(toJS(store.parsedLogs)).toEqual([
      {
        date: '2018-01-03 10:35:58',
        log:
          ' 9/25 peers 6 MiB chain 67 MiB db 0 bytes queue 2 MiB sync RPC: 1 conn, 5 req/s, 198 µs'
      }
    ]);
  });
});
