import { options as options$1 } from '../index.js';

/** @type {number} */

var currentIndex;
/** @type {import('./internal.d.ts').Component} */

var currentComponent;
/** @type {import('./internal.d.ts').Component} */

var previousComponent;
/** @type {number} */

var currentHook = 0;
/** @type {Array<import('./internal.d.ts').Component>} */

var afterPaintEffects = [];
var EMPTY = []; // Cast to use internal Options type

var options = options$1;
var oldBeforeDiff = options.__b;
var oldBeforeRender = options.__r;
var oldAfterDiff = options.diffed;
var oldCommit = options.__c;
var oldBeforeUnmount = options.unmount;
var oldRoot = options.__;
var RAF_TIMEOUT = 100;
var prevRaf;
/** @type {(vnode: import('./internal.d.ts').VNode) => void} */

options.__b = function (vnode) {
  currentComponent = null;
  if (oldBeforeDiff) oldBeforeDiff(vnode);
};

options.__ = function (vnode, parentDom) {
  if (vnode && parentDom.__k && parentDom.__k.__m) {
    vnode.__m = parentDom.__k.__m;
  }

  if (oldRoot) oldRoot(vnode, parentDom);
};
/** @type {(vnode: import('./internal.d.ts').VNode) => void} */


options.__r = function (vnode) {
  if (oldBeforeRender) oldBeforeRender(vnode);
  currentComponent = vnode.__c;
  currentIndex = 0;
  var hooks = currentComponent.__H;

  if (hooks) {
    if (previousComponent === currentComponent) {
      hooks.__h = [];
      currentComponent.__h = [];

      hooks.__.forEach(function (hookItem) {
        if (hookItem.__N) {
          hookItem.__ = hookItem.__N;
        }

        hookItem.__V = EMPTY;
        hookItem.__N = hookItem._pendingArgs = undefined;
      });
    } else {
      hooks.__h.forEach(invokeCleanup);

      hooks.__h.forEach(invokeEffect);

      hooks.__h = [];
      currentIndex = 0;
    }
  }

  previousComponent = currentComponent;
};
/** @type {(vnode: import('./internal.d.ts').VNode) => void} */


options.diffed = function (vnode) {
  if (oldAfterDiff) oldAfterDiff(vnode);
  var c = vnode.__c;

  if (c && c.__H) {
    if (c.__H.__h.length) afterPaint(afterPaintEffects.push(c));

    c.__H.__.forEach(function (hookItem) {
      if (hookItem._pendingArgs) {
        hookItem.__H = hookItem._pendingArgs;
      }

      if (hookItem.__V !== EMPTY) {
        hookItem.__ = hookItem.__V;
      }

      hookItem._pendingArgs = undefined;
      hookItem.__V = EMPTY;
    });
  }

  previousComponent = currentComponent = null;
}; // TODO: Improve typing of commitQueue parameter

/** @type {(vnode: import('./internal.d.ts').VNode, commitQueue: any) => void} */


options.__c = function (vnode, commitQueue) {
  commitQueue.some(function (component) {
    try {
      component.__h.forEach(invokeCleanup);

      component.__h = component.__h.filter(function (cb) {
        return cb.__ ? invokeEffect(cb) : true;
      });
    } catch (e) {
      commitQueue.some(function (c) {
        if (c.__h) c.__h = [];
      });
      commitQueue = [];

      options.__e(e, component.__v);
    }
  });
  if (oldCommit) oldCommit(vnode, commitQueue);
};
/** @type {(vnode: import('./internal.d.ts').VNode) => void} */


options.unmount = function (vnode) {
  if (oldBeforeUnmount) oldBeforeUnmount(vnode);
  var c = vnode.__c;

  if (c && c.__H) {
    var hasErrored;

    c.__H.__.forEach(function (s) {
      try {
        invokeCleanup(s);
      } catch (e) {
        hasErrored = e;
      }
    });

    c.__H = undefined;
    if (hasErrored) options.__e(hasErrored, c.__v);
  }
};
/**
 * Get a hook's state from the currentComponent
 * @param {number} index The index of the hook to get
 * @param {number} type The index of the hook to get
 * @returns {any}
 */


