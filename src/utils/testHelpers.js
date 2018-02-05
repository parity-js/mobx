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
import merge from 'lodash/merge';

import capitalize from './capitalize';

export const basicStoreTests = namespace => method => factory => (
  options = {}
) => {
  const mockApi = merge(
    {
      [namespace]: {
        [method]: () => {}
      },
      pubsub: {
        [namespace]: { [method]: () => {} }
      }
    },
    options.mockApi
  );
  const mockError = { message: 'SOME_ERROR' };
  const mockResult = 'Foo';

  const variableName = options.variableName || method;
  const setter = `set${capitalize(variableName)}`;

  test('it should be a singleton', () => {
    const myFactory = factory();
    const store1 = myFactory.get(mockApi);
    const store2 = myFactory.get(mockApi);

    expect(store1).toBe(store2);
  });

  test(`should handle ${setter}`, () => {
    const store = factory().get(mockApi);
    store[setter](mockResult);

    expect(toJS(store[variableName])).toEqual(mockResult);
  });

  test('should handle setError', () => {
    const store = factory().get(mockApi);
    store.setError(mockError);

    expect(toJS(store.error)).toEqual(mockError);
  });

  if (!options.skipPubsub) {
    test(`should ${setter} when pubsub publishes`, () => {
      const mockPubSub = callback => {
        setTimeout(() => callback(null, mockResult), 200); // Simulate pubsub with a 200ms timeout
      };
      const store = factory().get({
        ...mockApi,
        pubsub: {
          ...mockApi.pubsub,
          [namespace]: { [method]: mockPubSub }
        }
      });

      expect.assertions(1);
      return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
        expect(toJS(store[variableName])).toEqual(mockResult);
      });
    });

    test('should setError when pubsub throws error', () => {
      const mockPubSub = callback => {
        setTimeout(() => callback(mockError, null), 200); // Simulate pubsub with a 200ms timeout
      };
      const store = factory().get({
        ...mockApi,
        pubsub: {
          ...mockApi.pubsub,
          [namespace]: { [method]: mockPubSub }
        }
      });

      expect.assertions(1);
      return new Promise(resolve => setTimeout(resolve, 200)).then(() => {
        expect(store.error).toEqual(mockError);
      });
    });
  }
};
