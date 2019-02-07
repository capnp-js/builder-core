/* @flow */

import * as assert from "assert";
import { describe, it } from "mocha";

import { Unlimited } from "@capnp-js/base-arena";
import { Builder } from "@capnp-js/builder-arena";
import { root } from "@capnp-js/memory";
import { initStruct } from "../../src";

describe("initStruct", function () {
  it("creates a struct layout from struct metadata", function () {
    const arena = Builder.fresh(24, new Unlimited());
    const struct = initStruct(0, arena, root(arena), {
      data: 8,
      pointers: 16,
    });

    assert.equal(struct.level, 1);
    assert.equal(struct.arena, arena);
    assert.equal(struct.segment, arena.segment(0));
    assert.deepEqual(struct.layout, {
      tag: "struct",
      bytes: {data: 8, pointers: 16},
      dataSection: 8,
      pointersSection: 16,
      end: 32,
    });
  });
});