function getHookState(index, type) {
  if (options.__h) {
    options.__h(currentComponent, index, currentHook || type);
  }

  currentHook = 0; // Largely inspired by:
  // * https://github.com/michael-klein/funcy.js/blob/f6be73468e6ec46b0ff5aa3cc4c9baf72a29025a/src/hooks/core_hooks.mjs
  // * https://github.com/michael-klein/funcy.js/blob/650beaa58c43c33a74820a3c98b3c7079cf2e333/src/renderer.mjs
  // Other implementations to look at:
  // * https://codesandbox.io/s/mnox05qp8

  var hooks = currentComponent.__H || (currentComponent.__H = {
    __: [],
    __h: []
  });

  if (index >= hooks.__.length) {
    hooks.__.push({
      __V: EMPTY
    });
  }

  return hooks.__[index];
}
/**
 * @template {unknown} S
 * @param {import('./index.d.ts').Dispatch<import('./index.d.ts').StateUpdater<S>>} [initialState]
 * @returns {[S, (state: S) => void]}
 */


function useState(initialState) {
  currentHook = 1;
  return useReducer(invokeOrReturn, initialState);
}
/**
 * @template {unknown} S
 * @template {unknown} A
 * @param {import('./index.d.ts').Reducer<S, A>} reducer
 * @param {import('./index.d.ts').Dispatch<import('./index.d.ts').StateUpdater<S>>} initialState
 * @param {(initialState: any) => void} [init]
 * @returns {[ S, (state: S) => void ]}
 */

function useReducer(reducer, initialState, init) {
  /** @type {import('./internal.d.ts').ReducerHookState} */
  var hookState = getHookState(currentIndex++, 2);
  hookState._reducer = reducer;

  if (!hookState.__c) {
    hookState.__ = [!init ? invokeOrReturn(undefined, initialState) : init(initialState), function (action) {
      var currentValue = hookState.__N ? hookState.__N[0] : hookState.__[0];

      var nextValue = hookState._reducer(currentValue, action);

      if (currentValue !== nextValue) {
        hookState.__N = [nextValue, hookState.__[1]];

        hookState.__c.setState({});
      }
    }];
    hookState.__c = currentComponent;

    if (!currentComponent._hasScuFromHooks) {
      // This SCU has the purpose of bailing out after repeated updates
      // to stateful hooks.
      // we store the next value in _nextValue[0] and keep doing that for all
      // state setters, if we have next states and
      // all next states within a component end up being equal to their original state
      // we are safe to bail out for this specific component.

      /**
       *
       * @type {import('./internal.d.ts').Component["shouldComponentUpdate"]}
       */
      // @ts-ignore - We don't use TS to downtranspile
      // eslint-disable-next-line no-inner-declarations
      var updateHookState = function updateHookState(p, s, c) {
        if (!hookState.__c.__H) return true;
        /** @type {(x: import('./internal.d.ts').HookState) => x is import('./internal.d.ts').ReducerHookState} */

        var isStateHook = function isStateHook(x) {
          return !!x.__c;
        };

        var stateHooks = hookState.__c.__H.__.filter(isStateHook);

        var allHooksEmpty = stateHooks.every(function (x) {
          return !x.__N;
        }); // When we have no updated hooks in the component we invoke the previous SCU or
        // traverse the VDOM tree further.

        if (allHooksEmpty) {
          return prevScu ? prevScu.call(this, p, s, c) : true;
        } // We check whether we have components with a nextValue set that
        // have values that aren't equal to one another this pushes
        // us to update further down the tree


        var shouldUpdate = false;
        stateHooks.forEach(function (hookItem) {
          if (hookItem.__N) {
            var currentValue = hookItem.__[0];
            hookItem.__ = hookItem.__N;
            hookItem.__N = undefined;
            if (currentValue !== hookItem.__[0]) shouldUpdate = true;
          }
        });
        return shouldUpdate || hookState.__c.props !== p ? prevScu ? prevScu.call(this, p, s, c) : true : false;
      };

      currentComponent._hasScuFromHooks = true;
      var prevScu = currentComponent.shouldComponentUpdate;
      var prevCWU = currentComponent.componentWillUpdate; // If we're dealing with a forced update `shouldComponentUpdate` will
      // not be called. But we use that to update the hook values, so we
      // need to call it.

      currentComponent.componentWillUpdate = function (p, s, c) {
        if (this.__e) {
          var tmp = prevScu; // Clear to avoid other sCU hooks from being called

          prevScu = undefined;
          updateHookState(p, s, c);
          prevScu = tmp;
        }

        if (prevCWU) prevCWU.call(this, p, s, c);
      };

      currentComponent.shouldComponentUpdate = updateHookState;
    }
  }

  return hookState.__N || hookState.__;
}
/**
 * @param {import('./internal.d.ts').Effect} callback
 * @param {unknown[]} args
 * @returns {void}
 */

