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

import createMobxStore from './createMobxStore';

// Here is the object where the actual MobX stores are stored
// Maps `namespace:method:params` to a singleton mobx store
const mobxStores = {};

/**
 * Retrieves or creates the unique store corresponding to the
 * (namespace,method,params) tuple
 */
const getStore = namespace => method => (...params) => {
  const id = `${namespace}:${method}:${params.toString()}`; // TODO Maybe hash this to have a shorter id?
  // If this id doesn't exist, we create a singleton for it
  if (!mobxStores[id]) {
    let namespaceStores;
    try {
      namespaceStores = require(`../${namespace}`).default;
    } catch (e) {}

    if (namespaceStores && namespaceStores[method]) {
      // If we have overriden this mobx store, then take the store from that
      // file
      mobxStores[id] = namespaceStores[method](...params);
    } else {
      // Or else we create a new ParityMobxStore with default values
      mobxStores[id] = createMobxStore()(namespace)(method)(...params);
    }
  }
  return mobxStores[id];
};

export default getStore;
