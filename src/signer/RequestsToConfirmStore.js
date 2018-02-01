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

import createMobxStore from '../utils/createMobxStore';

const BaseStore = createMobxStore({
  defaultValue: []
})('signer_requestsToConfirm')();

class RequestsToConfirmStore extends BaseStore {
  constructor (api) {
    super(api);

    // TODO FIXME
    // Pubsub on `signer_requestsToConfirm` doesn't fire initially, so we
    // manually fire it up.
    this._api.signer
      .requestsToConfirm()
      .then(this.setRequestsToConfirm)
      .catch(this.setError);
  }

  /**
   * The public getter to access the Mobx store
   * @param {Object} api The @parity/api object
   */
  static get (api) {
    if (!this.instance) {
      // We are enforcing Mobx stores to be singletons.
      this.instance = new RequestsToConfirmStore(api);
    }
    return this.instance;
  }
}

export default RequestsToConfirmStore;
