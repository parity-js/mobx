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

import { action, extendObservable, observable } from 'mobx';

import capitalize from './capitalize';

/**
 * Factory function to create a MobX store that listens to (as in pubsub) a JSONRPC method
 * @param {String} jsonRpcMethod The JSONRPC method to create a MobX store for
 * @param {Object} storeOptions Optional options to pass when creating the MobX store
 */
const createMobxStore = (storeOptions = {}) => namespace => method => {
  // Default options for MobX store
  const options = {
    variableName: method, // The name of the variable to track inside the store, e.g. "coinbase" in CoinbaseStore.coinbase
    defaultValue: null, // The initial value of that variable
    displayName: `${capitalize(method)}Store`, // A nice name for the store, not used for now
    ...storeOptions
  };

  return (...params) =>
    class ParityMobxStore {
      @observable error = null;

      constructor (api) {
        this._api = api;

        // The main observable of this store, the one tracking the pubsub values
        // from the api
        extendObservable(this, {
          [options.variableName]: options.defaultValue
        });

        // Subscribe to Parity pubsub
        this._api.pubsub[namespace][method]((error, result) => {
          this.setError(error);
          this[`set${capitalize(options.variableName)}`](result);
        }, ...params);

        /**
         * Action setter for the main variable of the store
         * E.g. in CoinbaseStore, this would be @action setCoinbase()
         */
        this[`set${capitalize(options.variableName)}`] = action(result => {
          this[options.variableName] = result;
        });
      }

      static instance = null;

      /**
       * The public getter to access the Mobx store
       * @param {Object} api The @parity/api object
       */
      static get (api) {
        if (!this.instance) {
          // We are enforcing Mobx stores to be singletons.
          this.instance = new this(api);
        }
        return this.instance;
      }

      /**
       * Action setter for the error
       */
      @action
      setError = error => {
        this.error = error;
      };
    };
};

export default createMobxStore;
