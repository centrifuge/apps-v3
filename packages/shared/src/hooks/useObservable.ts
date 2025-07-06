import { useMemo, useReducer, useRef, useState, useSyncExternalStore } from 'react'
import { catchError, of, share, timer, type Observable, type ObservedValueOf } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'
import { isEqual } from 'lodash'

export type ObservableOptions = never

/**
 * Hook to use an observable in a React component.
 * @param observable The observable to subscribe to. Should be stable (e.g. memoized).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useObservable<T = void>(observable?: Observable<T>, _options?: ObservableOptions) {
  const { snapshot, retry } = useObservableInner(observable)

  return {
    data: snapshot.data,
    error: snapshot.error,
    status: snapshot.status,
    isIdle: snapshot.status === 'idle',
    isLoading: snapshot.status === 'loading',
    isSuccess: snapshot.status === 'success',
    isError: snapshot.status === 'error',
    retry,
  }
}

export function useObservableWithRefresh<T = void>(observable?: Observable<T>, _options?: ObservableOptions) {
  const query = useObservable(observable, _options)
  const [visibleData, setVisibleData] = useState(query.data)

  return {
    ...query,
    data: visibleData,
    hasFreshData: query.data !== visibleData,
    refresh: () => {
      setVisibleData(query.data)
    },
  }
}

type CacheRecord<T> = {
  observable: Observable<unknown>
  snapshot: {
    data?: T
    error?: unknown
    status: 'idle' | 'loading' | 'success' | 'error'
  }
  // Allows observables to emit `undefined` and still be successful
  didEmitData: boolean
}

const cache = new WeakMap<Observable<any>, CacheRecord<any>>()

function useObservableInner<ObservableType extends Observable<any>>(observable?: ObservableType) {
  useWarnIfNotStable(observable, "useObservable: observable is not stable. Don't forget to memoize it!")

  const [updateCount, forceUpdate] = useReducer((s) => s + 1, 0)

  const processedObservableRef = useRef<CacheRecord<ObservedValueOf<ObservableType>> | null>(null)

  useMemo(() => {
    if (!observable) {
      processedObservableRef.current = null
      return
    }

    if (!cache.has(observable)) {
      const entry = {
        snapshot: {
          status: 'loading',
        },
        didEmitData: false,
      } as CacheRecord<ObservedValueOf<ObservableType>>

      entry.observable = observable.pipe(
        map((value) => ({ data: value, error: undefined, hasData: true })),
        catchError((error) => of({ data: entry.snapshot.data, error, hasData: entry.didEmitData })),
        tap((result) => {
          const newStatus = result.error ? 'error' : result.hasData ? 'success' : 'loading'
          const currentSnapshot = entry.snapshot

          // Use lodash.isEqual for robust deep equality check on data
          if (
            !isEqual(currentSnapshot.data, result.data) ||
            currentSnapshot.error !== result.error ||
            currentSnapshot.status !== newStatus
          ) {
            entry.didEmitData = result.hasData
            entry.snapshot = {
              ...result,
              status: newStatus,
            }
            if (result.error) {
              console.error(result.error)
            }
          }
        }),
        // Added `ReplaySubject` connector to `share` and delayed `resetOnRefCountZero` to try and avoid infinite loops
        // It leaves the observable alive for 100ms after the last subscriber leaves to remain active during rapid unmount/remount andn re-render cycles
        share({
          connector: () => new ReplaySubject(1), // Ensures new subscribers get the last value (behaves like shareReplay(1))
          resetOnError: true, // Resubscribes to source if it errors
          resetOnComplete: true, // Resubscribes to source if it completes
          resetOnRefCountZero: () => timer(100), // Keep source alive for 100ms after last subscriber leaves
        })
      )
      // Eagerly subscribe to sync set `entry.snapshot` in the cache.
      // Might be problematic if the observable is not stable or contains asynchronous operations.
      // useSyncExternalStore is designed to handle asynchronous state without needing an eager synchronous subscription
      // const subscription = entry.observable.subscribe()  --- Was causing an error that resulted in an infinite loop of rendering
      // subscription.unsubscribe()

      cache.set(observable, entry)
    }
    processedObservableRef.current = cache.get(observable)!
  }, [observable])

  const store = useMemo(() => {
    const instance = processedObservableRef.current
    if (!instance) {
      return noopStore
    }

    return {
      subscribe: (onStoreChange: () => void) => {
        const subscription = instance.observable.subscribe(() => onStoreChange())

        return () => {
          subscription.unsubscribe()
        }
      },
      getSnapshot: () => {
        return instance.snapshot
      },
    }
  }, [processedObservableRef.current, updateCount])

  const res = useSyncExternalStore(store.subscribe, store.getSnapshot)

  function resetError() {
    if (observable) {
      const entry = cache.get(observable)
      if (entry) {
        entry.snapshot = {
          ...entry.snapshot,
          error: undefined,
        }
      }
    }
  }

  return {
    snapshot: res as CacheRecord<ObservedValueOf<ObservableType>>['snapshot'],
    retry: () => {
      resetError()
      forceUpdate()
    },
  }
}

const noopSnapshot = {
  status: 'idle' as const,
  data: undefined,
  error: undefined,
}
const noopStore = {
  subscribe: () => () => {},
  getSnapshot: () => noopSnapshot,
}

function useWarnIfNotStable(object?: unknown, message = 'object is not stable') {
  // TODO: not working with launchpad SSR, fix
  // if (isTestEnv) {
  //  const ref = useRef({
  //    hasObjectCount: 0,
  //    stableObjectCount: 0,
  //    lastObject: object,
  //  })
  //  if (object && ref.current.lastObject) {
  //    ref.current.hasObjectCount++
  //    if (ref.current.lastObject === object) {
  //      ref.current.stableObjectCount++
  //    }
  // if (ref.current.hasObjectCount === 10 && ref.current.stableObjectCount <= 1) {
  //  console.warn(message, object)
  // }
  //  }
  //  ref.current.lastObject = object
  // }
}