function useEffect(callback, args) {
  /** @type {import('./internal.d.ts').EffectHookState} */
  var state = getHookState(currentIndex++, 3);

  if (!options.__s && argsChanged(state.__H, args)) {
    state.__ = callback;
    state._pendingArgs = args;

    currentComponent.__H.__h.push(state);
  }
}
/**
 * @param {import('./internal.d.ts').Effect} callback
 * @param {unknown[]} args
 * @returns {void}
 */

function useLayoutEffect(callback, args) {
  /** @type {import('./internal.d.ts').EffectHookState} */
  var state = getHookState(currentIndex++, 4);

  if (!options.__s && argsChanged(state.__H, args)) {
    state.__ = callback;
    state._pendingArgs = args;

    currentComponent.__h.push(state);
  }
}
/** @type {(initialValue: unknown) => unknown} */

function useRef(initialValue) {
  currentHook = 5;
  return useMemo(function () {
    return {
      current: initialValue
    };
  }, []);
}
/**
 * @param {object} ref
 * @param {() => object} createHandle
 * @param {unknown[]} args
 * @returns {void}
 */

function useImperativeHandle(ref, createHandle, args) {
  currentHook = 6;
  useLayoutEffect(function () {
    if (typeof ref == 'function') {
      ref(createHandle());
      return function () {
        return ref(null);
      };
    } else if (ref) {
      ref.current = createHandle();
      return function () {
        return ref.current = null;
      };
    }
  }, args == null ? args : args.concat(ref));
}
/**
 * @template {unknown} T
 * @param {() => T} factory
 * @param {unknown[]} args
 * @returns {T}
 */

function useMemo(factory, args) {
  /** @type {import('./internal.d.ts').MemoHookState<T>} */
  var state = getHookState(currentIndex++, 7);

  if (argsChanged(state.__H, args)) {
    state.__V = factory();
    state._pendingArgs = args;
    state.__h = factory;
    return state.__V;
  }

  return state.__;
}
/**
 * @param {() => void} callback
 * @param {unknown[]} args
 * @returns {() => void}
 */

function useCallback(callback, args) {
  currentHook = 8;
  return useMemo(function () {
    return callback;
  }, args);
}
/**
 * @param {import('./internal.d.ts').PreactContext} context
 */

function useContext(context) {
  var provider = currentComponent.context[context.__c]; // We could skip this call here, but than we'd not call
  // `options._hook`. We need to do that in order to make
  // the devtools aware of this hook.

  /** @type {import('./internal.d.ts').ContextHookState} */

  var state = getHookState(currentIndex++, 9); // The devtools needs access to the context object to
  // be able to pull of the default value when no provider
  // is present in the tree.

  state.c = context;
  if (!provider) return context.__; // This is probably not safe to convert to "!"

  if (state.__ == null) {
    state.__ = true;
    provider.sub(currentComponent);
  }

  return provider.props.value;
}
/**
 * Display a custom label for a custom hook for the devtools panel
 * @type {<T>(value: T, cb?: (value: T) => string | number) => void}
 */

function useDebugValue(value, formatter) {
  if (options.useDebugValue) {
    options.useDebugValue(formatter ? formatter(value) : value);
  }
}
/**
 * @param {(error: unknown, errorInfo: import('../index.d.ts').ErrorInfo) => void} cb
 * @returns {[unknown, () => void]}
 */

function useErrorBoundary(cb) {
  /** @type {import('./internal.d.ts').ErrorBoundaryHookState} */
  var state = getHookState(currentIndex++, 10);
  var errState = useState();
  state.__ = cb;

  if (!currentComponent.componentDidCatch) {
    currentComponent.componentDidCatch = function (err, errorInfo) {
      if (state.__) state.__(err, errorInfo);
      errState[1](err);
    };
  }

  return [errState[0], function () {
    errState[1](undefined);
  }];
}
/** @type {() => string} */

