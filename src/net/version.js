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

import { action, computed, observable } from 'mobx';
import { isTestnet } from '@parity/shared/lib/util/testnet';

const versionFactory = (...params) => {
  return class VersionStore {
    @observable netVersion = null;

    constructor (api) {
      this._api = api;

      // Somehow pubsub on 'net_version' doesn't work, so we pubsub on
      // 'parity_netChain', and set the netVersion value on each event
      this._api.pubsub.parity.netChain((error, netChain) => {
        if (error) {
          return this.setError(error);
        }

        this._api.net
          .version()
          .then(this.setNetVersion)
          .catch(this.setError);
      });
    }

    /**
     * The public getter to access the Mobx store
     * @param {Object} api The @parity/api object
     */
    static get (api) {
      if (!this.instance) {
        // We are enforcing Mobx stores to be singletons.
        this.instance = new VersionStore(api);
      }
      return this.instance;
    }

    @computed
    get isTestnet () {
      return isTestnet(this.netVersion);
    }

    @action
    setError = error => {
      this.error = error;
    };

    @action
    setNetVersion = netVersion => {
      this.netVersion = netVersion;
    };
  };
};

export default versionFactory;
