# @parity/mobx

Create one MobX store per JSON-RPC method.

## Usage

`@parity/mobx` creates one MobX store per RPC method, with an observable value updating whenever the underlying pubsub RPC fires.

For example, let's take syncing state. Instead of making a pubsub directly to `api.pubsub.eth.syncing((error, result) => ...)` to detect whether we're currently syncing or not, we just spawn a MobX store, and observe the changes.

```javascript
import stores from '@parity/mobx'

@observer
class MyComponent extends React.Component {
  this.syncingStore = stores.eth.syncing().get(api); // Pass the api object to the store
  
  render() {
    const { syncing } = this.syncingStore
    return <div>The syncing state is: {JSON.stringify(syncing)}</div>
  }
}
```

And the syncing state will be re-rendered automatically on each new pubsub publication.

## Notes

- Each JSONRPC method defined in the [Wiki's spec](https://wiki.parity.io/JSONRPC) has its own MobX store.
- The name of the observable variable in the store is the part after the `_` in the RPC method. For example, the MobX store for `eth_syncing` has an observable variable named `syncing`, the MobX store for `parity_enode` has an observable variable named `enode`, etc.
- Some stores have additional `@computed` properties, e.g. `stores.parity.dappsUrl()`... More doc coming soon.
- Each MobX store is a singleton, and can be accessed with the `.get()` method: `store.eth.syncing().get()`.
