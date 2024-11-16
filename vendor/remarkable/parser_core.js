import Ruler from './ruler.js';

import block from './rules_core/block.js';
import abbr from './rules_core/abbr.js';
import references from './rules_core/references.js';
import inline from './rules_core/inline.js';
import footnote_tail from './rules_core/footnote_tail.js';
import abbr2 from './rules_core/abbr2.js';
import replacements from './rules_core/replacements.js';
import smartquotes from './rules_core/smartquotes.js';

/**
 * Core parser `rules`
 */

var _rules = [
  [ 'block',          block          ],
  [ 'abbr',           abbr           ],
  [ 'references',     references     ],
  [ 'inline',         inline         ],
  [ 'footnote_tail',  footnote_tail  ],
  [ 'abbr2',          abbr2          ],
  [ 'replacements',   replacements   ],
  [ 'smartquotes',    smartquotes    ],
];

/**
 * Class for top level (`core`) parser rules
 *
 * @api private
 */

export default function Core() {
  this.options = {};
  this.ruler = new Ruler();
  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}

/**
 * Process rules with the given `state`
 *
 * @param  {Object} `state`
 * @api private
 */

Core.prototype.process = function (state) {
  var i, l, rules;
  rules = this.ruler.getRules('');
  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};
