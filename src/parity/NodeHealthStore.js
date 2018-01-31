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

import { computed } from 'mobx';

import createMobxStore from '../utils/createMobxStore';

export const STATUS_OK = 'ok';
export const STATUS_WARN = 'needsAttention';
export const STATUS_BAD = 'bad';

const BaseStore = createMobxStore({
  defaultValue: {}
})('parity_nodeHealth')();

class NodeHealthStore extends BaseStore {
  /**
   * The public getter to access the Mobx store
   * @param {Object} api The @parity/api object
   */
  static get (api) {
    if (!this.instance) {
      // We are enforcing Mobx stores to be singletons.
      this.instance = new NodeHealthStore(api);
    }
    return this.instance;
  }

  /**
   * Get overall health of node
   */
  @computed
  get overall () {
    if (!this.nodeHealth || !Object.keys(this.nodeHealth).length) {
      return {
        status: STATUS_BAD,
        message: ['Unable to fetch node health.']
      };
    }

    // Find out if there are bad statuses
    const bad = Object.values(this.nodeHealth)
      .filter(x => x)
      .map(({ status }) => status)
      .find(s => s === STATUS_BAD);
    // Find out if there are needsAttention statuses
    const needsAttention = Object.keys(this.nodeHealth)
      .filter(key => key !== 'time')
      .map(key => this.nodeHealth[key])
      .filter(x => x)
      .map(({ status }) => status)
      .find(s => s === STATUS_WARN);
    // Get all non-empty messages from all statuses
    const message = Object.values(this.nodeHealth)
      .map(({ message }) => message)
      .filter(x => x);

    return {
      status: bad || needsAttention || STATUS_OK,
      message
    };
  }
}

export default NodeHealthStore;
