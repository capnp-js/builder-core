/* @flow */

import test from "ava";

import { Unlimited } from "@capnp-js/base-arena";
import { Builder } from "@capnp-js/builder-arena";
import { initStruct } from "@capnp-js/builder-core";
import { root } from "@capnp-js/memory";

test("`initStruct`", t => {
  t.plan(4);

  const arena = Builder.fresh(24, new Unlimited());
  const struct = initStruct(0, arena, root(arena), {
    data: 8,
    pointers: 16,
  });
  t.is(struct.level, 1);
  t.is(struct.arena, arena);
  t.is(struct.segment, arena.segment(0));
  t.deepEqual(struct.layout, {
    tag: "struct",
    bytes: {data: 8, pointers: 16},
    dataSection: 8,
    pointersSection: 16,
    end: 32,
  });
});
