import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

// The server snapshot is only used during server rendering/hydration,
// so this resolves to `server` on the server and `client` in the browser.
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  return useSyncExternalStore<S | C>(
    emptySubscribe,
    () => client,
    () => server
  );
}
