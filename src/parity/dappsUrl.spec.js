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

import dappsUrlFactory from './dappsUrl';
import { basicStoreTests } from '../utils/testHelpers';

const mockApi = {
  pubsub: {
    parity: {
      dappsUrl: () => {}
    }
  }
};

basicStoreTests('parity')('dappsUrl')(dappsUrlFactory)();

test('should handle fullUrl with partial dappsUrl', () => {
  const store = dappsUrlFactory().get(mockApi);
  store.setDappsUrl('127.0.0.1:8545');

  expect(store.fullUrl).toEqual('http://127.0.0.1:8545'); // Protocol is about:// in tests
});

test('should handle fullUrl with full dappsUrl', () => {
  const store = dappsUrlFactory().get(mockApi);
  store.setDappsUrl('http://127.0.0.1:8545');

  expect(store.fullUrl).toEqual('http://127.0.0.1:8545');
});
