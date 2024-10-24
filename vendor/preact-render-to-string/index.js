import { options, h, Fragment } from '../preact/index.js';

var UNSAFE_NAME = /[\s\n\\/='"\0<>]/;
var NAMESPACE_REPLACE_REGEX = /^(xlink|xmlns|xml)([A-Z])/;
var HTML_LOWER_CASE = /^accessK|^auto[A-Z]|^cell|^ch|^col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z]/;
var SVG_CAMEL_CASE = /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/; // Boolean DOM properties that translate to enumerated ('true'/'false') attributes

var HTML_ENUMERATED = new Set(['draggable', 'spellcheck']); // DOM properties that should NOT have "px" added when numeric

var ENCODED_ENTITIES = /["&<]/;
/** @param {string} str */

function encodeEntities(str) {
  // Skip all work for strings with no entities needing encoding:
  if (str.length === 0 || ENCODED_ENTITIES.test(str) === false) return str;
  var last = 0,
      i = 0,
      out = '',
      ch = ''; // Seek forward in str until the next entity char:

  for (; i < str.length; i++) {
    switch (str.charCodeAt(i)) {
      case 34:
        ch = '&quot;';
        break;

      case 38:
        ch = '&amp;';
        break;

      case 60:
        ch = '&lt;';
        break;

      default:
        continue;
    } // Append skipped/buffered characters and the encoded entity:


    if (i !== last) out = out + str.slice(last, i);
    out = out + ch; // Start the next seek/buffer after the entity's offset:

    last = i + 1;
  }

  if (i !== last) out = out + str.slice(last, i);
  return out;
}
var JS_TO_CSS = {};
var IS_NON_DIMENSIONAL = new Set(['animation-iteration-count', 'border-image-outset', 'border-image-slice', 'border-image-width', 'box-flex', 'box-flex-group', 'box-ordinal-group', 'column-count', 'fill-opacity', 'flex', 'flex-grow', 'flex-negative', 'flex-order', 'flex-positive', 'flex-shrink', 'flood-opacity', 'font-weight', 'grid-column', 'grid-row', 'line-clamp', 'line-height', 'opacity', 'order', 'orphans', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'tab-size', 'widows', 'z-index', 'zoom']);
var CSS_REGEX = /[A-Z]/g; // Convert an Object style to a CSSText string

function styleObjToCss(s) {
  var str = '';

  for (var prop in s) {
    var val = s[prop];

    if (val != null && val !== '') {
      var name = prop[0] == '-' ? prop : JS_TO_CSS[prop] || (JS_TO_CSS[prop] = prop.replace(CSS_REGEX, '-$&').toLowerCase());
      var suffix = ';';

      if (typeof val === 'number' && // Exclude custom-attributes
      !name.startsWith('--') && !IS_NON_DIMENSIONAL.has(name)) {
        suffix = 'px;';
      }

      str = str + name + ':' + val + suffix;
    }
  }

  return str || undefined;
}

function markAsDirty() {
  this.__d = true;
}

function createComponent(vnode, context) {
  return {
    __v: vnode,
    context: context,
    props: vnode.props,
    // silently drop state updates
    setState: markAsDirty,
    forceUpdate: markAsDirty,
    __d: true,
    // hooks
    __h: new Array(0)
  };
} // Necessary for createContext api. Setting this property will pass

// Options hooks
var DIFF = '__b';
var RENDER = '__r';
var DIFFED = 'diffed';
var COMMIT = '__c';
var SKIP_EFFECTS = '__s';
var CATCH_ERROR = '__e'; // VNode properties

var COMPONENT = '__c';
var CHILDREN = '__k';
var PARENT = '__';

var VNODE = '__v';
var DIRTY = '__d';
var NEXT_STATE = '__s';

/**
 * Render Preact JSX + Components to an HTML string.
 * @param {VNode} vnode	JSX Element / VNode to render
 * @param {Object} [context={}] Initial root context object
 * @returns {string} serialized HTML
 */
function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }

        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }

    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }

    pact.s = state;
    pact.v = value;
    const observer = pact.o;

    if (observer) {
      observer(pact);
    }
  }
}
/**
 * @param {VNode} vnode
 * @param {Record<string, unknown>} context
 */


