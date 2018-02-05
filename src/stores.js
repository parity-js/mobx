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

import jsonRpc from '@parity/jsonrpc';

import getStore from './utils/getStore';

// Expose the stores object
// Accessing a store will be done like:
// `stores.eth.getBalance('0x123')` -> returns a MobX class
// `stores.eth.getBalance('0x123').get(api)` -> returns the singleton instance of a MobX store
const stores = {};

// Populate namespaces and methods in stores object
for (const namespace in jsonRpc) {
  stores[namespace] = {};
  for (const method in jsonRpc[namespace]) {
    // Below is the function exposed to the end-users
    stores[namespace][method] = getStore(namespace)(method);
  }
}

// TODO Fixme
// Some methods are not in @parity/jsonrpc, we add them manually here
['eth', 'net', 'parity', 'shell', 'signer', 'ssh', 'trace', 'web3'].forEach(
  namespace => {
    stores[namespace] = {
      ...stores[namespace],
      ...require(`./${namespace}`).default
    };
  }
);

export default stores;