function useId() {
  /** @type {import('./internal.d.ts').IdHookState} */
  var state = getHookState(currentIndex++, 11);

  if (!state.__) {
    // Grab either the root node or the nearest async boundary node.

    /** @type {import('./internal.d.ts').VNode} */
    var root = currentComponent.__v;

    while (root !== null && !root.__m && root.__ !== null) {
      root = root.__;
    }

    var mask = root.__m || (root.__m = [0, 0]);
    state.__ = 'P' + mask[0] + '-' + mask[1]++;
  }

  return state.__;
}
/**
 * After paint effects consumer.
 */

function flushAfterPaintEffects() {
  var component;

  while (component = afterPaintEffects.shift()) {
    if (!component.__P || !component.__H) continue;

    try {
      component.__H.__h.forEach(invokeCleanup);

      component.__H.__h.forEach(invokeEffect);

      component.__H.__h = [];
    } catch (e) {
      component.__H.__h = [];

      options.__e(e, component.__v);
    }
  }
}

var HAS_RAF = typeof requestAnimationFrame == 'function';
/**
 * Schedule a callback to be invoked after the browser has a chance to paint a new frame.
 * Do this by combining requestAnimationFrame (rAF) + setTimeout to invoke a callback after
 * the next browser frame.
 *
 * Also, schedule a timeout in parallel to the the rAF to ensure the callback is invoked
 * even if RAF doesn't fire (for example if the browser tab is not visible)
 *
 * @param {() => void} callback
 */

function afterNextFrame(callback) {
  var done = function done() {
    clearTimeout(timeout);
    if (HAS_RAF) cancelAnimationFrame(raf);
    setTimeout(callback);
  };

  var timeout = setTimeout(done, RAF_TIMEOUT);
  var raf;

  if (HAS_RAF) {
    raf = requestAnimationFrame(done);
  }
} // Note: if someone used options.debounceRendering = requestAnimationFrame,
// then effects will ALWAYS run on the NEXT frame instead of the current one, incurring a ~16ms delay.
// Perhaps this is not such a big deal.

/**
 * Schedule afterPaintEffects flush after the browser paints
 * @param {number} newQueueLength
 * @returns {void}
 */


function afterPaint(newQueueLength) {
  if (newQueueLength === 1 || prevRaf !== options.requestAnimationFrame) {
    prevRaf = options.requestAnimationFrame;
    (prevRaf || afterNextFrame)(flushAfterPaintEffects);
  }
}
/**
 * @param {import('./internal.d.ts').HookState} hook
 * @returns {void}
 */


function invokeCleanup(hook) {
  // A hook cleanup can introduce a call to render which creates a new root, this will call options.vnode
  // and move the currentComponent away.
  var comp = currentComponent;
  var cleanup = hook.__c;

  if (typeof cleanup == 'function') {
    hook.__c = undefined;
    cleanup();
  }

  currentComponent = comp;
}
/**
 * Invoke a Hook's effect
 * @param {import('./internal.d.ts').EffectHookState} hook
 * @returns {void}
 */


function invokeEffect(hook) {
  // A hook call can introduce a call to render which creates a new root, this will call options.vnode
  // and move the currentComponent away.
  var comp = currentComponent;
  hook.__c = hook.__();
  currentComponent = comp;
}
/**
 * @param {unknown[]} oldArgs
 * @param {unknown[]} newArgs
 * @returns {boolean}
 */


function argsChanged(oldArgs, newArgs) {
  return !oldArgs || oldArgs.length !== newArgs.length || newArgs.some(function (arg, index) {
    return arg !== oldArgs[index];
  });
}
/**
 * @template Arg
 * @param {Arg} arg
 * @param {(arg: Arg) => any} f
 * @returns {any}
 */


function invokeOrReturn(arg, f) {
  return typeof f == 'function' ? f(arg) : f;
}

export { useCallback, useContext, useDebugValue, useEffect, useErrorBoundary, useId, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState };
//# sourceMappingURL=index.js.map