var _Pact = /*#__PURE__*/function () {
  function _Pact() {}

  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var result = new _Pact();
    var state = this.s;

    if (state) {
      var callback = state & 1 ? onFulfilled : onRejected;

      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }

        return result;
      } else {
        return this;
      }
    }

    this.o = function (_this) {
      try {
        var value = _this.v;

        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };

    return result;
  };

  return _Pact;
}();

function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}

function _for(test, update, body) {
  var stage;

  for (;;) {
    var shouldContinue = test();

    if (_isSettledPact(shouldContinue)) {
      shouldContinue = shouldContinue.v;
    }

    if (!shouldContinue) {
      return result;
    }

    if (shouldContinue.then) {
      stage = 0;
      break;
    }

    var result = body();

    if (result && result.then) {
      if (_isSettledPact(result)) {
        result = result.s;
      } else {
        stage = 1;
        break;
      }
    }

    if (update) {
      var updateValue = update();

      if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
        stage = 2;
        break;
      }
    }
  }

  var pact = new _Pact();

  var reject = _settle.bind(null, pact, 2);

  (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
  return pact;

  function _resumeAfterBody(value) {
    result = value;

    do {
      if (update) {
        updateValue = update();

        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          updateValue.then(_resumeAfterUpdate).then(void 0, reject);
          return;
        }
      }

      shouldContinue = test();

      if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
        _settle(pact, 1, result);

        return;
      }

      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        return;
      }

      result = body();

      if (_isSettledPact(result)) {
        result = result.v;
      }
    } while (!result || !result.then);

    result.then(_resumeAfterBody).then(void 0, reject);
  }

  function _resumeAfterTest(shouldContinue) {
    if (shouldContinue) {
      result = body();

      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
      } else {
        _resumeAfterBody(result);
      }
    } else {
      _settle(pact, 1, result);
    }
  }

  function _resumeAfterUpdate() {
    if (shouldContinue = test()) {
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
      } else {
        _resumeAfterTest(shouldContinue);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
}

function _finallyRethrows(body, finalizer) {
  try {
    var result = body();
  } catch (e) {
    return finalizer(true, e);
  }

  if (result && result.then) {
    return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
  }

  return finalizer(false, result);
}

var renderToStringAsync = function renderToStringAsync(vnode, context) {
  try {
    // Performance optimization: `renderToString` is synchronous and we
    // therefore don't execute any effects. To do that we pass an empty
    // array to `options._commit` (`__c`). But we can go one step further
    // and avoid a lot of dirty checks and allocations by setting
    // `options._skipEffects` (`__s`) too.
    var previousSkipEffects = options[SKIP_EFFECTS];
    options[SKIP_EFFECTS] = true; // store options hooks once before each synchronous render call

    beforeDiff = options[DIFF];
    afterDiff = options[DIFFED];
    renderHook = options[RENDER];
    ummountHook = options.unmount;
    var parent = h(Fragment, null);
    parent[CHILDREN] = [vnode];
    return Promise.resolve(_finallyRethrows(function () {
      return Promise.resolve(_renderToString(vnode, context || EMPTY_OBJ, false, undefined, parent, true, undefined)).then(function (rendered) {
        var _exit;

        var _temp3 = function () {
          if (isArray(rendered)) {
            var _temp4 = function _temp4() {
              var _resolved$join = _resolved.join(EMPTY_STR);

              _exit = 1;
              return _resolved$join;
            };

            var count = 0;
            var _resolved = rendered; // Resolving nested Promises with a maximum depth of 25

            var _temp5 = _for(function () {
              return !!_resolved.some(function (element) {
                return element && typeof element.then === 'function';
              }) && count++ < 25;
            }, void 0, function () {
              return Promise.resolve(Promise.all(_resolved)).then(function (_Promise$all) {
                _resolved = _Promise$all.flat();
              });
            });

            return _temp5 && _temp5.then ? _temp5.then(_temp4) : _temp4(_temp5);
          }
        }();

        return _temp3 && _temp3.then ? _temp3.then(function (_result2) {
          return _exit ? _result2 : rendered;
        }) : _exit ? _temp3 : rendered;
      });
    }, function (_wasThrown, _result) {
      // options._commit, we don't schedule any effects in this library right now,
      // so we can pass an empty queue to this hook.
      if (options[COMMIT]) options[COMMIT](vnode, EMPTY_ARR);
      options[SKIP_EFFECTS] = previousSkipEffects;
      EMPTY_ARR.length = 0;
      if (_wasThrown) throw _result;
      return _result;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var isArray = Array.isArray;
var assign = Object.assign;
var EMPTY_STR = ''; // Global state for the current render pass

var beforeDiff, afterDiff, renderHook, ummountHook;
/**
 * Render Preact JSX + Components to an HTML string.
 * @param {VNode} vnode	JSX Element / VNode to render
 * @param {Object} [context={}] Initial root context object
 * @param {RendererState} [_rendererState] for internal use
 * @returns {string} serialized HTML
 */

function renderToString(vnode, context, _rendererState) {
  // Performance optimization: `renderToString` is synchronous and we
  // therefore don't execute any effects. To do that we pass an empty
  // array to `options._commit` (`__c`). But we can go one step further
  // and avoid a lot of dirty checks and allocations by setting
  // `options._skipEffects` (`__s`) too.
  var previousSkipEffects = options[SKIP_EFFECTS];
  options[SKIP_EFFECTS] = true; // store options hooks once before each synchronous render call

  beforeDiff = options[DIFF];
  afterDiff = options[DIFFED];
  renderHook = options[RENDER];
  ummountHook = options.unmount;
  var parent = h(Fragment, null);
  parent[CHILDREN] = [vnode];

  try {
    var rendered = _renderToString(vnode, context || EMPTY_OBJ, false, undefined, parent, false, _rendererState);

    if (isArray(rendered)) {
      return rendered.join(EMPTY_STR);
    }

    return rendered;
  } catch (e) {
    if (e.then) {
      throw new Error('Use "renderToStringAsync" for suspenseful rendering.');
    }

    throw e;
  } finally {
    // options._commit, we don't schedule any effects in this library right now,
    // so we can pass an empty queue to this hook.
    if (options[COMMIT]) options[COMMIT](vnode, EMPTY_ARR);
    options[SKIP_EFFECTS] = previousSkipEffects;
    EMPTY_ARR.length = 0;
  }
}

function renderClassComponent(vnode, context) {
  var type =
  /** @type {import("preact").ComponentClass<typeof vnode.props>} */
  vnode.type;
  var isMounting = true;
  var c;

  if (vnode[COMPONENT]) {
    isMounting = false;
    c = vnode[COMPONENT];
    c.state = c[NEXT_STATE];
  } else {
    c = new type(vnode.props, context);
  }

  vnode[COMPONENT] = c;
  c[VNODE] = vnode;
  c.props = vnode.props;
  c.context = context; // turn off stateful re-rendering:

  c[DIRTY] = true;
  if (c.state == null) c.state = EMPTY_OBJ;

  if (c[NEXT_STATE] == null) {
    c[NEXT_STATE] = c.state;
  }

  if (type.getDerivedStateFromProps) {
    c.state = assign({}, c.state, type.getDerivedStateFromProps(c.props, c.state));
  } else if (isMounting && c.componentWillMount) {
    c.componentWillMount(); // If the user called setState in cWM we need to flush pending,
    // state updates. This is the same behaviour in React.

    c.state = c[NEXT_STATE] !== c.state ? c[NEXT_STATE] : c.state;
  } else if (!isMounting && c.componentWillUpdate) {
    c.componentWillUpdate();
  }

  if (renderHook) renderHook(vnode);
  return c.render(c.props, c.state, context);
}
/**
 * Recursively render VNodes to HTML.
 * @param {VNode|any} vnode
 * @param {any} context
 * @param {boolean} isSvgMode
 * @param {any} selectValue
 * @param {VNode} parent
 * @param {boolean} asyncMode
 * @param {RendererState | undefined} [renderer]
 * @returns {string | Promise<string> | (string | Promise<string>)[]}
 */


function _renderToString(vnode, context, isSvgMode, selectValue, parent, asyncMode, renderer) {
  // Ignore non-rendered VNodes/values
  if (vnode == null || vnode === true || vnode === false || vnode === EMPTY_STR) {
    return EMPTY_STR;
  }

  var vnodeType = typeof vnode; // Text VNodes: escape as HTML

  if (vnodeType != 'object') {
    if (vnodeType == 'function') return EMPTY_STR;
    return vnodeType == 'string' ? encodeEntities(vnode) : vnode + EMPTY_STR;
  } // Recurse into children / Arrays


  if (isArray(vnode)) {
    var rendered = EMPTY_STR,
        renderArray;
    parent[CHILDREN] = vnode;

    for (var i = 0; i < vnode.length; i++) {
      var child = vnode[i];
      if (child == null || typeof child == 'boolean') continue;

      var childRender = _renderToString(child, context, isSvgMode, selectValue, parent, asyncMode, renderer);

      if (typeof childRender == 'string') {
        rendered = rendered + childRender;
      } else {
        if (!renderArray) {
          renderArray = [];
        }

        if (rendered) renderArray.push(rendered);
        rendered = EMPTY_STR;

        if (isArray(childRender)) {
          var _renderArray;

          (_renderArray = renderArray).push.apply(_renderArray, childRender);
        } else {
          renderArray.push(childRender);
        }
      }
    }

    if (renderArray) {
      if (rendered) renderArray.push(rendered);
      return renderArray;
    }

    return rendered;
  } // VNodes have {constructor:undefined} to prevent JSON injection:


  if (vnode.constructor !== undefined) return EMPTY_STR;
  vnode[PARENT] = parent;
  if (beforeDiff) beforeDiff(vnode);
  var type = vnode.type,
      props = vnode.props; // Invoke rendering on Components

  if (typeof type == 'function') {
    var cctx = context,
        contextType,
        _rendered,
        component;

    if (type === Fragment) {
      // Serialized precompiled JSX.
      if ('tpl' in props) {
        var out = EMPTY_STR;

        for (var _i = 0; _i < props.tpl.length; _i++) {
          out = out + props.tpl[_i];

          if (props.exprs && _i < props.exprs.length) {
            var value = props.exprs[_i];
            if (value == null) continue; // Check if we're dealing with a vnode or an array of nodes

            if (typeof value == 'object' && (value.constructor === undefined || isArray(value))) {
              out = out + _renderToString(value, context, isSvgMode, selectValue, vnode, asyncMode, renderer);
            } else {
              // Values are pre-escaped by the JSX transform
              out = out + value;
            }
          }
        }

        return out;
      } else if ('UNSTABLE_comment' in props) {
        // Fragments are the least used components of core that's why
        // branching here for comments has the least effect on perf.
        return '<!--' + encodeEntities(props.UNSTABLE_comment) + '-->';
      }

      _rendered = props.children;
    } else {
      contextType = type.contextType;

      if (contextType != null) {
        var provider = context[contextType.__c];
        cctx = provider ? provider.props.value : contextType.__;
      }

      var isClassComponent = type.prototype && typeof type.prototype.render == 'function';

      if (isClassComponent) {
        _rendered =
        /**#__NOINLINE__**/
        renderClassComponent(vnode, cctx);
        component = vnode[COMPONENT];
      } else {
        vnode[COMPONENT] = component =
        /**#__NOINLINE__**/
        createComponent(vnode, cctx); // If a hook invokes setState() to invalidate the component during rendering,
        // re-render it up to 25 times to allow "settling" of memoized states.
        // Note:
        //   This will need to be updated for Preact 11 to use internal.flags rather than component._dirty:
        //   https://github.com/preactjs/preact/blob/d4ca6fdb19bc715e49fd144e69f7296b2f4daa40/src/diff/component.js#L35-L44

        var count = 0;

        while (component[DIRTY] && count++ < 25) {
          component[DIRTY] = false;
          if (renderHook) renderHook(vnode);
          _rendered = type.call(component, props, cctx);
        }

        component[DIRTY] = true;
      }

      if (component.getChildContext != null) {
        context = assign({}, context, component.getChildContext());
      }

      if (isClassComponent && options.errorBoundaries && (type.getDerivedStateFromError || component.componentDidCatch)) {
        // When a component returns a Fragment node we flatten it in core, so we
        // need to mirror that logic here too
        var _isTopLevelFragment = _rendered != null && _rendered.type === Fragment && _rendered.key == null && _rendered.props.tpl == null;

        _rendered = _isTopLevelFragment ? _rendered.props.children : _rendered;

        try {
          return _renderToString(_rendered, context, isSvgMode, selectValue, vnode, asyncMode, renderer);
        } catch (err) {
          if (type.getDerivedStateFromError) {
            component[NEXT_STATE] = type.getDerivedStateFromError(err);
          }

          if (component.componentDidCatch) {
            component.componentDidCatch(err, EMPTY_OBJ);
          }

          if (component[DIRTY]) {
            _rendered = renderClassComponent(vnode, context);
            component = vnode[COMPONENT];

            if (component.getChildContext != null) {
              context = assign({}, context, component.getChildContext());
            }

            var _isTopLevelFragment2 = _rendered != null && _rendered.type === Fragment && _rendered.key == null && _rendered.props.tpl == null;

            _rendered = _isTopLevelFragment2 ? _rendered.props.children : _rendered;
            return _renderToString(_rendered, context, isSvgMode, selectValue, vnode, asyncMode, renderer);
          }

          return EMPTY_STR;
        } finally {
          if (afterDiff) afterDiff(vnode);
          vnode[PARENT] = null;
          if (ummountHook) ummountHook(vnode);
        }
      }
    } // When a component returns a Fragment node we flatten it in core, so we
    // need to mirror that logic here too


    var isTopLevelFragment = _rendered != null && _rendered.type === Fragment && _rendered.key == null && _rendered.props.tpl == null;
    _rendered = isTopLevelFragment ? _rendered.props.children : _rendered;

    try {
      // Recurse into children before invoking the after-diff hook
      var str = _renderToString(_rendered, context, isSvgMode, selectValue, vnode, asyncMode, renderer);

      if (afterDiff) afterDiff(vnode); // when we are dealing with suspense we can't do this...

      vnode[PARENT] = null;
      if (options.unmount) options.unmount(vnode);
      return str;
    } catch (error) {
      if (!asyncMode && renderer && renderer.onError) {
        var res = renderer.onError(error, vnode, function (child) {
          return _renderToString(child, context, isSvgMode, selectValue, vnode, asyncMode, renderer);
        });
        if (res !== undefined) return res;
        var errorHook = options[CATCH_ERROR];
        if (errorHook) errorHook(error, vnode);
        return EMPTY_STR;
      }

      if (!asyncMode) throw error;
      if (!error || typeof error.then != 'function') throw error;

      var renderNestedChildren = function renderNestedChildren() {
        try {
          return _renderToString(_rendered, context, isSvgMode, selectValue, vnode, asyncMode, renderer);
        } catch (e) {
          if (!e || typeof e.then != 'function') throw e;
          return e.then(function () {
            return _renderToString(_rendered, context, isSvgMode, selectValue, vnode, asyncMode, renderer);
          }, renderNestedChildren);
        }
      };

      return error.then(renderNestedChildren);
    }
  } // Serialize Element VNodes to HTML


  var s = '<' + type,
      html = EMPTY_STR,
      children;

  for (var name in props) {
    var v = props[name];

    if (typeof v == 'function' && name !== 'class' && name !== 'className') {
      continue;
    }

    switch (name) {
      case 'children':
        children = v;
        continue;
      // VDOM-specific props

      case 'key':
      case 'ref':
      case '__self':
      case '__source':
        continue;
      // prefer for/class over htmlFor/className

      case 'htmlFor':
        if ('for' in props) continue;
        name = 'for';
        break;

      case 'className':
        if ('class' in props) continue;
        name = 'class';
        break;
      // Form element reflected properties

      case 'defaultChecked':
        name = 'checked';
        break;

      case 'defaultSelected':
        name = 'selected';
        break;
      // Special value attribute handling

      case 'defaultValue':
      case 'value':
        name = 'value';

        switch (type) {
          // <textarea value="a&b"> --> <textarea>a&amp;b</textarea>
          case 'textarea':
            children = v;
            continue;
          // <select value> is serialized as a selected attribute on the matching option child

          case 'select':
            selectValue = v;
            continue;
          // Add a selected attribute to <option> if its value matches the parent <select> value

          case 'option':
            if (selectValue == v && !('selected' in props)) {
              s = s + ' selected';
            }

            break;
        }

        break;

      case 'dangerouslySetInnerHTML':
        html = v && v.__html;
        continue;
      // serialize object styles to a CSS string

      case 'style':
        if (typeof v === 'object') {
          v = styleObjToCss(v);
        }

        break;

      case 'acceptCharset':
        name = 'accept-charset';
        break;

      case 'httpEquiv':
        name = 'http-equiv';
        break;

      default:
        {
          if (NAMESPACE_REPLACE_REGEX.test(name)) {
            name = name.replace(NAMESPACE_REPLACE_REGEX, '$1:$2').toLowerCase();
          } else if (UNSAFE_NAME.test(name)) {
            continue;
          } else if ((name[4] === '-' || HTML_ENUMERATED.has(name)) && v != null) {
            // serialize boolean aria-xyz or enumerated attribute values as strings
            v = v + EMPTY_STR;
          } else if (isSvgMode) {
            if (SVG_CAMEL_CASE.test(name)) {
              name = name === 'panose1' ? 'panose-1' : name.replace(/([A-Z])/g, '-$1').toLowerCase();
            }
          } else if (HTML_LOWER_CASE.test(name)) {
            name = name.toLowerCase();
          }
        }
    } // write this attribute to the buffer


    if (v != null && v !== false) {
      if (v === true || v === EMPTY_STR) {
        s = s + ' ' + name;
      } else {
        s = s + ' ' + name + '="' + (typeof v == 'string' ? encodeEntities(v) : v + EMPTY_STR) + '"';
      }
    }
  }

  if (UNSAFE_NAME.test(type)) {
    // this seems to performs a lot better than throwing
    // return '<!-- -->';
    throw new Error(type + " is not a valid HTML tag name in " + s + ">");
  }

  if (html) ; else if (typeof children === 'string') {
    // single text child
    html = encodeEntities(children);
  } else if (children != null && children !== false && children !== true) {
    // recurse into this element VNode's children
    var childSvgMode = type === 'svg' || type !== 'foreignObject' && isSvgMode;
    html = _renderToString(children, context, childSvgMode, selectValue, vnode, asyncMode, renderer);
  }

  if (afterDiff) afterDiff(vnode); // TODO: this was commented before

  vnode[PARENT] = null;
  if (ummountHook) ummountHook(vnode); // Emit self-closing tag for empty void elements:

  if (!html && SELF_CLOSING.has(type)) {
    return s + '/>';
  }

  var endTag = '</' + type + '>';
  var startTag = s + '>';
  if (isArray(html)) return [startTag].concat(html, [endTag]);else if (typeof html != 'string') return [startTag, html, endTag];
  return startTag + html + endTag;
}

var SELF_CLOSING = new Set(['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
var render = renderToString;
var renderToStaticMarkup = renderToString;

export default renderToString;
export { render, renderToStaticMarkup, renderToString, renderToStringAsync };
//# sourceMappingURL=index.js.map
