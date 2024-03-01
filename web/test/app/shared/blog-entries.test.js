import { assertEquals } from '../../../deps/testing.js';
import { toTagColorCssClass } from '../../../app/shared/blog-entries.js';

Deno.test('should convert tag to tag color css class based on tag content', () => {
  // int presentation of 'a' is 97.
  assertEquals(toTagColorCssClass('a'), 'blog-entry__tag__color-7');
  assertEquals(toTagColorCssClass('aa'), 'blog-entry__tag__color-4');
  // int presentation of 'git' is 103 + 105 + 116 = 324
  assertEquals(toTagColorCssClass('git'), 'blog-entry__tag__color-4');
});
